'use client';

import { useId, useRef, useState, type ReactNode } from 'react';
import {
  CheckField,
  ErrorSummary,
  LABEL_BASE,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/site/fields';
import { StepBar } from '@/components/site/StepBar';
import { SITE_SHELL } from '@/components/site/styles';
import { yen } from '@/components/site/format';
import { formatLongJa } from '@/components/site/calendar';
import {
  email as vEmail,
  listErrors,
  phone as vPhone,
  required,
  trim,
  agreed,
  type FieldError,
} from '@/components/site/validate';
import { BD_BTN_PRIMARY, BD_BTN_SECONDARY } from '../_ui';
import {
  EMPTY_CART,
  HOLD_DEADLINE,
  HOLD_TERMS,
  ITEMS,
  KITCHEN_NOTE,
  MAX_PER_ITEM,
  PICKUP_SLOTS,
  allergenLabel,
  cartCount,
  cartTotal,
  formatMonthDay,
  pickupDates,
  type BreadItem,
  type Cart,
  type ItemId,
} from '../_data';
import { OrderPanel } from './OrderPanel';
import { SitePhoto } from '@/components/site/SitePhoto';

/* ============================================================================
 * パンの取り置き。**この画面の終点は「確認」**。
 *
 * ■ 送らない・保存しない
 *   最後のボタンは「入力内容を確認する」。押すと入力チェックが走り、通れば
 *   同じルートのまま確認表示に切り替わる。「取り置きを受け付けました」とは
 *   出さない——取り置きは成立していないので、それは事実と違う。
 *   書き出しの3枚目（受け付け完了）にあたる内容は、すでに受け付けてある
 *   1件として `/pickup/status` に置いた。直リンクで「完了しました」だけが
 *   開ける状態を作らないための分け方である。
 *
 * ■ `<form>` を使わない
 *   `<form>` はハイドレート前に Enter を押されると、現在の URL へ GET する。
 *   氏名・メール・電話が**そのままクエリ文字列に載る**。URL は履歴にも
 *   リファラにもアクセスログにも残るので、起こせない形にしておく。
 *   入力欄は `div role="group"`、ボタンは全部 `type="button"`。
 *
 * ■ カード番号の入力欄を置かない
 *   支払いは受け取り時に店頭。書き出した画面にも欄は無いが、置かない理由は
 *   「描かれていないから」ではない。公開されるページに決済の形をした欄を
 *   置くと、本物だと思った人が本物の番号を打つ。
 *
 * ■ 数量は3つの手で動かせる
 *   − / ＋ のボタンと、欄への直接入力。どれで動かしても同じ関数を通り、
 *   0〜10 に丸められる（丸める前の値を状態に入れない）。
 * ==========================================================================*/

const FIELD_ORDER = ['name', 'email', 'tel', 'agree'] as const;

const FIELD_LABELS: Record<string, string> = {
  name: 'お名前',
  email: 'メールアドレス',
  tel: '電話番号',
  agree: 'アレルゲン表示とキャンセル条件の確認',
};

/** 0〜MAX_PER_ITEM に丸める。欄に直接打たれた値もここを通す。 */
function clampQty(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(MAX_PER_ITEM, Math.floor(value));
}

export function PickupFlow({
  initialItem,
}: {
  /** メニューから `?bread=<id>` で来たときに、1つ入れた状態で開く。 */
  initialItem?: ItemId;
}) {
  const uid = useId().replace(/:/g, '');
  const id = (k: string) => `${uid}-${k}`;
  const summaryRef = useRef<HTMLDivElement>(null);
  const base = `/`;

  const dates = pickupDates();

  const [cart, setCart] = useState<Cart>(
    initialItem ? { ...EMPTY_CART, [initialItem]: 1 } : EMPTY_CART,
  );
  const [pickupDate, setPickupDate] = useState(dates[0]);
  const [slot, setSlot] = useState(PICKUP_SLOTS[0]);

  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [tel, setTel] = useState('');
  const [request, setRequest] = useState('');
  const [agree, setAgree] = useState(false);

  /** 1 = パンと受け取り日時 / 2 = お客様情報 / 3 = 入力内容の確認 */
  const [step, setStep] = useState<1 | 2 | 3>(1);
  /** 入力チェックの結果を出すのは、いちど次へ進もうとしてから。 */
  const [checkedCart, setCheckedCart] = useState(false);
  const [checkedGuest, setCheckedGuest] = useState(false);

  const count = cartCount(cart);
  const total = cartTotal(cart);

  function setQty(itemId: ItemId, next: number) {
    setCart((c) => ({ ...c, [itemId]: clampQty(next) }));
  }

  const cartError: FieldError =
    count === 0 ? '取り置きするパンを1つ以上選んでください。' : null;

  const guestErrors: Record<string, FieldError> = {
    name: required(name, 'お名前'),
    email: vEmail(mail),
    tel: vPhone(tel),
    agree: agreed(agree, 'アレルゲン表示とキャンセル条件'),
  };

  const guestItems = checkedGuest
    ? listErrors(FIELD_ORDER, guestErrors, FIELD_LABELS)
    : [];
  const gerr = (k: string) => (checkedGuest ? (guestErrors[k] ?? null) : null);

  function toGuest() {
    setCheckedCart(true);
    if (cartError) {
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStep(2);
    window.requestAnimationFrame(() => {
      document.getElementById(id('step-head'))?.focus();
    });
  }

  function toConfirm() {
    setCheckedGuest(true);
    if (FIELD_ORDER.some((k) => guestErrors[k])) {
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStep(3);
    window.requestAnimationFrame(() => {
      document.getElementById(id('step-head'))?.focus();
    });
  }

  function back(to: 1 | 2) {
    setStep(to);
    window.requestAnimationFrame(() => {
      document.getElementById(id('step-head'))?.focus();
    });
  }

  const steps = ['パンと受け取り日時', 'お客様情報', '入力内容の確認'];

  return (
    <div className={`${SITE_SHELL} pb-24 pt-8 md:pt-10`}>
      <StepBar steps={steps} current={step} className="mb-10" />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-14">
        {/* ------------------------------------------------------------ 左 */}
        <div className="min-w-0">
          {/* ---------------------------------------------- 01 パンと日時 */}
          {step === 1 && (
            <div role="group" aria-label="取り置きするパンと受け取り日時">
              <p className="bd-label text-[11px] uppercase text-[var(--sub)]">
                Pick up
              </p>
              <h1
                id={id('step-head')}
                tabIndex={-1}
                className="mt-3 text-[32px] leading-[1.3] text-[var(--ink)] md:text-[40px]"
              >
                パンを取り置き
              </h1>
              <p className="mt-3 max-w-[36em] text-[14px] leading-[1.9] text-[var(--sub)]">
                {HOLD_DEADLINE}まで受け付けています。お支払いは受け取り時に店頭で。
              </p>

              {checkedCart && cartError && (
                <div ref={summaryRef} className="mt-8">
                  <ErrorSummary
                    id={id('cart-summary')}
                    title="入力を確認してください（1件）"
                    items={[
                      { key: 'cart', label: '取り置きするパン', message: cartError },
                    ]}
                    fieldId={() => id(`qty-${ITEMS[0].id}`)}
                  />
                </div>
              )}

              <ul role="list" className="mt-8 border-t border-[var(--line)]">
                {ITEMS.map((it, i) => (
                  <li
                    /*
                     * grid ではなく flex-wrap で組む。数量の増減は
                     * 48 + 56 + 48 = 152px の固定幅を持っていて、2列固定にすると
                     * 画像の幅ぶんだけ行の最小幅が増え、極端に狭い幅（文字スケールを
                     * 大きく上げた状態）でページ全体に横スクロールが出る。
                     * 折り返せる形にしておけば、文章が画像の下に回って収まる。
                     */
                    key={it.id}
                    className="flex flex-wrap items-start gap-x-5 gap-y-4 border-b border-[var(--line)] py-6"
                  >
                    <SitePhoto
                      /* `aspect-square` と書かない。検査 [5] が決済 SDK（square）を
                         文字列で探していて、クラス名でも当たる。 */
                      src={it.photo}
                      width={700}
                      height={525}
                      eager={i === 0}
                      className={`${it.tone} h-[92px] w-[92px] shrink-0 rounded-[8px] sm:h-[120px] sm:w-[120px]`}
                    />
                    <div className="min-w-0 flex-1 basis-[190px]">
                      <h2 className="text-[17px] font-semibold text-[var(--ink)]">
                        {it.name}
                      </h2>
                      <p className="mt-1 text-[13px] tabular-nums text-[var(--sub)]">
                        {yen(it.price)} / {allergenLabel(it)}
                      </p>
                      <QtyStepper
                        id={id(`qty-${it.id}`)}
                        item={it}
                        qty={cart[it.id]}
                        onQty={(n) => setQty(it.id, n)}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[12px] leading-[1.9] text-[var(--sub)]">
                1品につき{MAX_PER_ITEM}個までお受けします。それ以上は店舗へご相談ください。
                <br />
                {KITCHEN_NOTE}
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <SelectField
                  id={id('date')}
                  label="受け取り日"
                  requiredMark
                  value={pickupDate}
                  onChange={setPickupDate}
                  options={dates.map((d) => ({
                    value: d,
                    label: formatLongJa(d),
                  }))}
                  hint="水曜定休のため、水曜日は選べません。"
                />
                <SelectField
                  id={id('slot')}
                  label="受け取り時間"
                  requiredMark
                  value={slot}
                  onChange={setSlot}
                  options={PICKUP_SLOTS.map((s) => ({ value: s, label: s }))}
                  hint="30分の枠でご用意します。"
                />
              </div>
            </div>
          )}

          {/* -------------------------------------------- 02 お客様情報 */}
          {step === 2 && (
            <div role="group" aria-label="お客様情報の入力">
              <p className="bd-label text-[11px] uppercase text-[var(--sub)]">
                Your details
              </p>
              <h1
                id={id('step-head')}
                tabIndex={-1}
                className="mt-3 text-[32px] leading-[1.3] text-[var(--ink)] md:text-[40px]"
              >
                お客様情報
              </h1>
              <p className="mt-3 max-w-[36em] text-[14px] leading-[1.9] text-[var(--sub)]">
                受け取りの当日、カウンターでお名前をお伺いします。
                <span aria-hidden="true">*</span> は必須項目です。
              </p>

              {guestItems.length > 0 && (
                <div ref={summaryRef} className="mt-8">
                  <ErrorSummary
                    id={id('guest-summary')}
                    title={`入力を確認してください（${guestItems.length}件）`}
                    items={guestItems}
                    fieldId={(k) => id(k)}
                  />
                </div>
              )}

              <div className="mt-8 space-y-5">
                <TextField
                  id={id('name')}
                  label="お名前"
                  value={name}
                  onChange={setName}
                  placeholder="例：山田 花子"
                  autoComplete="name"
                  requiredMark
                  error={gerr('name')}
                />
                <TextField
                  id={id('email')}
                  label="メールアドレス"
                  type="email"
                  inputMode="email"
                  value={mail}
                  onChange={setMail}
                  placeholder="例：hanako@example.com"
                  autoComplete="email"
                  requiredMark
                  error={gerr('email')}
                />
                <TextField
                  id={id('tel')}
                  label="電話番号"
                  type="tel"
                  inputMode="tel"
                  value={tel}
                  onChange={setTel}
                  placeholder="例：050-0123-4567"
                  autoComplete="tel"
                  requiredMark
                  error={gerr('tel')}
                  hint="ご用意ができないときのご連絡に使います。"
                />
                <TextAreaField
                  id={id('request')}
                  label="ご要望（任意）"
                  value={request}
                  onChange={setRequest}
                  placeholder="袋分けなどのご希望をご記入ください"
                  rows={3}
                />
              </div>

              <div className="mt-10 border-t border-[var(--line)] pt-6">
                <ul className="space-y-1 text-[12px] leading-[1.8] text-[var(--sub)]">
                  {HOLD_TERMS.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                  <li>{KITCHEN_NOTE}</li>
                </ul>

                <CheckField
                  id={id('agree')}
                  className="mt-5"
                  checked={agree}
                  onChange={setAgree}
                  error={gerr('agree')}
                  label="アレルゲン表示とキャンセル条件を確認しました"
                />
              </div>
            </div>
          )}

          {/* ------------------------------------------------ 03 確認 */}
          {step === 3 && (
            <div>
              <p className="bd-label text-[11px] uppercase text-[var(--sub)]">
                Your order
              </p>
              <h1
                id={id('step-head')}
                tabIndex={-1}
                className="mt-3 text-[32px] leading-[1.3] text-[var(--ink)] md:text-[40px]"
              >
                取り置き内容の確認
              </h1>

              <div className="mt-6 rounded-[var(--field-radius)] border border-[var(--brick)] bg-[var(--paper)] px-5 py-4">
                <p className="text-[14px] font-bold leading-[1.8] text-[var(--ink)]">
                  ここまでが確認です。まだ取り置きは確定していません。
                </p>
                <p className="mt-2 text-[13px] leading-[1.9] text-[var(--sub)]">
                  入力した内容は送信も保存もされません。ブラウザを閉じれば残りません。
                </p>
              </div>

              <dl className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
                <Row label="受け取り">
                  {formatMonthDay(pickupDate)}{' '}
                  <span className="tabular-nums">{slot}</span>
                </Row>
                <Row label="取り置きするパン">
                  <ul role="list" className="space-y-1">
                    {ITEMS.filter((it) => cart[it.id] > 0).map((it) => (
                      <li key={it.id} className="tabular-nums">
                        {it.name} ×{cart[it.id]}　{yen(it.price * cart[it.id])}
                      </li>
                    ))}
                  </ul>
                </Row>
                <Row label="お名前">{trim(name)}</Row>
                <Row label="メールアドレス">{trim(mail)}</Row>
                <Row label="電話番号">{trim(tel)}</Row>
                <Row label="ご要望">
                  {trim(request) === '' ? 'なし' : trim(request)}
                </Row>
                <Row label="お支払い">
                  受け取り時に店頭で
                  <span className="text-[20px] font-bold tabular-nums">
                    {yen(total)}
                  </span>
                  <br />
                  <span className="text-[12px] text-[var(--sub)]">
                    税込。カード番号はこの画面では承りません。
                  </span>
                </Row>
              </dl>
            </div>
          )}

          {/* --------------------------------------------------- ボタン */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {step === 1 && (
              <button type="button" onClick={toGuest} className={BD_BTN_PRIMARY}>
                お客様情報へ
                <span aria-hidden="true">&rarr;</span>
              </button>
            )}
            {step === 2 && (
              <>
                <button type="button" onClick={toConfirm} className={BD_BTN_PRIMARY}>
                  入力内容を確認する
                  <span aria-hidden="true">&rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => back(1)}
                  className={BD_BTN_SECONDARY}
                >
                  パン・受け取り日時を変更
                </button>
              </>
            )}
            {step === 3 && (
              <>
                <button
                  type="button"
                  onClick={() => back(2)}
                  className={BD_BTN_SECONDARY}
                >
                  入力内容を修正する
                </button>
                <a href={base} className={BD_BTN_SECONDARY}>
                  トップへ戻る
                </a>
              </>
            )}
          </div>

          {step === 2 && (
            <p className="mt-3 text-[12px] leading-[1.8] text-[var(--sub)]">
              押すと入力内容の確認に進みます。ここで取り置きは確定しません。
            </p>
          )}
        </div>

        {/* ------------------------------------------------------------ 右 */}
        <aside className="min-w-0 lg:sticky lg:top-[88px] lg:self-start">
          <OrderPanel
            cart={cart}
            pickupDate={pickupDate}
            slot={slot}
            showPickup={step !== 1}
          />
          <p className="mt-4 text-[12px] leading-[1.9] text-[var(--sub)]">
            変更・キャンセルは{HOLD_DEADLINE}まで。
            <br />
            受け取りに遅れる場合は店舗へご連絡ください。
          </p>
        </aside>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * 数量の増減
 * ------------------------------------------------------------------------- */

function QtyStepper({
  id,
  item,
  qty,
  onQty,
}: {
  id: string;
  item: BreadItem;
  qty: number;
  onQty: (next: number) => void;
}) {
  const atMin = qty <= 0;
  const atMax = qty >= MAX_PER_ITEM;

  /*
   * 欄は type="text" + inputMode="numeric"。
   * type="number" は端末によって上下の矢印が出て、幅が品名の行とそろわない。
   * 数字以外は入った時点で落とし、0〜10 に丸めてから状態に入れる
   * （丸める前の値を状態に置くと、合計だけが上限を超える瞬間ができる）。
   */
  return (
    <div className="mt-3">
      <label htmlFor={id} className={LABEL_BASE}>
        数量
        <span className="sr-only">（{item.name}）</span>
      </label>
      {/*
        器に overflow-hidden を付けて角を落とさない。overflow は子孫の
        position: sticky を無言で殺すプロパティで、検査 [11] が layout の包み div を
        走査している。角は両端のボタンに直接付ける。
      */}
      <div className="mt-2 inline-flex items-stretch rounded-[var(--field-radius)] border border-[var(--line-strong)] bg-[var(--paper)]">
        <button
          type="button"
          onClick={() => onQty(qty - 1)}
          disabled={atMin}
          aria-label={`${item.short}を1つ減らす`}
          className="min-h-[48px] w-[48px] rounded-l-[var(--field-radius)] text-[18px] font-semibold text-[var(--ink)] transition duration-150 hover:bg-[var(--soft)] disabled:text-[var(--line-strong)] disabled:hover:bg-transparent"
        >
          <span aria-hidden="true">&minus;</span>
        </button>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={String(qty)}
          onChange={(e) => onQty(Number(e.target.value.replace(/[^0-9]/g, '')))}
          /*
           * `min-w-0` を落とさないこと。この欄は inline-flex の子で、
           * flex の子は既定で `min-width: auto`＝min-content より縮まない。
           * `<input>` の min-content は size 属性ぶん（既定20文字ぶん≒153px）
           * あるので、`w-[56px]` を書いても 153px のまま描かれ、狭い幅で
           * ページ全体に横スクロールが出る。
           */
          className="w-[56px] min-w-0 border-x border-[var(--line-strong)] bg-[var(--paper)] px-0 py-0 text-center text-[16px] font-semibold tabular-nums text-[var(--ink)] focus:border-[var(--focus-ring)] focus:ring-0"
        />
        <button
          type="button"
          onClick={() => onQty(qty + 1)}
          disabled={atMax}
          aria-label={`${item.short}を1つ増やす`}
          className="min-h-[48px] w-[48px] rounded-r-[var(--field-radius)] text-[18px] font-semibold text-[var(--ink)] transition duration-150 hover:bg-[var(--soft)] disabled:text-[var(--line-strong)] disabled:hover:bg-transparent"
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-6">
      <dt className="text-[13px] font-semibold text-[var(--sub)]">{label}</dt>
      <dd className="text-[14px] leading-[1.9] text-[var(--ink)]">{children}</dd>
    </div>
  );
}
