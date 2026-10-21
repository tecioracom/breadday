import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SITE_SHELL } from '@/components/site/styles';
import {
  CAFE_LAST_ORDER,
  HOLD_DEADLINE,
  OPEN_FROM,
  OPEN_TO,
  SEAT_SERVICE,
} from './_data';

/* ============================================================================
 * BREADDAY の共通パーツ（ワードマーク・ヘッダー・店のフッター・ページの器）。
 *
 * ■ 器の入れ子
 *     <BreadShell>                      ← .sample-body.sample-breadday（配色スコープ）
 *       <BreadHeader /> … <main> …      ← 店の画面
 *       <BreadFooter />                 ← 店のフッター（濃いバター色）
 *     </BreadShell>
 *     <SiteFooter />                    ← Teciora の帯（スコープの**外**）
 *
 *   Teciora の帯をスコープの中に入れると、店のパレットを継承して
 *   「店のフッターが2つある」ように見える。必ず外に出すこと。
 *
 * ■ ボタンの色は --brick を直接読む
 *   共有の BTN_PRIMARY は主色を --green で読むが、この店は
 *   **表側の主色（レンガ）と管理画面の袖（焦茶）が別の色**で、管理画面では
 *   --green を焦茶に付け替えている（samples.css）。ボタンだけは表裏どちらでも
 *   レンガにしたいので、付け替えの影響を受けない --brick を使う。
 *
 * ■ ここにも overflow / transform / filter を付けない（sticky が死ぬ）。
 * ==========================================================================*/

/** 主ボタン（レンガの塗り）。 */
export const BD_BTN_PRIMARY =
  'inline-flex min-h-[48px] w-full items-center justify-center gap-3 rounded-[var(--field-radius)] bg-[var(--brick)] px-6 text-[15px] font-semibold text-[var(--cream)] transition duration-150 hover:bg-[var(--brick-deep)] sm:w-auto sm:min-w-[260px]';

/** 副ボタン（白地に細い枠）。戻る・やり直す。 */
export const BD_BTN_SECONDARY =
  'inline-flex min-h-[48px] w-full items-center justify-center gap-3 rounded-[var(--field-radius)] border border-[var(--line-strong)] bg-[var(--paper)] px-6 text-[15px] font-semibold text-[var(--ink)] transition duration-150 hover:border-[var(--ink)] sm:w-auto sm:min-w-[220px]';

export function Wordmark({
  size = 'md',
  tone = 'ink',
}: {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'ink' | 'cream';
}) {
  const px =
    size === 'lg' ? 'text-[30px]' : size === 'sm' ? 'text-[17px]' : 'text-[21px]';
  const color = tone === 'cream' ? 'text-[var(--cream)]' : 'text-[var(--ink)]';
  return (
    <span className={`bd-wordmark block leading-none ${px} ${color}`} aria-hidden="true">
      BREADDAY
    </span>
  );
}

/** ワードマークのリンク。読み上げには「BREADDAY ホーム」と出す。 */
export function WordmarkLink({
  tone = 'ink',
  size = 'md',
}: {
  tone?: 'ink' | 'cream';
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <a
      href="/"
      className="inline-flex min-h-[44px] items-center"
    >
      <Wordmark size={size} tone={tone} />
      <span className="sr-only">BREADDAY ホーム</span>
    </a>
  );
}

/**
 * 店のヘッダー。
 *
 * ■ 席予約だけ「↗」を付ける
 *   この店が自分で持つのはパンの取り置きだけで、席の予約は外に渡している。
 *   ナビの3つめだけ行き先の性格が違うので、矢印で見分けられるようにする。
 *   ただし **飛び先は自分のページ**（seats）で、そこで外部に渡すことを説明する。
 *   実在するサービスの URL を架空の店から張ると、押した人が本物の予約画面に
 *   着いてしまうので、それはしない。
 *
 * ■ たたんだメニューにしない
 *   項目は3つしかない。開閉のボタンを置くより、折り返して全部見せるほうが
 *   押す回数が少ない（幅 390px で2行に収まる）。
 */
