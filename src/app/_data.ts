/* ============================================================================
 * BREADDAY（架空・朝8時に焼き上がるベーカリーとコーヒーの店）の共有データ。
 *
 * **表側の5画面と管理の4画面が、ここだけを見る。**
 * 複製すると、値段や個数を1か所だけ直したときに画面ごとに違う数字が出る
 * ——という形で静かに壊れる。書き出した画面（public/works/breadday/）の
 * 数字はすべてこのファイルから再現できる:
 *   ¥320 / ¥380 / ¥480 / ¥620、合計 ¥1,020、受付番号 BD-1003-024、
 *   取り置き18件・準備中6件、焼成40 / 取り置き18 / 店頭22。
 *
 * 置いてよいのは次のものだけ:
 *  - React にもブラウザ API にも依存しない定数
 *  - 引数だけで結果が決まる純粋関数（SSR と CSR で必ず同じ値になる＝
 *    ハイドレーションのずれが出ない）
 * 日付ライブラリは使わない（`@/components/site/calendar` の整数演算）。
 *
 * 「今日」を端末時計から取らない。下の2つの定数で固定する。
 * ==========================================================================*/

import {
  DOW_JA,
  addDays,
  dayOfWeek,
  parseDate,
} from '@/components/site/calendar';

/**
 * `10月3日（土）` — 集計パネルと台帳の書式。
 * 年は出さない（同じ週のことしか扱わない画面で、年は行を太らせるだけ）。
 * 受け取り日の選択肢だけは年つき（calendar の formatLongJa）にする。
 */
export function formatMonthDay(iso: string): string {
  const c = parseDate(iso);
  const dow = dayOfWeek(iso);
  if (!c || dow === null) return iso;
  return `${c.m}月${c.d}日（${DOW_JA[dow]}）`;
}

/* ---------------------------------------------------------------------------
 * 店の時間
 * ------------------------------------------------------------------------- */

/**
 * お客様が取り置きを申し込む日。書き出した取り置き画面の「前日」にあたる。
 * 2026-10-02（金）。
 */
export const ORDER_DAY = '2026-10-02';

/**
 * 受け取り日＝**店の「本日」**。管理画面の日付（2026年10月3日（土））。
 * 表側の「明日のパンを取り置き」は ORDER_DAY から見た翌日なので、
 * 2つの日付は食い違っていない。前日18:00で締めた分を、この日に渡す。
 */
export const PICKUP_DAY = '2026-10-03';

/** 定休日。0=日 … 6=土。水曜定休。 */
export const CLOSED_DOW = 3;

export const OPEN_FROM = '8:00';
export const OPEN_TO = '18:00';
/** カフェのラストオーダー。 */
export const CAFE_LAST_ORDER = '17:30';
/** 取り置きの締め。書き出した画面の文言と同じ形で持つ。 */
export const HOLD_DEADLINE = '前日18:00';

/** 同じ厨房で扱うもの。メニューにも取り置きにも同じ一文を出す。 */
export const KITCHEN_NOTE = '同じ厨房で小麦・乳・卵・ナッツを扱っています。';

/* ---------------------------------------------------------------------------
 * パン
 * ------------------------------------------------------------------------- */

export type ItemId = 'croissant' | 'roll' | 'loaf' | 'sand';

export type BreadItem = {
  id: ItemId;
  /** メニューに出す正式な名前。 */
  name: string;
  /** 集計パネルの行（「クロワッサン ×2」）。 */
  short: string;
  /** 管理画面の表の行（幅が狭いのでさらに詰める）。 */
  abbr: string;
  price: number;
  /** 価格の横に並べる。表示は「小麦・乳・卵」。 */
  allergens: readonly string[];
  lead: string;
  /** 写真の下に残る面（samples.css の .bd-photo-*）。 */
  tone: string;
  /** パンの写真（public/samples/ からの拡張子なしの道）。 */
  photo: string;
  /**
   * その日の焼成予定数。サンドは受注で作るので焼成の対象にしない（null）。
   * 「焼成・在庫」の画面に出るのはこの値を持つ品だけ。
   */
  baked: number | null;
};

