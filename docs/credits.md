# BREADDAY — 素材の出所

`public/samples/breadday/` に置いてあるファイル 14 点の出所と条件。
**素材を足したら必ずここに1行足すこと**（`scripts/check.sh` の [15] が、
置いてあるファイルとコードからの参照を双方向で突き合わせる）。

元は Teciora の素材台帳（`teciora-web/docs/samples-credits.md`、全67行）で、
ここはこのサイトが配信するぶんを抜き出したもの。

## 先に断っておくこと

**写真は AI 生成である。** Higgsfield 経由の `gpt_image_2` で作った。
**人体は1つも写していない**（全行の「人物の識別可能性」が「なし」）。
実在のブランド・商標・製品パッケージも写していない。生成で作ったのは、
フリー素材だと肖像権・パブリシティ権・商標・施設管理権の未カバー領域が
残るのに対し、**AI 生成なら第三者の権利主体が存在しない**から。

**配信している AVIF / WebP に来歴メタデータは残っていない。**
生成物を最適化変換する工程で C2PA 等は機械的に落ちる（意図的な除去ではない）。
この repository のファイルをバイト列で調べても出て来ないので、
**下の表が来歴の記録そのものになる。** 消さないこと。

## ライセンス

- Higgsfield Terms of Use（出力の権利は利用者に帰属・商用可・第三者への譲渡可）

Higgsfield Terms of Use は出力の権利を利用者に帰属させ、商用利用と第三者への
譲渡を認めている。**ただし規約は変わりうる**ので、この素材を別の用途に
使い回すときは、その時点の規約を読み直すこと。

## ファイル一覧

列の意味は元の台帳と同じ。`同左` は1つ上の行を指す（AVIF と WebP が対になっている）。

