require('dotenv').config();
const fs = require("fs");
const path = require("path");
const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  EmbedBuilder 
} = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

// ─────────────── コマンド関連 ───────────────
const commandsFolder = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsFolder).filter(file => file.endsWith(".js"));

const commands = [];
const commandMap = new Map();

for (const file of commandFiles) {
  const command = require(path.join(commandsFolder, file));
  commands.push(command.data);
  commandMap.set(command.data.name, command);
}

// REST API でアプリケーションコマンドを登録
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);

async function registerCommands() {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_BOT_CLIENT_ID),
      { body: commands }
    );
    console.log("✅ Successfully registered application commands.");
  } catch (error) {
    console.error("❌ Error registering commands:", error);
  }
}

// ─────────────── Discord Client ───────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Channel],
});

// ─────────────── ギルド参加時 ───────────────
client.on('guildCreate', (guild) => {
  const serverData = {
    name: guild.name,
    memberCount: guild.memberCount,
  };
  console.log(`⚡ ボットがサーバーに参加しました: ${guild.name}（${guild.memberCount}人）`);
});

// ─────────────── メッセージ監視 ───────────────
//client.on('messageCreate', (message) => {
//  if (message.author.bot) return;
//
//  const content = message.content.toLowerCase();
//
//  if (content.includes('くぁｗせｄｒｆｔｇｙふじこｌｐ') && Math.random() < 0.2) {
//    message.reply('とりま落ち着け。');
//    client.users.send(
//      message.author.id,
//      `<@${message.author.id}>さんおはこんばんにちは MBotはサポートが終了しました\nセキュリティーに問題があるので今すぐMBotを削除してください`
//    );
//  }
//
//  if (content.includes('おやすみ') && Math.random() < 0.2) {
//    message.reply('おやすみなさい！いい夢見てね！');
//  }
//});

// ─────────────── Ready ───────────────
client.on("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: "MBotのここがすごい！" }],
    status: "online",
  });

  registerCommands();
});

// ─────────────── Interaction ───────────────
const cooldowns = new Map(); // ユーザーID -> 最後に使った時間
const COOLDOWN_SECONDS = 2; // クールダウン時間（秒）

client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const userId = interaction.user.id;
  const now = Date.now();

  if (cooldowns.has(userId)) {
    const expirationTime = cooldowns.get(userId) + COOLDOWN_SECONDS * 1000;
    if (now < expirationTime) {
      const remaining = Math.ceil((expirationTime - now) / 1000);
      
      // クールダウン延長：ここで現在時刻を更新
      cooldowns.set(userId, now);

      return interaction.reply({
        content: `⏳ クールダウン中です。あと 3 秒後再度お試しください。`,
        ephemeral: true
      });
    }
  }

  // 通常時も現在時刻で更新
  cooldowns.set(userId, now);

  const command = commandMap.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error("⚠ コマンド実行エラー:", err);
    try {
      if (interaction.deferred) {
        await interaction.editReply("コマンド実行中にエラーが発生しました。");
      } else if (interaction.replied) {
        await interaction.followUp({ content: "コマンド実行中にエラーが発生しました。", ephemeral: true });
      } else {
        await interaction.reply({ content: "コマンド実行中にエラーが発生しました。", ephemeral: true });
      }
    } catch (finalErr) {
      console.error("⚠ エラー処理中のエラー:", finalErr);
    }
  }
});


// ─────────────── Botログイン ───────────────
client.login(process.env.DISCORD_BOT_TOKEN);
