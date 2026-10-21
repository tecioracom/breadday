'use client';

import { useId, useState } from 'react';
import { BD_BTN_PRIMARY } from '../_ui';
import { SEAT_EXTERNAL_NOTE, SEAT_SERVICE, SEAT_SERVICE_FULL } from '../_data';

/* ============================================================================
 * 「{SEAT_SERVICE}で席を予約」のボタン。
 *
 * ■ 実在するサービスの URL を張らない
 *   この店は架空だが、押す人は実在する。架空の店の画面から本物の予約サイトへ
 *   飛ばすと、そこから先で起きることに架空の店が責任を持てない。
 *   **行き先を持たないボタン**にして、押したらこの見本で何が起きないかを出す。
 *
 * ■ 押せないボタンにして「押せません」と書く形は採らない
 *   押せて、押した結果がちゃんと出るほうが、実際の店で何が起きるかが伝わる。
 *   `aria-expanded` / `aria-controls` を付けて、読み上げにも「押すと何かが開く」
 *   ことを渡す（遷移すると読めてしまう名前のままにしない）。
 *
 * ■ target="_blank" も使わない
 *   新しいタブを開く導線は検査 [10] が禁じている。開く先も無い。
 * ==========================================================================*/

export function ExternalNotice() {
  const uid = useId().replace(/:/g, '');
  const panelId = `${uid}-panel`;
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={BD_BTN_PRIMARY}
      >
        {SEAT_SERVICE}で席を予約
        <span aria-hidden="true">&#8599;</span>
      </button>

      <p className="mt-3 text-[13px] leading-[1.9] text-[var(--sub)]">
        {SEAT_EXTERNAL_NOTE}
      </p>

      <div id={panelId} hidden={!open}>
        <div className="mt-4 rounded-[var(--field-radius)] border border-[var(--line-strong)] bg-[var(--paper)] px-5 py-4">
          <p className="text-[14px] font-semibold leading-[1.8] text-[var(--ink)]">
            この見本では外部サイトへ移動しません。
          </p>
          <p className="mt-2 text-[13px] leading-[1.9] text-[var(--sub)]">
            実際のお店では、ここから{SEAT_SERVICE_FULL}
            の予約画面（外部サイト）が開き、人数・日時の選択から予約の確定までを、そちらでお手続きいただきます。
          </p>
        </div>
      </div>
    </div>
  );
}