| ファイル | 出所 | ライセンス | 取得日 | クレジット表記 | 用途 | 人物の識別可能性 |
|---|---|---|---|---|---|---|
| `public/samples/breadday/hero.avif` | **AI 生成**（Higgsfield / gpt_image_2 / 3:2 / 2k / high / 2026-09-18・ジョブ `0f41ad5c-061c-4f82-8883-3d068c324779`）。場面の原版（このサイトの他の写真は、これを参照画像にして作った）。プロンプト要旨: ヒーロー。バターの色の天板に鉄板と紙、クロワッサン4個（1個は割って断面）、黒珈琲 | Higgsfield Terms of Use（出力の権利は利用者に帰属・商用可・第三者への譲渡可） | 2026-09-18 | 不要 | BREADDAY — トップのヒーロー（**先読みする1枚**）・受取の状況 | **なし**（人体を1つも写していない） |
| `public/samples/breadday/hero.webp` | 同左（AVIF 非対応向けフォールバック） | Higgsfield Terms of Use（出力の権利は利用者に帰属・商用可・第三者への譲渡可） | 2026-09-18 | 不要 | 同左 | **なし**（人体を1つも写していない） |
| `public/samples/breadday/croissant.avif` | **AI 生成**（Higgsfield / gpt_image_2 / 4:3 / 2k / high / 2026-09-18・ジョブ `c352329d-f13f-4997-94cc-88b242d7d996`）。原版 `breadday/hero` を参照画像として渡し、場面を保ったまま被写体だけを替えた。プロンプト要旨: **同じ天板・同じ光・同じ俯瞰**のまま、被写体をバタークロワッサン1個に | Higgsfield Terms of Use（出力の権利は利用者に帰属・商用可・第三者への譲渡可） | 2026-09-18 | 不要 | BREADDAY — 「バタークロワッサン」（トップ・パンとカフェ・受取・管理） | **なし**（人体を1つも写していない） |
| `public/samples/breadday/croissant.webp` | 同左（AVIF 非対応向けフォールバック） | Higgsfield Terms of Use（出力の権利は利用者に帰属・商用可・第三者への譲渡可） | 2026-09-18 | 不要 | 同左 | **なし**（人体を1つも写していない） |
| `public/samples/breadday/roll.avif` | **AI 生成**（Higgsfield / gpt_image_2 / 4:3 / 2k / high / 2026-09-18・ジョブ `20a75e1a-8a3c-48f7-8dc3-8cefa57ad08f`）。原版 `breadday/hero` を参照画像として渡し、場面を保ったまま被写体だけを替えた。プロンプト要旨: 同上、シナモンロール（レンガ色の皿） | Higgsfield Terms of Use（出力の権利は利用者に帰属・商用可・第三者への譲渡可） | 2026-09-18 | 不要 | BREADDAY — 「シナモンロール」（同上） | **なし**（人体を1つも写していない） |
| `public/samples/breadday/roll.webp` | 同左（AVIF 非対応向けフォールバック） | Higgsfield Terms of Use（出力の権利は利用者に帰属・商用可・第三者への譲渡可） | 2026-09-18 | 不要 | 同左 | **なし**（人体を1つも写していない） |
| `public/samples/breadday/loaf.avif` | **AI 生成**（Higgsfield / gpt_image_2 / 4:3 / 2k / high / 2026-09-18・ジョブ `502a6de0-cb68-443c-987c-3dbecbfba5c9`）。原版 `breadday/hero` を参照画像として渡し、場面を保ったまま被写体だけを替えた。プロンプト要旨: 同上、角食パン1斤。角が見えるよう目線だけ下げた | Higgsfield Terms of Use（出力の権利は利用者に帰属・商用可・第三者への譲渡可） | 2026-09-18 | 不要 | BREADDAY — 「角食パン 1斤」（同上） | **なし**（人体を1つも写していない） |
| `public/samples/breadday/loaf.webp` | 同左（AVIF 非対応向けフォールバック） | Higgsfield Terms of Use（出力の権利は利用者に帰属・商用可・第三者への譲渡可） | 2026-09-18 | 不要 | 同左 | **なし**（人体を1つも写していない） |
| `public/samples/breadday/sand.avif` | **AI 生成**（Higgsfield / gpt_image_2 / 4:3 / 2k / high / 2026-09-18・ジョブ `9f3a9f7b-9786-4e19-9efa-794f7874fe62`）。原版 `breadday/hero` を参照画像として渡し、場面を保ったまま被写体だけを替えた。プロンプト要旨: 同上、ハムとチーズのサンド（断面を上に） | Higgsfield Terms of Use（出力の権利は利用者に帰属・商用可・第三者への譲渡可） | 2026-09-18 | 不要 | BREADDAY — 「ハムとチーズのサンド」（同上） | **なし**（人体を1つも写していない） |
| `public/samples/breadday/sand.webp` | 同左（AVIF 非対応向けフォールバック） | Higgsfield Terms of Use（出力の権利は利用者に帰属・商用可・第三者への譲渡可） | 2026-09-18 | 不要 | 同左 | **なし**（人体を1つも写していない） |
| `public/samples/breadday/cafe.avif` | **AI 生成**（Higgsfield / gpt_image_2 / 4:3 / 2k / high / 2026-09-18・ジョブ `2093d918-3f63-400b-9048-c45b534a9fb6`）。原版 `breadday/hero` を参照画像として渡し、場面を保ったまま被写体だけを替えた。プロンプト要旨: 同じ光・同じ俯瞰のまま、天板をレンガ色に。カフェラテとスプーン | Higgsfield Terms of Use（出力の権利は利用者に帰属・商用可・第三者への譲渡可） | 2026-09-18 | 不要 | BREADDAY — トップの「STAY A LITTLE.」・パンとカフェ | **なし**（人体を1つも写していない） |
| `public/samples/breadday/cafe.webp` | 同左（AVIF 非対応向けフォールバック） | Higgsfield Terms of Use（出力の権利は利用者に帰属・商用可・第三者への譲渡可） | 2026-09-18 | 不要 | 同左 | **なし**（人体を1つも写していない） |
| `public/samples/breadday/counter.avif` | **AI 生成**（Higgsfield / gpt_image_2 / 4:3 / 2k / high / 2026-09-18・ジョブ `c06284ee-8cda-4661-b7b8-82277247d958`）。原版 `breadday/hero` を参照画像として渡し、場面を保ったまま被写体だけを替えた。プロンプト要旨: 店内。同じ配色・同じ側光。**値札・黒板・品書き・看板を一切出さない**、人は写さない | Higgsfield Terms of Use（出力の権利は利用者に帰属・商用可・第三者への譲渡可） | 2026-09-18 | 不要 | BREADDAY — トップの店内・席の予約・管理のログイン | **なし**（人体を1つも写していない） |
| `public/samples/breadday/counter.webp` | 同左（AVIF 非対応向けフォールバック） | Higgsfield Terms of Use（出力の権利は利用者に帰属・商用可・第三者への譲渡可） | 2026-09-18 | 不要 | 同左 | **なし**（人体を1つも写していない） |
