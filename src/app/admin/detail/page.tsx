import type { Metadata } from 'next';
import { AdminHead, BreadAdmin } from '../../_admin';
import { PickupDetail } from './PickupDetail';

/* ============================================================================
 * 取り置き詳細 `/admin/detail`。
 * 書き出しの「取り置き BD-1003-024」と「保存後の表示」を、
 * **1ルートの2つの状態**にしてある（保存はしないので、終点は確認）。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '取り置き詳細 — BREADDAY 店舗管理',
    description:
      'BREADDAY の店舗管理。取り置き1件の受付内容を見て、ステータスとスタッフメモを直します。変更内容の確認までで、保存はされません。',
    alternates: { canonical: '/admin/detail' },
    robots: { index: false, follow: false },
  };
}

export default async function AdminDetailPage() {

  return (
    <BreadAdmin current="detail">
      <AdminHead
        label="Detail"
        title="取り置き詳細"
        lead="受付内容を見ながら、ステータスとスタッフメモを直します。"
      />
      <PickupDetail />
    </BreadAdmin>
  );
}
