import type { Metadata } from 'next';
import { SITE_SHELL } from '@/components/site/styles';
import { BreadShell, PageHead, BD_BTN_SECONDARY } from '../_ui';
import { SEAT_CHANGE_NOTE, SEAT_SERVICE_FULL } from '../_data';
import { ExternalNotice } from './ExternalNotice';
import { SitePhoto } from '@/components/site/SitePhoto';

/* ============================================================================
 * カフェの席予約 `/seats`。
 *
 * ■ この店が自分で持つのは、パンの取り置きだけ
 *   席の予約は外部のサービスに渡している。**渡していることを隠さない。**
 *   1ページ使って「どこへ渡すか」「戻ってくる窓口はどこか」を書く。
 *   予約の確認・変更・キャンセルの窓口を書かないと、変えたい人が
 *   この店のページを探し回ることになる（そしてここには無い）。
 *
 * ■ 席の空き状況をこの画面に出さない
 *   持っていない在庫を出すと、外の予約と食い違ったときに嘘になる。
 *   出すのは「どこで見られるか」だけにする。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'カフェの席予約 — BREADDAY',
    description:
      'BREADDAY のカフェの席予約は、ホットペッパーグルメで承ります。予約の確認・変更・キャンセルの窓口もこちらに記載しています。',
    alternates: { canonical: '/seats' },
    robots: { index: false, follow: false },
  };
}

export default async function SeatsPage() {
  const base = `/`;

  return (
    <BreadShell>
      <main id="main">
        <div className={`${SITE_SHELL} pt-14 md:pt-20`}>
          <PageHead
            label="Cafe reservation"
            title="カフェの席予約"
            lead={`お席の予約は${SEAT_SERVICE_FULL}で承ります。`}
          />

          <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
            <SitePhoto
              src="breadday/counter"
              width={1200}
              height={900}
              eager
              className="bd-photo-counter min-h-[240px] w-full rounded-[10px] md:min-h-[400px]"
            />

            <div className="min-w-0">
              <h2 className="text-[24px] leading-[1.5] text-[var(--ink)] md:text-[28px]">
                空き状況を見て
                <br />
                ご希望の日時をお選びください。
              </h2>
              <p className="mt-5 max-w-[28em] text-[14px] leading-[1.9] text-[var(--sub)]">
                人数・日時の選択から予約の確定まで、{SEAT_SERVICE_FULL}
                でお手続きいただけます。
              </p>

              <div className="mt-8">
                <ExternalNotice />
              </div>

              <div className="mt-10 border-t border-[var(--line)] pt-8">
                <h3 className="text-[18px] font-semibold text-[var(--ink)]">
                  予約の確認・変更・キャンセル
                </h3>
                <p className="mt-3 max-w-[30em] text-[14px] leading-[1.9] text-[var(--sub)]">
                  {SEAT_CHANGE_NOTE}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <a href={`${base}/pickup`} className={BD_BTN_SECONDARY}>
              パンの取り置きはこちら
            </a>
            <p className="mt-3 text-[13px] leading-[1.9] text-[var(--sub)]">
              パンの取り置きは、この店のページで承ります。席の予約とは別のお手続きです。
            </p>
          </div>
        </div>
      </main>
    </BreadShell>
  );
}
