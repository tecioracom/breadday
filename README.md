# BREADDAY

朝8時に焼き上がるベーカリーのウェブサイト。パンとコーヒーの店。取り置きは自分で受け、席の予約は外部サービスに渡す。

公開先: https://breadday.sample.teciora.com

## 画面

| ルート | |
|---|---|
| `/` | BREADDAY トップ |
| `/admin` | 店舗スタッフのログイン |
| `/admin/detail` | 取り置き詳細 |
| `/admin/stock` | 焼成・在庫 |
| `/admin/today` | 今日の受け取り |
| `/menu` | パンとカフェメニュー |
| `/pickup` | パンの取り置き |
| `/pickup/status` | 取り置き内容の確認 |
| `/seats` | カフェの席予約 |

## 作りで決めたこと

### 持つ機能と任せる機能を分ける

取り置きは当日の在庫と結びつくので自分で持つ。席の予約は外部に渡して、
画面からは送り出すだけにした。全部を抱えないほうが、壊れる場所が減る。

### ヒーローを 1.32 : 1 で割る

見出しは幅いっぱいに置き、その下をクロワッサンの面とレンガ色のコピー面で割る。
意図的にそろえない。左の面は画面の左端まで抜き、右の面だけ本文の幅に収める。

### 数字は1か所から

値段・営業時間・締め切りは1つのファイル。取り置きの画面も管理画面も
同じ定数を見ていて、片方だけ直せない。

## 入力を扱う画面について

入力欄のある画面はあるが、`<form>` 要素を1つも置いていない。`action` の無い
form は、ハイドレートが終わる前に Enter を押すと現在の URL へ GET する。
氏名・電話・メールがクエリ文字列に乗り、履歴・リファラ・アクセスログに残る。
送信先を持たない画面にその穴を残す理由がないので、form ごと置いていない。

同じ理由で、`fetch` も Server Actions も `localStorage` も持たせていない。
ボタンの文字も実際に起きることに合わせてある（「送信する」ではなく
「入力内容を確認する」）。

`scripts/check.sh` がこれを機械で確かめる。15群あり、27通りの違反を注入して
全部赤くなることを確認してある。

```bash
bash scripts/check.sh
```

## 動かす

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start   # 本番と同じ静的書き出し
npm run typecheck
```

Next.js 15 の App Router。全9ルートを静的に書き出す。欧文の見出しに Archivo を1書体だけ読む。和文は端末の書体に任せる。

main に push すると GitHub Actions が Vercel へ出す（`.github/workflows/deploy.yml`）。

## 素材

写真は AI 生成（Higgsfield 経由の `gpt_image_2`）。人体は写していない。
出所と条件は [docs/credits.md](docs/credits.md) に1ファイル1行で書いてある。
`public/samples/breadday/` に14ファイル、AVIF と WebP の2系統で置いてある。

## 書いてあることについて

この事業者は架空。社名・人名・住所・電話番号・金額・在庫数はこの画面のために
用意したもので、実在の事業者とは関係ない。全ページ noindex にしてある。

---

制作: [Teciora](https://www.teciora.com/)
