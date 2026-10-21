import type { Metadata } from 'next';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Wordmark } from '../_ui';
import { HOLD_COUNT, OPEN_FROM, OPEN_TO } from '../_data';
import { LoginForm } from './LoginForm';
import { SitePhoto } from '@/components/site/SitePhoto';

/* ============================================================================
 * 店舗スタッフのログイン `/admin`。
 * 左に厨房の面、右にログイン（書き出しと同じ割り）。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'ログイン — BREADDAY 店舗管理',
    description:
      'BREADDAY の店舗スタッフ用管理画面のログイン。見本のため入力は照合されず、どこにも送られません。',
    alternates: { canonical: '/admin' },
    robots: { index: false, follow: false },
  };
}

export default async function AdminLoginPage() {

  return (
    <>
      <div className="sample-body sample-breadday md:flex md:min-h-screen">
        {/* 左：厨房の面 */}
        <SitePhoto
          src="breadday/counter"
          width={1200}
          height={900}
          eager
          className="bd-photo-counter min-h-[220px] md:min-h-0 md:w-[46%]"
        />

        {/* 右：ログイン */}
        <main
          id="main"
          className="flex flex-1 flex-col items-center justify-center bg-[var(--cream)] px-6 py-14 md:px-12"
        >
          <div className="w-full max-w-[440px]">
            <Wordmark size="lg" />
            <p className="mt-3 text-[13px] text-[var(--sub)]">店舗管理</p>
          </div>
          <div className="mt-8 w-full max-w-[440px]">
            <LoginForm />
          </div>
          <p className="mt-10 w-full max-w-[440px] text-[12px] leading-[1.8] text-[var(--sub)]">
            本日の取り置きは{HOLD_COUNT}件です。店頭の営業は{OPEN_FROM}–{OPEN_TO}、
            水曜定休。
          </p>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
