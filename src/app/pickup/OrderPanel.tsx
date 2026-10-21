'use client';

import { yen } from '@/components/site/format';
import {
  cartLines,
  cartTotal,
  formatMonthDay,
  type Cart,
} from '../_data';

/* ============================================================================
 * 「ご注文内容」の集計パネル。取り置きの3つの状態すべてで同じものを出す。
 *
 * ■ 1つの計算を1か所から出す
 *   行（クロワッサン ×2 → ¥640）も合計も `_data.ts` の純粋関数で出す。
 *   画面ごとに足し算を書くと、片方だけ税の扱いが違う、という形で静かにずれる。
 *
 * ■ 0個の品は行にしない
 *   4品ぜんぶを ¥0 で並べると、何を取り置いたのかが読み取りにくくなる。
 *   まだ1つも選んでいないときは、金額ではなく次にすることを書く。
 *
 * ■ `aria-live` を付けていない
 *   数量のボタンは1回押すと1つ動く。押すたびに合計を読み上げ直すと、
 *   4品ぶん連打したときに読み上げが詰まる。合計はボタンのすぐ隣にあり、
 *   次の段（お客様情報）でも必ずもう一度出るので、ここでは黙っている。
 * ==========================================================================*/

export function OrderPanel({
  cart,
  pickupDate,
  slot,
  showPickup = false,
}: {
  cart: Cart;
  pickupDate: string;
  slot: string;
  showPickup?: boolean;
}) {
  const lines = cartLines(cart);
  const total = cartTotal(cart);

  return (
    <div className="rounded-[12px] bg-[var(--soft)] px-5 py-5 md:px-6 md:py-6">
      <h2 className="text-[17px] font-bold text-[var(--soft-ink)]">ご注文内容</h2>

      <dl className="mt-4 space-y-3">
        {showPickup && (
          <div className="flex items-start justify-between gap-4 text-[13px]">
            <dt className="shrink-0 text-[var(--soft-ink)]">受け取り</dt>
            <dd className="text-right leading-[1.7] text-[var(--soft-ink)]">
              {formatMonthDay(pickupDate)}
              <br />
              <span className="tabular-nums">{slot}</span>
            </dd>
          </div>
        )}

        {lines.length === 0 ? (
          <p className="text-[13px] leading-[1.9] text-[var(--soft-ink)]">
            取り置きするパンを選ぶと、ここに合計が出ます。
          </p>
        ) : (
          lines.map((l) => (
            <div
              key={l.item.id}
              className="flex items-baseline justify-between gap-4 text-[13px]"
            >
              <dt className="min-w-0 text-[var(--soft-ink)]">
                {l.item.short} ×{l.qty}
              </dt>
              <dd className="shrink-0 tabular-nums text-[var(--soft-ink)]">
                {yen(l.amount)}
              </dd>
            </div>
          ))
        )}
      </dl>

      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-[var(--line-strong)] pt-4">
        <span className="text-[14px] font-semibold text-[var(--soft-ink)]">
          合計（税込）
        </span>
        <span className="text-[20px] font-bold tabular-nums text-[var(--soft-ink)]">
          {yen(total)}
        </span>
      </div>
    </div>
  );
}
