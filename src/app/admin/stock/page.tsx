import type { Metadata } from 'next';
import { AdminHead, BreadAdmin } from '../../_admin';
import { StockBoard } from './StockBoard';

/* ============================================================================
 * 焼成・在庫 `/admin/stock`。
 * 焼く数を決めると、店頭に出せる数（焼く数 − 取り置き分）がその場で動く。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '焼成・在庫 — BREADDAY 店舗管理',
    description:
      'BREADDAY の店舗管理。焼く数と取り置き分から、店頭に出せる数を確認します。変更内容の確認までで、保存はされません。',
    alternates: { canonical: '/admin/stock' },
    robots: { index: false, follow: false },
  };
}

export default async function AdminStockPage() {

  return (
    <BreadAdmin current="stock">
      <AdminHead
        label="Operations"
        title="焼成・在庫"
        lead="焼く数と取り置き分・店頭販売分を確認できます。"
      />
      <StockBoard />
    </BreadAdmin>
  );
}
