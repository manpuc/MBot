# MBot ローカルセットアップガイド

このガイドでは、MBot を自分の環境で動作させるための手順を詳しく説明します。

---

## 📋 1. 事前準備

始める前に、以下の環境が整っていることを確認してください。

- **Node.js**: v19.x 以上 (v24 推奨)
- **pnpm**: インストール済みであること (`corepack enable` で有効化可能)
- **Discord Bot**: [Discord Developer Portal](https://discord.com/developers/applications) で作成済みであること

---

## ⚙️ 2. Discord Developer Portal の設定

ボットが正常に動作するために、**Privileged Gateway Intents** の有効化が必要です。

1. [Developer Portal](https://discord.com/developers/applications) にアクセス
2. 自分のボットを選択し、左メニューの **Bot** をクリック
3. **Privileged Gateway Intents** セクションまでスクロールし、以下のスイッチをすべて **ON** にします。
   - [ ] **Presence Intent** (存在・アクティビティ情報)
   - [ ] **Server Members Intent** (メンバーの一覧取得)
   - [x] **Message Content Intent** (メッセージ内容の読み取り) ← **必須**

> [!IMPORTANT]
> **Message Content Intent** が無効だと、メッセージの内容や画像、Embeds などをボットが読み取ることができません。

---

## 🛠️ 3. インストール手順

### 1. リポジトリのクローン
ターミナルを開き、リポジトリを適当なディレクトリにクローンします。

```bash
git clone https://github.com/manpuc/MBot.git
cd MBot
```

### 2. 依存関係のインストール
`pnpm` を使用して、必要なパッケージをインストールします。

```bash
pnpm install
```

---

## 🔐 4. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、ボットのトークンを設定します。

```bash
touch .env
```

`.env` ファイルの中身を以下のように記述します：

```env
DISCORD_TOKEN=あなたのボットトークン here
```

> [!CAUTION]
> `.env` ファイルは他人に教えたり、共有リポジトリにコミットしたりしないでください。

---

## 🚀 5. ボットの起動

以下のコマンドでボットを起動します。

```bash
pnpm start
```

ログに `✅ Logged in as [ボット名]` と表示されれば成功です！
スラッシュコマンド（`/`）がサーバーに反映されるまで、少し時間がかかる場合があります（通常は数秒～数分）。

---

## 📑 付録: 使用している Gateway Intents

このボットでは以下の Intent を使用しています。正常に動作しない場合は、Portal でこれらが許可されているか確認してください。

- `Guilds`
- `GuildMembers`
- `GuildBans`
- `GuildEmojisAndStickers`
- `GuildIntegrations`
- `GuildWebhooks`
- `GuildInvites`
- `GuildVoiceStates`
- `GuildPresences`
- `GuildMessages`
- `GuildMessageReactions`
- `GuildMessageTyping`
- `DirectMessages`
- `DirectMessageReactions`
- `DirectMessageTyping`
- `MessageContent` (必須)
- `GuildScheduledEvents`

---

詳細は [README.md](./README.md) もあわせてご確認ください。