import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BreadShell } from '../_ui';
import { PickupFlow } from './PickupFlow';
import { PickupFlowFromQuery } from './PickupFlowFromQuery';

/* ============================================================================
 * パンの取り置き `/pickup`。
 *
 * 書き出しでは「パンを取り置き」「取り置き内容の確認」「受け付け完了」の
 * 3画面だったが、実装では **1ルートの3つの状態** にしてある。
 * 取り置きは成立しないので、完了の画面を別ルートで持つと、直リンクで
 * 「受け付けました」だけが開けてしまう。終点は同じルートの「入力内容の確認」。
 * すでに受け付けてある1件（BD-1003-024）の見え方は
 * `/pickup/status` に置いた。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'パンを取り置き — BREADDAY',
    description:
      'BREADDAY のパンの取り置き。数量を選ぶと合計が変わります。入力内容の確認までで、送信も保存もされません。',
    alternates: { canonical: '/pickup' },
    robots: { index: false, follow: false },
  };
}

export default async function PickupPage() {

  return (
    <BreadShell>
      <main id="main" className="pt-10 md:pt-14">
        <Suspense fallback={<PickupFlow />}>
          <PickupFlowFromQuery />
        </Suspense>
      </main>
    </BreadShell>
  );
}
