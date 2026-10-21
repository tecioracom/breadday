'use client';

import { useId, useState } from 'react';
import {
  SelectField,
  TextAreaField,
} from '@/components/site/fields';
import { yen } from '@/components/site/format';
import { trim } from '@/components/site/validate';
import {
  GUEST_024,
  HOLD_STATUS_LABEL,
  LAST_UPDATED,
  PICKUP_DAY,
  STAFF_ON_DUTY,
  cartLines,
  formatMonthDay,
  hold,
  holdCart,
  holdNumber,
  holdTotal,
  holdsByTime,
  type HoldStatus,
} from '../../_data';
import { SitePhoto } from '@/components/site/SitePhoto';

/* ============================================================================
 * 取り置き詳細。**保存はしない。終点は「変更内容の確認」。**
 *
 * ■ 「変更を保存しました」と出さない
 *   書き出しには保存後の画面（SAVED）があるが、この見本は何も保存しないので、
 *   そう書くと事実と違う。代わりに、押すと**どこを、何から何に変えたか**を
 *   並べた確認を出す。厨房で見る画面としても、保存の前に差分が出るほうが
 *   取り違えに気づける。
 *
 * ■ 開く1件を URL に載せない
 *   受付番号は、その日その人に結びつく識別子である。`?hold=024` の形で
 *   URL に置くと、履歴・リファラ・アクセスログに残る。開く1件は
 *   **画面の中の選択**にしてある（初期値は書き出しと同じ BD-1003-024）。
 *
 * ■ 電話番号は 050-0 で始まる形にする
 *   電気通信番号計画上、加入者に指定されえない並び。掛かってしまう番号を
 *   画面に置かないための選び方で、`tel:` のリンクも作らない。
 * ==========================================================================*/

const STATUS_OPTIONS: readonly HoldStatus[] = ['preparing', 'ready', 'done'];

