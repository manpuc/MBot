# MBot

多機能 Discord Bot — ゲーム・ユーティリティ・モデレーション機能を搭載した汎用 Bot です。

[![Invite MBot](https://img.shields.io/badge/Discordに招待-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/api/oauth2/authorize?client_id=1040561874279870484&permissions=1786907970647&scope=applications.commands%20bot)

---

## 🚀 招待リンク

[**MBot をサーバーに追加する**](https://discord.com/api/oauth2/authorize?client_id=1040561874279870484&permissions=1786907970647&scope=applications.commands%20bot)

---

## 📦 技術スタック

- **Runtime**: Node.js
- **Library**: discord.js
- **Commands**: スラッシュコマンド（`/`）対応

---

## 🎮 コマンド一覧

### 🎲 ゲーム・エンタメ

| コマンド | 説明 |
|---|---|
| `/janken` | ボットとじゃんけん勝負 |
| `/guessr` | 数当てゲーム |
| `/lottery` | 抽選・くじ引き |
| `/lucky` | 今日の運勢をチェック |
| `/animal` | ランダムな動物の画像を表示 |
| `/cat` | ランダムな猫の画像を表示 |
| `/dog` | ランダムな犬の画像を表示 |

### 🧮 ユーティリティ・計算

| コマンド | 説明 |
|---|---|
| `/calc` | 計算機（数式を入力して計算） |
| `/count` | 文章の文字数をカウント（.TXTファイル対応） |
| `/math` | 数学関数の計算 |
| `/bmi` | BMI を計算して結果を表示 |
| `/random` | 指定範囲でランダムな数値を生成 |
| `/timer` | タイマーをセット |
| `/timestamp` | タイムスタンプを生成 |
| `/uuid` | UUID を生成 |
| `/qr` | URL や文字列から QR コードを生成 |
| `/url-short` | URL を短縮 |
| `/outage-check` | ウェブサイトの障害情報を確認 |
| `/pagespeed` | ウェブサイトのパフォーマンスを詳細分析 |

### 📋 サーバー管理・情報

| コマンド | 説明 |
|---|---|
| `/server-info` | サーバーの情報を表示 |
| `/server-icon` | サーバーアイコンを表示 |
| `/whois` | ドメイン情報を表示 |
| `/icon` | ユーザーのアイコンを表示 |
| `/mbot-icon` | MBot のアイコンを表示 |
| `/rolecount` | 指定ロールのメンバー数を表示 |
| `/ban-list` | BANリストを表示 |
| `/ping` | Botの応答速度（レイテンシ）を確認 |

### 📝 コンテンツ・送信

| コマンド | 説明 |
|---|---|
| `/poll` | 投票（アンケート）を作成 |
| `/memo` | 個人メッセージでメモ開始 |
| `/send-img` | 画像を指定チャンネルに送信 |
| `/send-txt` | テキストをチャンネルに送信 |
| `/disclose` | 情報を公開 |
| `/first-word` | チャンネル内の最初の一言を検索 |

### 🧵 スレッド管理

| コマンド | 説明 |
|---|---|
| `/thread-make` | スレッドを作成 |
| `/thread-delete` | スレッドを削除 |

### 🎬 YouTube

| コマンド | 説明 |
|---|---|
| `/yt-info` | YouTube 動画の情報を取得 |
| `/ytid` | YouTube の動画 ID を取得 |

### ⚙️ その他

| コマンド | 説明 |
|---|---|
| `/hello` | Bot に挨拶 |
| `/nick` | ニックネームを変更 |
| `/chid` | チャンネル ID を取得 |
| `/iss` | 国際宇宙ステーション（ISS）の現在位置を表示 |

---

## 🔧 セルフホスト（自分でホストする場合）

```bash
# リポジトリをクローン
git clone https://github.com/manpuc/MBot.git
cd MBot

# 依存パッケージをインストール
pnpm install

# 環境変数を設定（.envファイルを作成）
# DISCORD_TOKEN=your_bot_token

# Botを起動
pnpm start
```

詳しいセットアップ手順は [guide.md](./guide.md) を参照してください。

---

> **MBot** — あなたの Discord サーバーをもっと便利に、もっと楽しく。
