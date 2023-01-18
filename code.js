const { Discord , Client,
       GatewayIntentBits,
       EmbedBuilder,
       userMention,
       MessageEmbed,
       Message,
       ColorResolvable , SlashCommandBuilder , PermissionFlagsBits , ChannelType ,MessageButton} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.on('ready', async() => {//完全不潔のMBot
  client.user.setPresence({ activities: [{ name: 'MBotのここがすごい！　　　　　　　' }], status: 'online' });//おいwww   
                                                //  ↑草　ｗｗｗｗｗｗｗｗｗ
  console.log("MBotOnline");
});
//sample (ネタコマンド　いつかけします。)
  //公開時に削除
client.on('messageCreate', message => {
    if (message.author.bot)return;
    if (message.content == 'くぁｗせｄｒｆｔｇｙふじこｌｐ') {
        message.channel.send(`${userMention(message.author.id)}とりま落ち着け。`);
      const userId = message.author.id; 
      client.users.send( userId , `<@${userId}>さんこんにちは　MBotはサポートが終了しました\nセキュリティーに問題があるので今すぐMBotを削除してください`)//943457413367996466
    }
});
    //ここまで

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
        description: '簡易投票(β)',
      },
    ];
    await client.application.commands.set(data);
  //
});

//コマンドの内容
//commands

client.on("interactionCreate", async i => {
    if (!i.isCommand()) {
        return;
    }
      //poll
    if (i.commandName === 'poll') {
        const pollEmbed = new EmbedBuilder()
          .setColor('E841C4')
          .setTitle('Poll')
          .setDescription('色を選べ')
          .setFooter('絵文字に反応して投票')
          .addField(
                    {name:'🔴 Red', value:'0 votes', inline:true},
                    {name:'🟢 Green', value:'0 votes', inline:true},
                    {name:'🔵 Blue', value:'0 votes', inline:true},
          )
        await i.send({ 
          embeds: [pollEmbed]
        })
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
        await i.reply(`${userMention(i.user.id)}ごきげんよう`);
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
              { name: '/poll', value: '夢物語。おそらくもう開発しない' },
            ],
          color: 15221188,
          timestamp: new Date()
	      }], ephemeral: true});
    } 
});

//process.exit()
client.login(process.env.DISCORD_BOT_TOKEN);