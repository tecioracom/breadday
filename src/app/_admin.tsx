import type { ReactNode } from 'react';
import { AdminShell } from '@/components/site/AdminShell';
import { SiteFooter } from '@/components/site/SiteFooter';
import { formatLongJa } from '@/components/site/calendar';
import { Wordmark } from './_ui';
import { HOLD_COUNT, PICKUP_DAY, STAFF_ON_DUTY } from './_data';

/* ============================================================================
 * BREADDAY の管理画面の器。共有の AdminShell に、この店ぶんの中身を入れる。
 *
 * ■ 袖の色だけ表側と変える
 *   表側の主色はレンガだが、管理画面の袖は焦茶（書き出しもそうなっている）。
 *   共有部品は主色を `--green` で読むので、`.bd-admin` を重ねて
 *   **`--green` だけを焦茶に付け替える**（site.css）。
 *   レンガが要るボタンは `--brick` を直接読むので影響を受けない。
 *
 * ■ 朝の厨房で開く画面
 *   焼き上がりから受け取りまでの数時間に、粉だらけの手で見る画面なので、
 *   1画面に載せるものを絞り、文字を大きめにしてある。
 * ==========================================================================*/

export type AdminPage = 'today' | 'stock' | 'detail';

export function BreadAdmin({
  current,
  crumb = 'BREADDAY / 店舗管理',
  children,
}: {
  current: AdminPage;
  crumb?: string;
  children: ReactNode;
}) {
  const base = `/admin`;
  return (
    <>
      <div className="sample-body sample-breadday bd-admin">
        <AdminShell
          brand={<Wordmark size="md" tone="cream" />}
          brandSub="STORE MANAGER"
          nav={[
            {
              label: '今日の受け取り',
              href: `${base}/today`,
              current: current === 'today',
            },
            {
              label: '焼成・在庫',
              href: `${base}/stock`,
              current: current === 'stock',
            },
            {
              label: '取り置き詳細',
              href: `${base}/detail`,
              current: current === 'detail',
            },
            { label: 'ログアウト', href: base },
          ]}
          footNote={
            <>
              <p>本日の取り置き {HOLD_COUNT}件</p>
              <p className="mt-1">
                <a
                  href="/"
                  className="underline underline-offset-4"
                >
                  店のサイトを開く
                </a>
              </p>
            </>
          }
          crumb={crumb}
          meta={
            <>
              <span className="tabular-nums">{formatLongJa(PICKUP_DAY)}</span>
              <span aria-hidden="true">・</span>
              <span>{STAFF_ON_DUTY}</span>
            </>
          }
        >
          {children}
        </AdminShell>
      </div>
      {/* Teciora の帯。**配色スコープの外**に置く（[8] が全ページで見ている）。 */}
      <SiteFooter />
    </>
  );
}

/** 画面の見出し（管理側）。欧文の小ラベル + 和文の見出し + 1行。 */
export function AdminHead({
  label,
  title,
  lead,
}: {
  label: string;
  title: string;
  lead: string;
}) {
  return (
    <div className="mb-6">
      <p className="bd-label text-[11px] uppercase text-[var(--sub)]">{label}</p>
      <h1 className="mt-2 text-[28px] font-bold leading-[1.3] text-[var(--ink)]">
        {title}
      </h1>
      <p className="mt-2 text-[13px] leading-[1.8] text-[var(--sub)]">{lead}</p>
    </div>
  );
}

/**
 * 数字を1つ出すタイル。
 * **3枚目だけは数字ではなく「どこで管理するか」が入る**ので、値を
 * `ReactNode` で受け、字の大きさを変えられるようにしてある
 * （数えていない仕事を、数えたふりで並べないための作り分け）。
 */
export function BdStat({
  label,
  value,
  unit,
  small = false,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  small?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-[8px] border border-[var(--line)] bg-[var(--paper)] px-5 py-5">
      <p className="text-[13px] text-[var(--sub)]">{label}</p>
      <p
        className={
          small
            ? 'mt-2 text-[24px] font-bold leading-[1.25] text-[var(--ink)]'
            : 'mt-2 text-[34px] font-bold leading-[1.15] tabular-nums text-[var(--ink)]'
        }
      >
        {value}
        {unit && <span className="ml-1 text-[18px] font-semibold">{unit}</span>}
      </p>
    </div>
  );
}
