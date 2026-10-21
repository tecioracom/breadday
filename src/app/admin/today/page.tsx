import type { Metadata } from 'next';
import { AdminHead, BdStat, BreadAdmin } from '../../_admin';
import {
  HOLD_COUNT,
  SEAT_ADMIN_NOTE,
  SEAT_SERVICE,
  countByStatus,
} from '../../_data';
import { PickupBoard } from './PickupBoard';

/* ============================================================================
 * 今日の受け取り `/admin/today`。
 *
 * ■ いちばん上に、この画面で扱わないものを書く
 *   席の予約は Hot Pepper にあり、この画面には**無い**。件数のカードを
 *   3枚並べる前に断っておかないと、「18件」を席とパンの合計だと読む人が出る。
 *   断りを下に置くと、数字を読んだあとになるので意味が薄れる。
 *
 * ■ 3枚目のカードだけ数字が入らない
 *   席予約の件数はこの店が持っていない。持っていない数字の代わりに
 *   **どこで管理するか**を入れた。数えていない仕事を、数えたふりで
 *   並べないための置き方である。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '今日の受け取り — BREADDAY 店舗管理',
    description:
      'BREADDAY の店舗管理。本日の取り置きを受け取り時間順に表示します。席の予約は外部サービスで管理しています。',
    alternates: { canonical: '/admin/today' },
    robots: { index: false, follow: false },
  };
}

export default async function AdminTodayPage() {

  return (
    <BreadAdmin current="today">
      <AdminHead
        label="Overview"
        title="今日の受け取り"
        lead="受け取り時間順に並んでいます。準備ができたら取り置き詳細でステータスを更新してください。"
      />

      <div className="rounded-[8px] bg-[var(--soft)] px-5 py-4 md:px-6">
        <p className="text-[15px] font-bold text-[var(--soft-ink)]">
          {SEAT_ADMIN_NOTE}
        </p>
        <p className="mt-2 text-[13px] leading-[1.9] text-[var(--soft-ink)]">
          席予約の確認・変更・キャンセルは{SEAT_SERVICE}
          で行ってください。下の件数にはパンの取り置きだけを表示しています。
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <BdStat label="取り置き" value={String(HOLD_COUNT)} unit="件" />
        <BdStat
          label="準備中"
          value={String(countByStatus('preparing'))}
          unit="件"
        />
        <BdStat label="席予約の管理" value={SEAT_SERVICE} small />
      </div>

      <PickupBoard />
    </BreadAdmin>
  );
}
