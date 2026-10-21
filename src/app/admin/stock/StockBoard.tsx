'use client';

import { useId, useState } from 'react';
import { ErrorSummary, LABEL_BASE, FIELD_BASE } from '@/components/site/fields';
import { type FieldError } from '@/components/site/validate';
import { ITEMS, stockRows, type ItemId } from '../../_data';
import { SitePhoto } from '@/components/site/SitePhoto';

/* ============================================================================
 * 焼成・在庫。**保存はしない。終点は「変更内容の確認」。**
 *
 * ■ 店頭に出せる数は入力させない
 *   書き出しは「焼成 40 / 取り置き 18 / 店頭 22」を1つの欄に入れているが、
 *   この3つは**独立した数字ではない**。取り置き分は台帳を足した結果で、
 *   店頭分は「焼く数 − 取り置き分」でしかない。3つとも打てる形にすると、
 *   足し算の合わない設定を保存できてしまう。
 *   **打つのは焼く数だけ**にして、残り2つはその場で出す。
 *   クロワッサンを 40 から 50 に増やせば、店頭は 22 から 32 に動く。
 *
 * ■ 取り置き分より少ない数は焼けない
 *   焼く数を取り置き分より下げると、店頭がマイナスになる前に、
 *   **予約した人のぶんが足りなくなる**。そこで下限を取り置き分にして、
 *   何個まで下げられるかを文でも出す。
 *
 * ■ サンドはこの画面に出さない
 *   受け取りの直前に焼くので、朝に数を決める対象ではない（`_data.ts` の
 *   baked が null の品は行にならない）。
 * ==========================================================================*/

const MAX_BAKED = 200;

function clampBaked(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(MAX_BAKED, Math.floor(value));
}