export function PickupDetail() {
  const uid = useId().replace(/:/g, '');
  const id = (k: string) => `${uid}-${k}`;

  const [holdId, setHoldId] = useState('024');
  const current = hold(holdId);

  const [status, setStatus] = useState<HoldStatus>(current.status);
  const [memo, setMemo] = useState(current.memo);
  const [confirmed, setConfirmed] = useState(false);

  /** 別の1件を開く。編集中の値は台帳の値に戻す（前の1件の入力を持ち越さない）。 */
  function openHold(next: string) {
    const h = hold(next);
    setHoldId(next);
    setStatus(h.status);
    setMemo(h.memo);
    setConfirmed(false);
  }

  const statusChanged = status !== current.status;
  const memoChanged = trim(memo) !== trim(current.memo);
  const changed = statusChanged || memoChanged;

  const lines = cartLines(holdCart(current));
  const isGuest024 = current.id === '024';

  return (
    <div>
      {/* 開く1件を選ぶ */}
      <div className="max-w-[420px]">
        <SelectField
          id={id('hold')}
          label="開く取り置き"
          value={holdId}
          onChange={openHold}
          /*
            選択肢の文字は短くする。`<select>` の幅は、いちばん長い option で
            下から押さえられる（width:100% でも縮まない）。受け取り時刻と
            受付番号の下3桁があれば、一覧と突き合わせられる。
          */
          options={holdsByTime().map((h) => ({
            value: h.id,
            label: `${h.slot.slice(0, 5)} ${h.id} ${h.guest}`,
          }))}
          hint="受け取り時間順。選ぶとこの画面の内容が入れ替わります。"
        />
      </div>

      <div className="mt-8">
        <h1 className="text-[28px] font-bold leading-[1.3] text-[var(--ink)]">
          取り置き {holdNumber(current.id)}
        </h1>
        <p className="mt-2 text-[14px] text-[var(--sub)]">{current.guest} 様</p>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
        <div className="min-w-0">
          {/* 受付内容 */}
          <div className="rounded-[8px] bg-[var(--soft)] px-5 py-5 md:px-6">
            <h2 className="text-[16px] font-bold text-[var(--soft-ink)]">
              受付内容
            </h2>
            <dl className="mt-4 space-y-3 text-[13px]">
              <DetailRow label="受け取り">
                <span className="tabular-nums">
                  {formatMonthDay(PICKUP_DAY)} {current.slot}
                </span>
              </DetailRow>
              <DetailRow label="商品">
                <span className="tabular-nums">
                  {lines.map((l) => `${l.item.abbr} ×${l.qty}`).join(' / ')}
                </span>
              </DetailRow>
              <DetailRow label="合計">
                <span className="tabular-nums">{yen(holdTotal(current))}</span>{' '}
                / 店頭支払い
              </DetailRow>
              <DetailRow label="電話番号">
                {isGuest024 ? (
                  <span className="tabular-nums">{GUEST_024.tel}</span>
                ) : (
                  '—'
                )}
              </DetailRow>
              <DetailRow label="ご要望">
                {isGuest024 ? GUEST_024.request : 'なし'}
              </DetailRow>
            </dl>
          </div>

          {/* 直すところ */}
          <div
            role="group"
            aria-label="取り置きの更新"
            className="mt-8 space-y-5"
          >
            <TextAreaField
              id={id('memo')}
              label="スタッフメモ"
              value={memo}
              onChange={(v) => {
                setMemo(v);
                setConfirmed(false);
              }}
              rows={2}
              placeholder="袋を分けてお渡し。"
              hint="お客様の画面には出ません。厨房とカウンターで見る控えです。"
            />
            <div className="max-w-[320px]">
              <SelectField
                id={id('status')}
                label="ステータス"
                value={status}
                onChange={(v) => {
                  setStatus(v as HoldStatus);
                  setConfirmed(false);
                }}
                options={STATUS_OPTIONS.map((s) => ({
                  value: s,
                  label: HOLD_STATUS_LABEL[s],
                }))}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setConfirmed(true)}
            className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-3 rounded-[var(--field-radius)] bg-[var(--brick)] px-6 text-[15px] font-semibold text-[var(--cream)] transition duration-150 hover:bg-[var(--brick-deep)] sm:w-auto sm:min-w-[260px]"
          >
            変更内容を確認する
            <span aria-hidden="true">&rarr;</span>
          </button>

          {confirmed && (
            <div className="mt-6 rounded-[var(--field-radius)] border border-[var(--brick)] bg-[var(--paper)] px-5 py-4">
              <h2 className="text-[15px] font-bold text-[var(--ink)]">
                変更内容の確認
              </h2>
              {changed ? (
                <>
                  <dl className="mt-3 space-y-2 text-[13px] leading-[1.9]">
                    {statusChanged && (
                      <div>
                        <dt className="font-semibold text-[var(--sub)]">
                          ステータス
                        </dt>
                        <dd className="text-[var(--ink)]">
                          {HOLD_STATUS_LABEL[current.status]}
                          <span aria-hidden="true"> → </span>
                          <span className="sr-only">から</span>
                          <span className="font-bold">
                            {HOLD_STATUS_LABEL[status]}
                          </span>
                          <span className="sr-only">へ</span>
                        </dd>
                      </div>
                    )}
                    {memoChanged && (
                      <div>
                        <dt className="font-semibold text-[var(--sub)]">
                          スタッフメモ
                        </dt>
                        <dd className="text-[var(--ink)]">
                          {trim(current.memo) === '' ? '（未記入）' : current.memo}
                          <span aria-hidden="true"> → </span>
                          <span className="sr-only">から</span>
                          <span className="font-bold">
                            {trim(memo) === '' ? '（未記入）' : trim(memo)}
                          </span>
                          <span className="sr-only">へ</span>
                        </dd>
                      </div>
                    )}
                  </dl>
                  <p className="mt-4 text-[13px] leading-[1.9] text-[var(--sub)]">
                    ここまでが確認です。この見本では変更は残りません。ブラウザを閉じれば元の内容に戻ります。
                  </p>
                </>
              ) : (
                <p className="mt-3 text-[13px] leading-[1.9] text-[var(--sub)]">
                  変えたところはありません。ステータスかスタッフメモを直してから、もういちど押してください。
                </p>
              )}
            </div>
          )}
        </div>

        {/* 右：写真の代わりの面と、更新の控え */}
        <div className="min-w-0">
          <SitePhoto
            src="breadday/croissant"
            width={700}
            height={525}
            eager
            className="bd-photo-croissant min-h-[220px] w-full rounded-[10px] md:min-h-[300px]"
          />
          <p className="mt-4 text-[13px] leading-[1.9] text-[var(--sub)]">
            更新者：{STAFF_ON_DUTY}
            <br />
            最終更新 <span className="tabular-nums">{LAST_UPDATED}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
      <dt className="font-semibold text-[var(--soft-ink)]">{label}</dt>
      <dd className="text-right text-[var(--soft-ink)]">{children}</dd>
    </div>
  );
}