/** 並びは書き出した画面と同じ（クロワッサン → ロール → 角食 → サンド）。 */
export const ITEMS: readonly BreadItem[] = [
  {
    id: 'croissant',
    name: 'バタークロワッサン',
    short: 'クロワッサン',
    abbr: 'クロワッサン',
    price: 320,
    allergens: ['小麦', '乳', '卵'],
    lead: '発酵バターを折り込んで、毎朝8時に焼き上げます。',
    tone: 'bd-photo-croissant',
    photo: 'breadday/croissant',
    baked: 40,
  },
  {
    id: 'roll',
    name: 'シナモンロール',
    short: 'シナモンロール',
    abbr: 'ロール',
    price: 380,
    allergens: ['小麦', '乳', '卵'],
    lead: 'シナモンを巻き込んで、粗めの砂糖をかけて焼きます。',
    tone: 'bd-photo-roll',
    photo: 'breadday/roll',
    baked: 24,
  },
  {
    id: 'loaf',
    name: '角食パン 1斤',
    short: '角食パン',
    abbr: '角食パン',
    price: 480,
    allergens: ['小麦', '乳'],
    lead: '蓋をして焼く角型の食パン。1斤でお渡しします。',
    tone: 'bd-photo-loaf',
    photo: 'breadday/loaf',
    baked: 16,
  },
  {
    id: 'sand',
    name: 'ハムとチーズのサンド',
    short: 'サンド',
    abbr: 'サンド',
    price: 620,
    allergens: ['小麦', '乳', '卵'],
    lead: '角食パンにハムとチーズをはさんで、注文ごとに焼きます。',
    tone: 'bd-photo-sand',
    photo: 'breadday/sand',
    baked: null,
  },
];

export function item(id: ItemId): BreadItem {
  const found = ITEMS.find((x) => x.id === id);
  if (!found) throw new Error(`unknown item: ${id}`);
  return found;
}

/** 「小麦・乳・卵」。中黒でつなぐ。 */
export function allergenLabel(it: BreadItem): string {
  return it.allergens.join('・');
}

/** カフェのメニュー。取り置きの対象ではない（店内でご注文いただく）。 */
export const DRINKS: readonly { name: string; price: number }[] = [
  { name: 'ブレンドコーヒー', price: 450 },
  { name: 'カフェラテ', price: 520 },
  { name: '自家製レモネード', price: 550 },
  { name: 'サンドイッチ＋ドリンク', price: 980 },
];

/* ---------------------------------------------------------------------------
 * 受け取りの日時
 * ------------------------------------------------------------------------- */

/** 受け取り時間の枠。30分ごと。 */
export const PICKUP_SLOTS: readonly string[] = [
  '10:00–10:30',
  '10:30–11:00',
  '11:00–11:30',
  '11:30–12:00',
  '12:00–12:30',
  '12:30–13:00',
  '13:00–13:30',
  '14:00–14:30',
  '14:30–15:00',
  '15:00–15:30',
  '15:30–16:00',
  '16:00–16:30',
  '16:30–17:00',
  '17:00–17:30',
];

/**
 * 選べる受け取り日。**前日18:00までなので、いちばん早いのは翌日**。
 * 定休日（水）は飛ばす。ORDER_DAY からの整数演算だけで出す。
 */
export function pickupDates(count = 6): string[] {
  const out: string[] = [];
  for (let i = 1; out.length < count && i < 30; i += 1) {
    const iso = addDays(ORDER_DAY, i);
    if (dayOfWeek(iso) === CLOSED_DOW) continue;
    out.push(iso);
  }
  return out;
}

/* ---------------------------------------------------------------------------
 * かご（取り置きの中身）
 * ------------------------------------------------------------------------- */

export type Cart = Readonly<Record<ItemId, number>>;

export const EMPTY_CART: Cart = {
  croissant: 0,
  roll: 0,
  loaf: 0,
  sand: 0,
};

/** 1品あたりの上限。これ以上は店頭の分が無くなるので、店で相談してもらう。 */
export const MAX_PER_ITEM = 10;

export type CartLine = { item: BreadItem; qty: number; amount: number };

/** 0個の品は行にしない。並びは ITEMS の順（画面ごとに入れ替えない）。 */
export function cartLines(cart: Cart): CartLine[] {
  return ITEMS.filter((it) => cart[it.id] > 0).map((it) => ({
    item: it,
    qty: cart[it.id],
    amount: it.price * cart[it.id],
  }));
}

export function cartTotal(cart: Cart): number {
  return cartLines(cart).reduce((sum, l) => sum + l.amount, 0);
}

/** 点数（個数の合計）。0 なら「1つ以上選んでください」を出す。 */
export function cartCount(cart: Cart): number {
  return ITEMS.reduce((sum, it) => sum + cart[it.id], 0);
}

/* ---------------------------------------------------------------------------
 * 取り置き台帳（架空）— 受け取り日（10/3）の18件
 * ------------------------------------------------------------------------- */

export type HoldStatus = 'preparing' | 'ready' | 'done';

export const HOLD_STATUS_LABEL: Record<HoldStatus, string> = {
  preparing: '準備中',
  ready: '準備済み',
  done: '受け取り済み',
};

