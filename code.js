const {
  REST,
  Routes,
  Discord,
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  userMention,
  MessageEmbed,
  Message,
  ColorResolvable,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  MessageButton,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.on("guildCreate", async () => {
  console.log("MBotOnline");
});
client.on("ready", async () => {
  client.user.setPresence({
    activities: [{ name: "MBotのここがすごい！　　　　　　　" }],
    status: "online",
  }); //おいwww
  //  ↑草　ｗｗｗｗｗｗｗｗｗ
  console.log("MBotOnline");
});
/*client.on("ready", async () => {
  const data = [
    {
      name: "ping"
      description: "現在のpingを測定します"
    }
    {
      name: "menu",
      description: "メニューを表示します",
    },
    {
      name: "hello",
      description: "あいさつ返す",
    },
    {
      name: "poll",
      description: "簡易投票('⭕'or'❌')",      
    },
  ];
  await client.application.commands.set(data);
});*/
const ping = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("現在のpingを測定します");
const menu = new SlashCommandBuilder()
  .setName("menu")
  .setDescription("メニューを表示します");
const hello = new SlashCommandBuilder()
  .setName("hello")
  .setDescription("あいさつ返す");
const poll = new SlashCommandBuilder()
  .setName("poll")
  .setDescription("簡易投票('⭕'or'❌')")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option.setName("description").setDescription("なんの").setRequired(true)
  )
  .addChannelOption((option) =>
    option.setName("channel").setDescription("どこで").setRequired(true)
  );
const commands = [ping, menu, hello, poll];
const rest = new REST({ version: "10" }).setToken(process.env.token);
async function main() {
  await rest.put(Routes.applicationCommands("1040561874279870484"), {
    body: commands,
  });
}
//commands

client.on("interactionCreate", async (i) => {
  if (!i.isCommand()) {
    return;
  }
  //poll command
  /*if (i.commandName === "poll") {
    const pollEmbed = new EmbedBuilder()
      .setColor("E841C4")
      .setTitle("Poll")
      .setDescription("好きな色は？")
      .setFooter({ text: "絵文字に反応して投票" })
      .addFields(
        { name: "🔴 Red", value: "0 votes", inline: true },
        { name: "🟢 Green", value: "0 votes", inline: true },
        { name: "🔵 Blue", value: "0 votes", inline: true }
      );
    await i.reply({ embeds: [pollEmbed] });
  }*/
  //poll command 2
  if (i.commandName === "poll") {
    const { options } = i;
    const channel = options.getChannel("channel");
    const description = options.getString("description");
    const embed = new EmbedBuilder()
      .setColor("Gold")
      .setDescription(description)
      .setTimestamp();
    try {
      const m = await channel.send({ embeds: [embed] });
      await m.react("⭕");
      await m.react("❌");
      await i.reply({ content: "問題なく動作", ephemeral: true });
    } catch (err) {
      console.log(err);
    }
  }
  //ping command
  if (i.commandName === "ping") {
    const e = new EmbedBuilder()
      .setColor("E841C4")
      .setTitle("Ping")
      .setDescription(`${Date.now() - i.createdTimestamp}ms`);
    await i.reply({ embeds: [e], ephemeral: true });
  }
  //hello command
  if (i.commandName === "hello") {
    await i.reply(`${userMention(i.user.id)}ごきげんよう`);
  }
  //menu command
  if (i.commandName === "menu") {
    new EmbedBuilder().setColor("E841C4");
    await i.reply({
      embeds: [
        {
          title: "MBot めにゅ～",
          /*url: 'いつか追加する',*/
          fields: [
            { name: "/ping", value: "現在のPingを計測します。" },
            {
              name: "/hello",
              value:
                "あいさつを返してくれます。ぼっちのあなたにも優しいbotです。",
            },
            { name: "/poll", value: "夢物語。おそらくもう開発しない" },
          ],
          color: 15221188,
          timestamp: new Date(),
        },
      ],
      ephemeral: true,
    });
  }
});
//sample (ネタコマンド　いつかけします。)
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content == "くぁｗせｄｒｆｔｇｙふじこｌｐ") {
    message.channel.send(`${userMention(message.author.id)}とりま落ち着け。`);
    const userId = message.author.id;
    client.users.send(
      userId,
      `<@${userId}>さんこんにちは　MBotはサポートが終了しました\nセキュリティーに問題があるので今すぐMBotを削除してください`
    ); //943457413367996466
  }
});

//process.exit()
client.login(process.env.DISCORD_BOT_TOKEN);
