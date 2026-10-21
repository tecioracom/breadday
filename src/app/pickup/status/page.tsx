import type { Metadata } from 'next';
import { SITE_SHELL } from '@/components/site/styles';
import { yen } from '@/components/site/format';
import { BreadShell, BD_BTN_SECONDARY } from '../../_ui';
import {
  GUEST_024,
  HOLD_DEADLINE,
  cartLines,
  formatMonthDay,
  hold,
  holdCart,
  holdItemsLabel,
  holdNumber,
  holdTotal,
  PICKUP_DAY,
} from '../../_data';
import { SitePhoto } from '@/components/site/SitePhoto';

/* ============================================================================
 * 取り置き内容の確認 `/pickup/status`。
 *
 * ■ この画面が書き出しの「受け付け完了」にあたる
 *   書き出しの3枚目は、受け付けたあとの控え（受付番号 BD-1003-024、
 *   受け取り 10:00–10:30、店頭でのお支払い ¥1,020）である。取り置きの
 *   入力画面と同じルートの終点にすると、**押していないのに「受け付けました」**
 *   と読める画面ができてしまう。そこで「すでに受け付けてある1件を見る画面」
 *   として切り出し、フッターの「取り置き内容の確認」から入る形にした。
 *   数字は台帳（_data.ts の HOLDS）の 024 そのもので、管理画面の取り置き詳細と
 *   同じ1件を見ている。
 *
 * ■ 受付番号で照会する入口は作っていない
 *   照会には受付番号と名前が要り、どちらも入力させると「当たるまで試せる」
 *   口を公開することになる。見本では1件を開いた状態から始める。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '取り置き内容の確認 — BREADDAY',
    description:
      'BREADDAY の取り置き1件の控え。受付番号・受け取り時間・店頭でのお支払い額を表示します。',
    alternates: { canonical: '/pickup/status' },
    robots: { index: false, follow: false },
  };
}

export default async function PickupStatusPage() {
  const base = `/`;

  const h = hold('024');
  const lines = cartLines(holdCart(h));

  return (
    <BreadShell>
      <main id="main">
        <div className={`${SITE_SHELL} pt-14 md:pt-20`}>
          <p className="bd-display text-[40px] leading-[1.02] text-[var(--brick)] sm:text-[56px] md:text-[68px]">
            SEE YOU SOON!
          </p>

          <h1 className="mt-8 text-[30px] leading-[1.35] text-[var(--ink)] md:text-[36px]">
            取り置き内容の確認
          </h1>
          <p className="mt-3 max-w-[36em] text-[14px] leading-[1.9] text-[var(--sub)]">
            当日はカウンターでお名前か受付番号をお伝えください。
          </p>

          <div className="mt-10 grid gap-10 md:grid-cols-[1.25fr_1fr] md:gap-14">
            <div className="min-w-0">
              <div className="rounded-[12px] bg-[var(--soft)] px-5 py-5 md:px-7 md:py-6">
                <h2 className="text-[17px] font-bold text-[var(--soft-ink)]">
                  取り置き内容
                </h2>
                <dl className="mt-4 space-y-3">
                  <StatusRow label="受付番号">
                    <span className="tabular-nums">{holdNumber(h.id)}</span>
                  </StatusRow>
                  <StatusRow label="お名前">{GUEST_024.name}</StatusRow>
                  <StatusRow label="受け取り">
                    {formatMonthDay(PICKUP_DAY)}{' '}
                    <span className="tabular-nums">{h.slot}</span>
                  </StatusRow>
                  <StatusRow label="内容">{holdItemsLabel(h)}</StatusRow>
                  <StatusRow label="店頭でのお支払い">
                    <span className="tabular-nums">{yen(holdTotal(h))}</span>
                    （税込）
                  </StatusRow>
                </dl>

                <ul
                  role="list"
                  className="mt-5 space-y-1 border-t border-[var(--line-strong)] pt-4 text-[12px] leading-[1.8] text-[var(--soft-ink)]"
                >
                  {lines.map((l) => (
                    <li key={l.item.id} className="tabular-nums">
                      {l.item.name} ×{l.qty}　{yen(l.amount)}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-5 text-[13px] leading-[1.9] text-[var(--sub)]">
                確認のご案内は {GUEST_024.email} 宛にお送りしています。
                <br />
                変更・キャンセルは{HOLD_DEADLINE}まで。受け取りに遅れる場合は店舗へご連絡ください。
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={base} className={BD_BTN_SECONDARY}>
                  トップへ戻る
                </a>
                <a href={`${base}/pickup`} className={BD_BTN_SECONDARY}>
                  もう一度取り置きする
                </a>
              </div>
            </div>

            <SitePhoto
              src="breadday/hero"
              width={1200}
              height={800}
              eager
              className="bd-photo-hero min-h-[240px] w-full rounded-[10px] md:min-h-[340px]"
            />
          </div>
        </div>
      </main>
    </BreadShell>
  );
}

function StatusRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[13px]">
      <dt className="font-semibold text-[var(--soft-ink)]">{label}</dt>
      <dd className="text-right leading-[1.8] text-[var(--soft-ink)]">
        {children}
      </dd>
    </div>
  );
}