export type Hold = {
  /** 受付番号の末尾3桁。表示は BD-1003-<id>（下の holdNumber）。 */
  id: string;
  /** 受け取りの枠。PICKUP_SLOTS のどれか。 */
  slot: string;
  guest: string;
  /** 0個の品は書かない。 */
  items: Partial<Record<ItemId, number>>;
  status: HoldStatus;
  /** スタッフ向けのメモ。お客様の画面には出さない。 */
  memo: string;
};

/**
 * 18件。**受付順ではなく受け取り時間順に並べるのは表示側の仕事**なので、
 * ここは受付番号の意味（申し込まれた順）を保ったまま置く。
 *
 * 先頭の 024（山田様）が、表側の取り置き確認・管理の取り置き詳細に出てくる1件。
 * 書き出した一覧の上3行（10:00–10:30 ¥1,020 / 10:30–11:00 ¥960 /
 * 11:00–11:30 ¥1,240）は、この台帳を時間順に並べた先頭3行と一致する。
 */
export const HOLDS: readonly Hold[] = [
  {
    id: '024',
    slot: '10:00–10:30',
    guest: '山田 花子',
    items: { croissant: 2, roll: 1 },
    status: 'preparing',
    memo: '袋を分けてお渡し。',
  },
  {
    id: '011',
    slot: '10:30–11:00',
    guest: '佐藤 美咲',
    items: { loaf: 2 },
    status: 'ready',
    memo: '',
  },
  {
    id: '007',
    slot: '11:00–11:30',
    guest: '鈴木 太郎',
    items: { sand: 2 },
    status: 'preparing',
    memo: '',
  },
  {
    id: '031',
    slot: '11:00–11:30',
    guest: '田中 遼',
    items: { croissant: 1, roll: 1 },
    status: 'ready',
    memo: '',
  },
  {
    id: '006',
    slot: '11:30–12:00',
    guest: '小林 彩',
    items: { croissant: 3 },
    status: 'ready',
    memo: '',
  },
  {
    id: '019',
    slot: '11:30–12:00',
    guest: '森 千尋',
    items: { croissant: 1, loaf: 1 },
    status: 'preparing',
    memo: '食パンは切らずに。',
  },
  {
    id: '003',
    slot: '12:00–12:30',
    guest: '渡辺 健一',
    items: { croissant: 2, sand: 1 },
    status: 'done',
    memo: '',
  },
  {
    id: '028',
    slot: '12:00–12:30',
    guest: '中島 悠',
    items: { roll: 2 },
    status: 'ready',
    memo: '',
  },
  {
    id: '014',
    slot: '12:30–13:00',
    guest: '岡本 麻衣',
    items: { croissant: 1, loaf: 1 },
    status: 'ready',
    memo: '',
  },
  {
    id: '022',
    slot: '13:00–13:30',
    guest: '藤井 直人',
    items: { roll: 1, sand: 1 },
    status: 'preparing',
    memo: '',
  },
  {
    id: '009',
    slot: '13:00–13:30',
    guest: '長谷川 恵',
    items: { croissant: 2 },
    status: 'done',
    memo: '',
  },
  {
    id: '035',
    slot: '14:00–14:30',
    guest: '大西 徹',
    items: { croissant: 1 },
    status: 'ready',
    memo: '',
  },
  {
    id: '017',
    slot: '14:30–15:00',
    guest: '原田 さくら',
    items: { croissant: 1, roll: 1 },
    status: 'ready',
    memo: '',
  },
  {
    id: '002',
    slot: '15:00–15:30',
    guest: '井上 光',
    items: { loaf: 1 },
    status: 'done',
    memo: '',
  },
  {
    id: '026',
    slot: '15:30–16:00',
    guest: '村上 香織',
    items: { croissant: 2, roll: 1 },
    status: 'preparing',
    memo: '',
  },
  {
    id: '012',
    slot: '16:00–16:30',
    guest: '木村 大輔',
    items: { croissant: 1, sand: 2 },
    status: 'ready',
    memo: 'サンドは受け取り直前に焼く。',
  },
  {
    id: '033',
    slot: '16:30–17:00',
    guest: '上田 理沙',
    items: { roll: 1 },
    status: 'preparing',
    memo: '',
  },
  {
    id: '005',
    slot: '17:00–17:30',
    guest: '島田 亮',
    items: { croissant: 1, sand: 1 },
    status: 'done',
    memo: '',
  },
];

/** `BD-1003-024`。1003 は受け取り日の月日で、PICKUP_DAY から出す。 */
export function holdNumber(id: string): string {
  const c = parseDate(PICKUP_DAY);
  if (!c) return `BD-${id}`;
  const mmdd = `${String(c.m).padStart(2, '0')}${String(c.d).padStart(2, '0')}`;
  return `BD-${mmdd}-${id}`;
}

export function hold(id: string): Hold {
  const found = HOLDS.find((h) => h.id === id);
  if (!found) throw new Error(`unknown hold: ${id}`);
  return found;
}