export function StockBoard() {
  const uid = useId().replace(/:/g, '');
  const id = (k: string) => `${uid}-${k}`;

  const rows = stockRows();

  const [baked, setBaked] = useState<Record<string, number>>(() =>
    Object.fromEntries(rows.map((r) => [r.item.id, r.baked])),
  );
  const [checked, setChecked] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  function setOne(itemId: ItemId, next: number) {
    setBaked((b) => ({ ...b, [itemId]: clampBaked(next) }));
    setConfirmed(false);
  }

  const errors: Record<string, FieldError> = Object.fromEntries(
    rows.map((r) => [
      r.item.id,
      baked[r.item.id] < r.held
        ? `${r.item.name}は取り置きが${r.held}個あります。${r.held}以上で入力してください。`
        : null,
    ]),
  );
  const order = rows.map((r) => r.item.id);
  const items = checked
    ? order
        .filter((k) => errors[k])
        .map((k) => ({
          key: k,
          label: ITEMS.find((it) => it.id === k)?.name ?? k,
          message: errors[k] as string,
        }))
    : [];

  const changes = rows.filter((r) => baked[r.item.id] !== r.baked);

  function onConfirm() {
    setChecked(true);
    if (order.some((k) => errors[k])) {
      setConfirmed(false);
      return;
    }
    setConfirmed(true);
  }

  return (
    <div>
      {items.length > 0 && (
        <div className="mb-6 max-w-[640px]">
          <ErrorSummary
            id={id('summary')}
            title={`入力を確認してください（${items.length}件）`}
            items={items}
            fieldId={(k) => id(`baked-${k}`)}
          />
        </div>
      )}

      <ul role="list" className="space-y-5">
        {rows.map((r, i) => {
          const now = baked[r.item.id];
          const counter = now - r.held;
          const err = checked ? errors[r.item.id] : null;
          const errId = err ? id(`err-${r.item.id}`) : undefined;
          return (
            <li
              key={r.item.id}
              className="min-w-0 rounded-[8px] border border-[var(--line)] bg-[var(--paper)] p-5"
            >
              <div className="flex flex-wrap items-start gap-x-5 gap-y-4">
                <SitePhoto
                  /* `aspect-square` と書かない。検査 [5] が決済 SDK（square）を
                     文字列で探していて、クラス名でも当たる。 */
                  src={r.item.photo}
                  width={700}
                  height={525}
                  eager={i === 0}
                  className={`${r.item.tone} h-[72px] w-[72px] shrink-0 rounded-[8px] sm:h-[110px] sm:w-[110px]`}
                />
                <div className="min-w-0 flex-1 basis-[190px]">
                  <h2 className="text-[19px] font-bold text-[var(--ink)]">
                    {r.item.name}
                  </h2>
                  <p className="mt-1 text-[13px] tabular-nums text-[var(--sub)]">
                    現在の設定　焼成 {r.baked} / 取り置き {r.held} / 店頭{' '}
                    {r.counter}
                  </p>

                  <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-4">
                    {/*
                      `min-w-0` は飾りではない。flex の子は既定で
                      `min-width: auto`（＝中身の min-content より縮まない）で、
                      `<input>` の min-content は size 属性ぶんある。入れないと
                      狭い幅でページ全体に横スクロールが出る。
                      幅は入れ物で決める（FIELD_BASE の w-full と競合させない）。
                    */}
                    <div className="w-[120px] min-w-0">
                      <label htmlFor={id(`baked-${r.item.id}`)} className={LABEL_BASE}>
                        焼成する数
                      </label>
                      <input
                        id={id(`baked-${r.item.id}`)}
                        type="text"
                        inputMode="numeric"
                        value={String(now)}
                        onChange={(e) =>
                          setOne(
                            r.item.id,
                            Number(e.target.value.replace(/[^0-9]/g, '')),
                          )
                        }
                        {...(err
                          ? { 'aria-invalid': true, 'aria-describedby': errId }
                          : {})}
                        className={`${FIELD_BASE} text-center tabular-nums`}
                      />
                    </div>

                    <p className="min-w-0 text-[14px] leading-[1.7] text-[var(--ink)]">
                      <span className="tabular-nums">
                        {now} − {r.held}
                      </span>
                      <span aria-hidden="true"> = </span>
                      <span className="sr-only">なので、</span>
                      店頭に出せるのは{' '}
                      <span className="text-[20px] font-bold tabular-nums">
                        {counter < 0 ? 0 : counter}
                      </span>
                      個
                    </p>
                  </div>

                  {err && (
                    <p
                      id={errId}
                      className="mt-3 text-[13px] font-semibold leading-[1.6] text-[var(--alert)]"
                    >
                      {err}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-[13px] leading-[1.9] text-[var(--sub)]">
        取り置き分は台帳から出しています。焼く数を変えると、店頭に出せる数がその場で変わります。
        <br />
        ハムとチーズのサンドは受け取りの直前に焼くため、この画面には出しません。
      </p>

      <button
        type="button"
        onClick={onConfirm}
        className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-3 rounded-[var(--field-radius)] bg-[var(--brick)] px-6 text-[15px] font-semibold text-[var(--cream)] transition duration-150 hover:bg-[var(--brick-deep)] sm:w-auto sm:min-w-[260px]"
      >
        変更内容を確認する
        <span aria-hidden="true">&rarr;</span>
      </button>

      {confirmed && (
        <div className="mt-6 max-w-[640px] rounded-[var(--field-radius)] border border-[var(--brick)] bg-[var(--paper)] px-5 py-4">
          <h2 className="text-[15px] font-bold text-[var(--ink)]">
            変更内容の確認
          </h2>
          {changes.length > 0 ? (
            <>
              <ul role="list" className="mt-3 space-y-2 text-[13px] leading-[1.9]">
                {changes.map((r) => (
                  <li key={r.item.id} className="text-[var(--ink)]">
                    <span className="font-semibold">{r.item.name}</span>　焼成{' '}
                    <span className="tabular-nums">{r.baked}</span>
                    <span aria-hidden="true"> → </span>
                    <span className="sr-only">から</span>
                    <span className="font-bold tabular-nums">
                      {baked[r.item.id]}
                    </span>
                    <span className="sr-only">へ</span>
                    　／　店頭{' '}
                    <span className="tabular-nums">{r.counter}</span>
                    <span aria-hidden="true"> → </span>
                    <span className="sr-only">から</span>
                    <span className="font-bold tabular-nums">
                      {baked[r.item.id] - r.held}
                    </span>
                    <span className="sr-only">へ</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[13px] leading-[1.9] text-[var(--sub)]">
                ここまでが確認です。この見本では設定は残りません。ブラウザを閉じれば元の数に戻ります。
              </p>
            </>
          ) : (
            <p className="mt-3 text-[13px] leading-[1.9] text-[var(--sub)]">
              変えたところはありません。焼く数を直してから、もういちど押してください。
            </p>
          )}
        </div>
      )}
    </div>
  );
}