export function BreadHeader() {
  const base = `/`;
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--cream)]">
      <div
        className={`${SITE_SHELL} flex min-h-[var(--site-header-h)] flex-wrap items-center gap-x-8 gap-y-1 py-3`}
      >
        <WordmarkLink />
        <nav aria-label="BREADDAY のメニュー" className="min-w-0">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <li>
              <a
                href={`${base}/menu`}
                className="inline-flex min-h-[44px] items-center text-[14px] font-medium text-[var(--ink)] hover:underline hover:underline-offset-4"
              >
                パンとメニュー
              </a>
            </li>
            <li>
              <a
                href={`${base}/pickup`}
                className="inline-flex min-h-[44px] items-center text-[14px] font-medium text-[var(--ink)] hover:underline hover:underline-offset-4"
              >
                パンを取り置き
              </a>
            </li>
            <li>
              <a
                href={`${base}/seats`}
                className="inline-flex min-h-[44px] items-center gap-1 text-[14px] font-medium text-[var(--ink)] hover:underline hover:underline-offset-4"
              >
                席予約（{SEAT_SERVICE}）
                <span aria-hidden="true">&#8599;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

/** 店のフッター（濃いバター色）。営業時間と締め切りを、どのページにも出す。 */
export function BreadFooter() {
  const base = `/`;
  return (
    <div className="mt-20 bg-[var(--soft)] py-12 md:py-14">
      <div className={SITE_SHELL}>
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <Wordmark size="lg" />
            <p className="bd-label mt-3 text-[11px] uppercase text-[var(--sub)]">
              Bakery &amp; Coffee
            </p>
            <p className="mt-5 text-[13px] leading-[1.9] text-[var(--ink)]">
              {OPEN_FROM}–{OPEN_TO}（カフェ L.O. {CAFE_LAST_ORDER}）　水曜定休
              <br />
              パンの取り置きは{HOLD_DEADLINE}まで。
            </p>
          </div>

          <nav aria-label="BREADDAY のページ" className="text-[13px]">
            <ul className="grid gap-y-2 sm:grid-cols-2 sm:gap-x-12">
              <li>
                <a href={`${base}/menu`} className="hover:underline">
                  パンとカフェメニュー
                </a>
              </li>
              <li>
                <a href={`${base}/pickup`} className="hover:underline">
                  パンを取り置き
                </a>
              </li>
              <li>
                <a href={`${base}/seats`} className="hover:underline">
                  カフェの席予約
                </a>
              </li>
              <li>
                <a href={`${base}/pickup/status`} className="hover:underline">
                  取り置き内容の確認
                </a>
              </li>
              <li>
                <a href={`${base}/admin`} className="hover:underline">
                  スタッフの方
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <p className="bd-label mt-10 text-[11px] uppercase text-[var(--sub)]">
          &copy; 2026 BREADDAY
        </p>
        <p className="mt-2 text-[12px] text-[var(--sub)]">
          BREADDAY は架空のベーカリーです。
        </p>
      </div>
    </div>
  );
}

/**
 * 1ページぶんの器。
 * `main` の id は本体サイトと同じ `main`（スキップリンクの行き先）。
 */
export function BreadShell({
  children,
  hideHeader = false,
}: {
  children: ReactNode;
  hideHeader?: boolean;
}) {
  return (
    <>
      <div className="sample-body sample-breadday min-h-screen bg-[var(--cream)] text-[var(--ink)]">
        {!hideHeader && <BreadHeader />}
        {children}
        <BreadFooter />
      </div>
      {/* Teciora の帯。**配色スコープの外**に置く（[8] が全ページで見ている）。 */}
      <SiteFooter />
    </>
  );
}

/** 下層ページの見出しの塊（欧文の小ラベル + 和文の見出し + 1行）。 */
export function PageHead({
  label,
  title,
  lead,
}: {
  label: string;
  title: string;
  lead: string;
}) {
  return (
    <div>
      <p className="bd-label text-[11px] uppercase text-[var(--sub)]">{label}</p>
      <h1 className="mt-3 text-[32px] leading-[1.3] text-[var(--ink)] md:text-[40px]">
        {title}
      </h1>
      <p className="mt-3 max-w-[36em] text-[14px] leading-[1.9] text-[var(--sub)]">
        {lead}
      </p>
    </div>
  );
}
