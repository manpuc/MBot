const { Client, Intents, MessageEmbed, userMention } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const apiKey = process.env.YOUTUBE_API_KEY;

const fs = require("fs");
const path = require("path");

const commandsFolder = path.join(__dirname, "commands");

// コマンドファイルを読み込む
const commands = [];
const commandFiles = fs
  .readdirSync(commandsFolder)
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(path.join(commandsFolder, file));
  commands.push(command.data);
}

const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_BOT_TOKEN
);

async function main() {
  try {
    await rest.put(Routes.applicationCommands(process.env.DISCORD_BOT_CLIENT_ID), {
      body: commands,
    });
    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
}

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.on('guildCreate', (guild) => {
  // このイベントはボットが新しいサーバー（ギルド）に参加したときにトリガーされます。
  // 'guild' パラメータを使用してサーバーの情報にアクセスできます。

  const serverData = {
    name: guild.name,
    memberCount: guild.memberCount,
  };

  // これで 'serverData' を JSON ファイルやデータベースに記録することができます。
  // たとえば、データを JSON ファイルに保存する場合：
  const serverDataFile = path.join(__dirname, "data", "joinServer.json");
  const existingData = fs.existsSync(serverDataFile) ? JSON.parse(fs.readFileSync(serverDataFile)) : [];
  
  existingData.push(serverData);

  fs.writeFileSync(serverDataFile, JSON.stringify(existingData, null, 2));

  // この情報をログに記録するか、他の任意のアクションを実行することもできます。
  console.log(`ボットがサーバーに参加しました: ${guild.name}（メンバー数: ${guild.memberCount}）`);
});


client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  const content = message.content.toLowerCase();

  if (content.includes('くぁｗせｄｒｆｔｇｙふじこｌｐ')) {
    if (Math.random() < 0.2) {
      message.reply('とりま落ち着け。');
      const userId = message.author.id;
      client.users.send(
        userId,
        `<@${userId}>さんおはこんばんにちは MBotはサポートが終了しました\nセキュリティーに問題があるので今すぐMBotを削除してください`
      );
    }
  }
  if (content.includes('おやすみ')) {
    if (Math.random() < 0.2) {
      message.reply('おやすみなさい！いい夢見てね！');
    }
  }
});



client.on("debug", console.log); 
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: "MBotのここがすごい！　　　　　　　" }],
    status: "online",
  });
  main();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  // コマンドごとの処理をここに追加します
  const commandName = interaction.commandName;
  const commandFile = commandFiles.find((file) => file.startsWith(commandName));

  if (commandFile) {
    const command = require(path.join(commandsFolder, commandFile));

    // 追加: 権限チェック
    const restrictedCommands = ["muteall", "unmuteall", "unmuteall-timer", "set-report-channel", "remove-report-channel"];
    if (restrictedCommands.includes(commandName)) {
      // 管理者権限を持っているかをチェックする
      if (!interaction.member.permissions.has("ADMINISTRATOR")) {
        // メンバーが管理者権限を持っていない場合
        const ErrEmbed = new MessageEmbed()
          .setColor(15221188)
          .setTitle("えろー")
          .setDescription("このコマンドを使用する権限がありません。");
        await interaction.reply({ embeds: [ErrEmbed] });
        return;
      }
    }

    command.execute(interaction);
  } else {
    console.error(`Unknown command: ${commandName}`);
    await interaction.reply("未知のコマンドです。");
  }
});

//おフラインにします 2024/08/01
//process.exit()

client.login(process.env.DISCORD_BOT_TOKEN);
