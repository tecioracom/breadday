'use client';

import { useId, useState } from 'react';
import { TABLE, TD, TH } from '@/components/site/styles';
import { yen } from '@/components/site/format';
import { LABEL_BASE, FIELD_BASE } from '@/components/site/fields';
import { trim } from '@/components/site/validate';
import {
  HOLD_STATUS_LABEL,
  holdItemsLabel,
  holdNumber,
  holdTotal,
  holdsByTime,
  type Hold,
  type HoldStatus,
} from '../../_data';

/* ============================================================================
 * 今日の受け取り（一覧）。
 *
 * ■ 並びは受け取り時間順
 *   受付順に並べても、厨房では使えない。**次に渡すもの**が上に来る順にする。
 *   同じ枠の中は受付番号順にして、並びを決定的にしておく
 *   （毎回入れ替わると、目で追っている行を見失う）。
 *
 * ■ 絞り込みは状態だけ、検索は受付番号と名前だけ
 *   カウンターで聞かれるのはこの2つしかない。**画面に置ける絞り込みを
 *   全部置くと、押す前に読む量が増える。**
 *   書き出しの帯は「すべて / 準備中 / 受け取り済み」の3つだが、台帳には
 *   「準備済み」が8件あって、どの帯でも単独では出せなかったので1つ足した。
 *
 * ■ 状態を色だけで示さない
 *   3つの状態は、面の色ではなく**文字**で読める。色は補助にしている。
 * ==========================================================================*/

type Filter = 'all' | HoldStatus;

const FILTERS: readonly { id: Filter; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'preparing', label: '準備中' },
  { id: 'ready', label: '準備済み' },
  { id: 'done', label: '受け取り済み' },
];

function statusClass(status: HoldStatus): string {
  const common =
    'inline-flex items-center rounded-[4px] px-2 py-[3px] text-[12px] font-semibold';
  if (status === 'preparing') {
    return `${common} border border-[var(--brick)] text-[var(--brick)]`;
  }
  if (status === 'ready') {
    return `${common} bg-[var(--soft)] text-[var(--soft-ink)]`;
  }
  return `${common} border border-[var(--line-strong)] text-[var(--sub)]`;
}

function matches(h: Hold, query: string): boolean {
  const q = trim(query).toLowerCase();
  if (q === '') return true;
  return (
    holdNumber(h.id).toLowerCase().includes(q) ||
    h.id.includes(q) ||
    h.guest.replace(/[\s　]/g, '').includes(q.replace(/[\s　]/g, ''))
  );
}

export function PickupBoard() {
  const uid = useId().replace(/:/g, '');
  const searchId = `${uid}-search`;

  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const all = holdsByTime();
  const rows = all.filter(
    (h) => (filter === 'all' || h.status === filter) && matches(h, query),
  );

  return (
    <section className="mt-8 min-w-0 rounded-[8px] border border-[var(--line)] bg-[var(--paper)] p-5 md:p-6">
      <div className="max-w-[420px]">
        <label htmlFor={searchId} className={LABEL_BASE}>
          注文・名前で検索
        </label>
        <input
          id={searchId}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="受付番号 / お名前"
          className={FIELD_BASE}
        />
      </div>

      <div
        role="group"
        aria-label="状態で絞り込む"
        className="mt-5 flex flex-wrap gap-2"
      >
        {FILTERS.map((f) => {
          const on = f.id === filter;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f.id)}
              className={
                on
                  ? 'inline-flex min-h-[44px] items-center rounded-[var(--field-radius)] bg-[var(--brick)] px-5 text-[14px] font-semibold text-[var(--cream)]'
                  : 'inline-flex min-h-[44px] items-center rounded-[var(--field-radius)] border border-[var(--line-strong)] bg-[var(--paper)] px-5 text-[14px] font-medium text-[var(--ink)] transition duration-150 hover:border-[var(--ink)]'
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* 説明はスクロール容器の**外**に、可視のまま置く
          （`.sr-only` は position:absolute なので、容器の中に置くと
            容器ではなくページ全体に横スクロールが出る）。 */}
      <p className="mt-5 text-[13px] text-[var(--sub)]">
        {rows.length === all.length
          ? `${all.length}件をすべて表示しています。`
          : `${all.length}件のうち${rows.length}件を表示しています。`}
      </p>

      <div className="site-scroll-x mt-3">
        {/*
          表の名前は `aria-label` で渡す。`<caption className="sr-only">` にしない
          ——`.sr-only` は position: absolute で、position: static のスクロール容器の
          中に置くと overflow-x のクリップを抜けてページ全体に横スクロールが出る。
        */}
        <table className={TABLE} aria-label="本日の取り置き（受け取り時間順）">
          <thead>
            <tr>
              <th scope="col" className={TH}>
                受け取り
              </th>
              <th scope="col" className={TH}>
                受付番号
              </th>
              <th scope="col" className={TH}>
                お客様
              </th>
              <th scope="col" className={TH}>
                取り置き内容
              </th>
              <th scope="col" className={TH}>
                合計
              </th>
              <th scope="col" className={TH}>
                状態
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((h) => (
              <tr key={h.id}>
                <td className={`${TD} tabular-nums`}>{h.slot}</td>
                <td className={`${TD} tabular-nums`}>{holdNumber(h.id)}</td>
                <td className={TD}>{h.guest}</td>
                <td className={TD}>{holdItemsLabel(h)}</td>
                <td className={`${TD} tabular-nums`}>{yen(holdTotal(h))}</td>
                <td className={TD}>
                  <span className={statusClass(h.status)}>
                    {HOLD_STATUS_LABEL[h.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <p className="mt-4 text-[14px] font-semibold text-[var(--ink)]">
          この条件に合う取り置きはありません。検索の文字か、状態の絞り込みを変えてください。
        </p>
      )}
    </section>
  );
}
