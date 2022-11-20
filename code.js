const { Discord , Client, GatewayIntentBits , EmbedBuilder , userMention , MessageEmbed, Message , ColorResolvable , SlashCommandBuilder , PermissionFlagsBits , ChannelType } = require("discord.js");

const { poll } = require('discord.js-poll');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', async() => {
  client.user.setActivity('MBot', { type: "PLAYING" },{ status: "idle" });　　
  console.log("MBot... Let's Gooooooooo!!!");
});
//sample (ネタコマンド　いつかけします。)
client.on('messageCreate', message => {
    if (message.author.bot)return;
    if (message.content == 'hi') {
        message.channel.send('hi!');
    }
});
client.on('messageCreate', message => {
    if (message.author.bot)return;
    if (message.content == 'MBot on top!') {
      for(var num = 0; num <5; num ++){
        message.channel.send('@everyone MBot on top!');
      }
    }
});

//コマンドの登録
client.on("ready", async () => {
    const data = [
      {
        name: 'ping',
        description: '現在のpingを測定します',
      },
      {
        name: 'menu',
        description: 'メニューを表示します',
      },
      {
        name: 'hello',
        description: 'あいさつ返す',
      },
      {
        name: 'poll',
        description: '簡易投票(未実装)',
      },
    ];
    await client.application.commands.set(data);
    console.log("COMMANDS OK!");
});

//コマンドの内容
//commands
client.on("interactionCreate", async i => {
    if (!i.isCommand()) {
        return;
    }
      //ping command
    if (i.commandName === 'ping') {
        const e = new EmbedBuilder()
          .setColor('E841C4')
          .setTitle('Ping')
          .setDescription(`${Date.now() - i.createdTimestamp}ms`)
        await i.reply({ embeds: [e], ephemeral: true});
    }
      //hello command
    if (i.commandName === 'hello') {
        await i.reply(`<@${i.user.id}>ごきげんよう`);
    }
    if (i.commandName === 'menu') {
        new EmbedBuilder()
          .setColor('E841C4')
          //.setTitle('MBot めにゅ～')
        await i.reply({ embeds: [
          {
          title: 'MBot めにゅ～',
          /*url: 'いつか追加する',*/
            fields: [
              { name: '/ping', value: '現在のPingを計測します。' },
              { name: '/hello', value: 'あいさつを返してくれます。ぼっちのあなたにも優しいbotです。' },
              { name: '/poll', value: '簡易的な投票を開始できます。' },
            ],
          color: 15221188,
          timestamp: new Date()
	      }], ephemeral: true});
    }
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Create a poll and send it to a certain channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName("description")
                .setDescription("Describe the poll.")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Where do you want to send the poll to?")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),
    async execute(interaction) {
        const { options } = interaction;

        const channel = options.getChannel("channel");
        const description = options.getString("description");

        const embed = new EmbedBuilder()
            .setColor("Gold")
            .setDescription(description)
            .setTimestamp();

        try {
            const m = await channel.send({ embeds: [embed] });
            await m.react("✅");
            await m.react("❌");
            await interaction.reply({ content: "Poll was succesfully sent to the channel.", ephemeral: true });
        } catch (err) {
            console.log(err);
        }
    }
}
    /*module.exports = {
        name: 'poll',
        description: 'Create a poll',
        usage: 'Title + Option 1 + Option 2 + Option 3 + etc',
        execute(client, message, args) {
          poll(message, args, '+', '#00D1CD');
        },
    };*/
//process.exit()
client.login(process.env.DISCORD_BOT_TOKEN);