/** 台帳の1件をかごの形に直す。合計の計算を1つの関数に寄せるため。 */
export function holdCart(h: Hold): Cart {
  return {
    croissant: h.items.croissant ?? 0,
    roll: h.items.roll ?? 0,
    loaf: h.items.loaf ?? 0,
    sand: h.items.sand ?? 0,
  };
}

export function holdTotal(h: Hold): number {
  return cartTotal(holdCart(h));
}

/** 一覧の「取り置き内容」列。`クロワッサン ×2 / ロール ×1` */
export function holdItemsLabel(h: Hold): string {
  return cartLines(holdCart(h))
    .map((l) => `${l.item.abbr} ×${l.qty}`)
    .join(' / ');
}

/** 受け取り時間順。同じ枠の中は受付番号順にして、並びを決定的にする。 */
export function holdsByTime(): Hold[] {
  return [...HOLDS].sort((a, b) => {
    if (a.slot !== b.slot) return a.slot < b.slot ? -1 : 1;
    return a.id < b.id ? -1 : 1;
  });
}

export function countByStatus(status: HoldStatus): number {
  return HOLDS.filter((h) => h.status === status).length;
}

/** 受け取り日の取り置き件数。書き出した「取り置き 18件」。 */
export const HOLD_COUNT = HOLDS.length;

/* ---------------------------------------------------------------------------
 * 焼成・在庫
 * ------------------------------------------------------------------------- */

/** その品の取り置き合計（個数）。台帳を足し上げるだけ。 */
export function heldQty(id: ItemId): number {
  return HOLDS.reduce((sum, h) => sum + (h.items[id] ?? 0), 0);
}

/**
 * 店頭に出せる数 ＝ **焼く数 − 取り置き分**。
 * 書き出した画面の「焼成40 / 取り置き18 / 店頭22」は、この引き算そのもの。
 * 焼成の対象でない品（サンド）は null を返す。
 */
export function counterQty(id: ItemId): number | null {
  const it = item(id);
  if (it.baked === null) return null;
  return it.baked - heldQty(id);
}

export type StockRow = {
  item: BreadItem;
  baked: number;
  held: number;
  counter: number;
};

/** 「焼成・在庫」の3行。焼成の対象になる品だけを、ITEMS の順で出す。 */
export function stockRows(): StockRow[] {
  return ITEMS.filter((it) => it.baked !== null).map((it) => ({
    item: it,
    baked: it.baked as number,
    held: heldQty(it.id),
    counter: counterQty(it.id) as number,
  }));
}

/* ---------------------------------------------------------------------------
 * 席の予約（この店は自分では持たない）
 * ------------------------------------------------------------------------- */

/**
 * 席の予約を渡している先の名前。**URL は持たない。**
 * 実在するサービスへのリンクを架空の店の画面から張ると、押した人が
 * 本物の予約画面に着いてしまう。この見本では名前だけを出し、
 * 外部サイトへは移動しない（seats の画面がその旨を明記する）。
 */
export const SEAT_SERVICE = 'Hot Pepper';
export const SEAT_SERVICE_FULL = 'ホットペッパーグルメ';
export const SEAT_EXTERNAL_NOTE = '外部サイトが開きます。';
export const SEAT_CHANGE_NOTE =
  '予約の確認・変更・キャンセルはホットペッパーグルメの予約確認画面または予約確認メールからお手続きください。';
export const SEAT_ADMIN_NOTE = '席予約はHot Pepperで管理します。';

/* ---------------------------------------------------------------------------
 * 024（山田様）— 表側の取り置き確認と、管理の取り置き詳細で同じものを見る
 * ------------------------------------------------------------------------- */

export const GUEST_024 = {
  name: '山田 花子',
  email: 'hanako@example.com',
  /**
   * 電話番号は 050-0 で始まる形にする。電気通信番号計画上、加入者に
   * 指定されえない並びで、**掛かってしまう番号を画面に置かない**ための
   * 選び方。`tel:` のリンクも作らない。
   */
  tel: '050-0123-4567',
  request: '袋を分けてください。',
  acceptedOn: '2026年10月2日 17:40',
} as const;

/** 管理画面の右上と、取り置き詳細の更新者。 */
export const STAFF_ON_DUTY = '店舗スタッフ';
export const LAST_UPDATED = '10月3日 09:15';

/** 取り置きの条件。同意チェックの手前に置く。 */
export const HOLD_TERMS: readonly string[] = [
  '受け付けは前日18:00までです。',
  '変更・キャンセルも前日18:00まで承ります。',
  'お支払いは受け取り時に店頭で承ります。',
  '受け取りに遅れる場合は店舗へご連絡ください。',
];
