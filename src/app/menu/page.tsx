import type { Metadata } from 'next';
import { SITE_SHELL } from '@/components/site/styles';
import { yen } from '@/components/site/format';
import { BreadShell, PageHead, BD_BTN_PRIMARY } from '../_ui';
import {
  DRINKS,
  ITEMS,
  KITCHEN_NOTE,
  SEAT_SERVICE,
  allergenLabel,
} from '../_data';
import { SitePhoto } from '@/components/site/SitePhoto';

/* ============================================================================
 * パンとカフェメニュー `/menu`。
 *
 * ■ アレルゲンは価格の横に置く
 *   注記にまとめて下に送ると、値段だけを見て決めた人の目に入らない。
 *   「¥320 / 小麦・乳・卵」と1行にすると、選ぶのと同じ視線で読める。
 *   そのうえで「同じ厨房で…」の一文を別に置く。**品目の表示と、
 *   厨房の事情は別のことなので、同じ行にまとめない。**
 *
 * ■ パンの行から取り置きに入れる
 *   `?bread=<id>` はメニューの id なので URL に載せてよい（選択肢の識別子）。
 *   氏名・メール・電話は1文字も載せない。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'パンとカフェメニュー — BREADDAY',
    description:
      'BREADDAY のパンとカフェのメニュー。価格の横にアレルゲンを並べています。表示価格は税込です。',
    alternates: { canonical: '/menu' },
    robots: { index: false, follow: false },
  };
}

export default async function MenuPage() {
  const base = `/`;

  return (
    <BreadShell>
      <main id="main">
        <div className={`${SITE_SHELL} pt-14 md:pt-20`}>
          <PageHead
            label="Bread &amp; cafe"
            title="パンとカフェメニュー"
            lead="パンは店頭でお受け取りいただけます。表示価格は税込です。"
          />

          {/* パン */}
          <ul role="list" className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {ITEMS.map((it, i) => (
              <li key={it.id} className="flex min-w-0 flex-col">
                <SitePhoto
                  src={it.photo}
                  width={700}
                  height={525}
                  eager={i === 0}
                  className={`${it.tone} aspect-[4/3] w-full rounded-[10px]`}
                />
                <h2 className="mt-4 text-[16px] font-semibold text-[var(--ink)]">
                  {it.name}
                </h2>
                <p className="mt-2 text-[14px] tabular-nums text-[var(--sub)]">
                  {yen(it.price)} / {allergenLabel(it)}
                </p>
                <p className="mt-3 flex-1 text-[13px] leading-[1.9] text-[var(--ink)]">
                  {it.lead}
                </p>
                <p className="mt-4 text-[13px]">
                  <a
                    href={`${base}/pickup?bread=${it.id}`}
                    className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-[var(--ink)] underline underline-offset-4"
                  >
                    取り置きに入れる
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </p>
              </li>
            ))}
          </ul>

          {/* カフェ */}
          <div className="mt-20 grid gap-10 md:grid-cols-[1fr_1.3fr] md:gap-14">
            <SitePhoto
              src="breadday/cafe"
              width={1200}
              height={900}
              className="bd-photo-cafe min-h-[240px] w-full rounded-[10px] md:min-h-[400px]"
            />
            <div className="min-w-0">
              <h2 className="text-[26px] leading-[1.45] text-[var(--ink)] md:text-[30px]">
                パンと一緒に。
              </h2>
              <dl className="mt-6 border-t border-[var(--line)]">
                {DRINKS.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-baseline justify-between gap-6 border-b border-[var(--line)] py-4"
                  >
                    <dt className="text-[15px] text-[var(--ink)]">{d.name}</dt>
                    <dd className="text-[15px] tabular-nums text-[var(--ink)]">
                      {yen(d.price)}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-[13px] leading-[1.9] text-[var(--sub)]">
                ドリンクは店内でご注文ください。
                <br />
                {KITCHEN_NOTE}
              </p>
              <a href={`${base}/seats`} className={`${BD_BTN_PRIMARY} mt-8`}>
                {SEAT_SERVICE}で席予約
                <span aria-hidden="true">&#8599;</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </BreadShell>
  );
}
