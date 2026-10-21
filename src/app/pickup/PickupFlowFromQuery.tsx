'use client';

import { useSearchParams } from 'next/navigation';
import { ITEMS, type ItemId } from '../_data';
import { PickupFlow } from './PickupFlow';

/* ============================================================================
 * `?bread=croissant` を読んで、その品を1つ入れた状態で開く。
 *
 * ■ `useSearchParams` は **必ず Suspense の内側**で呼ぶ
 *   包まないと、このルートは静的生成をやめてリクエストごとの描画になる。
 *   包んだうえで、代替表示（fallback）に**同じ画面の既定状態**を渡す。
 *   代替表示を「読み込み中」の箱にすると、静的 HTML に何も入らなくなり、
 *   JS が動かない環境で取り置きの画面が1つも出ない。
 *
 * ■ クエリに載せてよいのはメニューの id だけ
 *   氏名・メール・電話は1文字も URL に載せない。この口は `bread` しか読まず、
 *   未知の値は黙って「何も入っていない」状態に落とす。
 * ==========================================================================*/

export function PickupFlowFromQuery() {
  const params = useSearchParams();
  const raw = params.get('bread');
  const known = ITEMS.some((it) => it.id === raw);
  return (
    <PickupFlow
      initialItem={known ? (raw as ItemId) : undefined}
    />
  );
}
