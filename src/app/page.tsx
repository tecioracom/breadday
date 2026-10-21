import type { Metadata } from 'next';
import { SITE_SHELL } from '@/components/site/styles';
import { yen } from '@/components/site/format';
import { BreadShell, BD_BTN_PRIMARY } from './_ui';
import {
  CAFE_LAST_ORDER,
  HOLD_DEADLINE,
  ITEMS,
  OPEN_FROM,
  OPEN_TO,
  SEAT_SERVICE,
} from './_data';
import { SitePhoto } from '@/components/site/SitePhoto';

/* ============================================================================
 * BREADDAY トップ `/`。
 * 書き出した1ページ（top-desktop / top-mobile）を1ルートに実装したもの。
 *
 * ■ ヒーローを左右に非対称に割る
 *   見出しは幅いっぱいに置き、その下をクロワッサンの面（広いほう）と
 *   レンガ色のコピー面（狭いほう）で割る。1.32 : 1 で、意図的にそろえない。
 *   左の面は画面の左端まで抜き、右の面だけ本文の幅に収める。
 *
 * ■ 写真を使っていない
 *   配信している素材は「文字が焼き込まれた1枚の書き出し」しかなく、
 *   文字の入らない領域を切り出せない。写真を捏造せず、**同じ明度の推移だけ**を
 *   CSS で置いた（samples.css の .bd-photo-*）。書き出しのほうは
 *   Teciora 側の画面設計ページ に並べてあるので、見比べられる。
 *
 * ■ 数字は1か所から
 *   値段・営業時間・締め切りは `_data.ts`。取り置きの画面も管理画面も
 *   同じ定数を見ている。片方だけ直すことができない形にしてある。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'BREADDAY — ベーカリーとコーヒー',
    description:
      '朝8時に焼き上がるベーカリー BREADDAY。パンとカフェメニュー、パンの取り置き、カフェの席予約。Teciora が制作したサンプルサイトで、BREADDAY は架空の店です。',
    alternates: { canonical: '/' },
    robots: { index: false, follow: false },
  };
}

export default async function BreaddayTopPage() {
  const base = `/`;

  return (
    <BreadShell>
      <main id="main">
        {/* §hero — 見出しは幅いっぱい、その下を左右に非対称に割る */}
        <section className="pt-8 md:pt-10">
          <div className={SITE_SHELL}>
            <h1 className="bd-display text-[40px] leading-[1.02] text-[var(--ink)] sm:text-[60px] md:text-[86px] lg:text-[104px]">
              GOOD BREAD.
              <br className="md:hidden" /> GOOD DAY.
            </h1>
          </div>

          <div className="mt-6 grid md:mt-8 md:grid-cols-[1.32fr_1fr]">
            {/* このページで先読みする唯一の1枚（折りたたみの上の焼きたて）。 */}
            <SitePhoto
              src="breadday/hero"
              width={1200}
              height={800}
              eager
              className="bd-photo-hero min-h-[260px] w-full sm:min-h-[320px] md:min-h-[430px]"
            />
            <div className="site-on-dark min-w-0 bg-[var(--brick)] px-6 py-10 md:px-10 md:py-12">
              <p className="text-[13px] text-[var(--on-dark-strong)]">
                毎朝{OPEN_FROM}に焼き上がります。
              </p>
              <h2 className="mt-4 text-[28px] leading-[1.45] text-[var(--cream)] md:text-[32px]">
                焼きたてと
                <br />
                コーヒーで
                <br />
                おはよう。
              </h2>
              <p className="mt-5 max-w-[26em] text-[13px] leading-[1.9] text-[var(--on-dark-strong)]">
                さくっと焼いたクロワッサンに、ふんわりした角食パン。朝{OPEN_FROM}
                からお待ちしています。
              </p>
              <a
                href={`${base}/pickup`}
                className="mt-8 inline-flex min-h-[52px] w-full items-center justify-between gap-4 rounded-[var(--field-radius)] bg-[var(--cream)] px-6 text-[15px] font-semibold text-[var(--ink)] transition duration-150 hover:bg-[var(--paper)] sm:w-auto sm:min-w-[300px]"
              >
                明日のパンを取り置き
                <span aria-hidden="true">&rarr;</span>
              </a>
              <p className="bd-label mt-6 text-[11px] uppercase text-[var(--on-dark-strong)]">
                Open {OPEN_FROM}–{OPEN_TO} / Closed Wed.
              </p>
            </div>
          </div>
        </section>

        {/* §01 いつものパン */}
        <section className="pt-20 md:pt-28">
          <div className={SITE_SHELL}>
            <p className="bd-label text-[11px] uppercase text-[var(--sub)]">
              From the oven
            </p>
            <h2 className="mt-3 text-[28px] leading-[1.4] text-[var(--ink)] md:text-[34px]">
              いつものパン
            </h2>
            <p className="mt-3 text-[14px] leading-[1.9] text-[var(--sub)]">
              クロワッサンや食パンなどを毎日焼いています。
            </p>

            <ul role="list" className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {ITEMS.map((it) => (
                <li key={it.id} className="min-w-0">
                  <SitePhoto
                    src={it.photo}
                    width={700}
                    height={525}
                    className={`${it.tone} aspect-[4/3] w-full rounded-[10px]`}
                  />
                  <h3 className="mt-4 text-[15px] font-semibold text-[var(--ink)]">
                    {it.name}
                  </h3>
                  <p className="mt-2 text-[14px] tabular-nums text-[var(--sub)]">
                    {yen(it.price)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[13px]">
              <a
                href={`${base}/menu`}
                className="inline-flex min-h-[44px] items-center gap-2 font-medium text-[var(--ink)] underline underline-offset-4"
              >
                パンとカフェメニューを見る
                <span aria-hidden="true">&rarr;</span>
              </a>
            </p>
          </div>
        </section>

        {/* §02 カフェ — 左に文章、右に2枚の面 */}
        <section className="pt-20 md:pt-28">
          <div className={`${SITE_SHELL} grid gap-10 md:grid-cols-[1fr_1.15fr] md:gap-14`}>
            <div className="min-w-0">
              <p className="bd-display text-[32px] leading-[1.05] text-[var(--brick)] md:text-[40px]">
                STAY A LITTLE.
              </p>
              <h2 className="mt-5 text-[26px] leading-[1.45] text-[var(--ink)] md:text-[30px]">
                ひと息ついて
                <br />
                いきませんか。
              </h2>
              <p className="mt-5 max-w-[26em] text-[14px] leading-[1.9] text-[var(--sub)]">
                コーヒーと一緒に店内でどうぞ。朝ごはんにもおやつにもお立ち寄りください。
              </p>
              <a href={`${base}/seats`} className={`${BD_BTN_PRIMARY} mt-8`}>
                {SEAT_SERVICE}で席予約
                <span aria-hidden="true">&#8599;</span>
              </a>
              <p className="mt-3 text-[12px] leading-[1.8] text-[var(--sub)]">
                席の予約は{SEAT_SERVICE}へお渡ししています。案内のページが開きます。
              </p>
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-4">
              <SitePhoto
                src="breadday/cafe"
                width={1200}
                height={900}
                className="bd-photo-cafe min-h-[200px] w-full rounded-[10px] md:min-h-[300px]"
              />
              <SitePhoto
                src="breadday/counter"
                width={1200}
                height={900}
                className="bd-photo-counter min-h-[200px] w-full rounded-[10px] md:min-h-[300px]"
              />
            </div>
          </div>
        </section>

        {/* §03 案内の帯 */}
        <section className="pt-20 md:pt-28">
          <div className={SITE_SHELL}>
            <div className="rounded-[12px] bg-[var(--soft)] px-6 py-8 md:px-10 md:py-10">
              <h2 className="text-[22px] leading-[1.5] text-[var(--ink)] md:text-[26px]">
                お店でお待ちしています。
              </h2>
              <p className="mt-4 text-[14px] leading-[1.9] text-[var(--ink)]">
                {OPEN_FROM}–{OPEN_TO}（カフェ L.O. {CAFE_LAST_ORDER}）　／　水曜定休
                <br />
                取り置きは{HOLD_DEADLINE}まで。受け取り時間に合わせてご用意します。
              </p>
            </div>
          </div>
        </section>
      </main>
    </BreadShell>
  );
}
