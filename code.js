const { Client, GatewayIntentBits , EmbedBuilder , userMention } = require("discord.js");

const Discord = require('discord.js')
const prefix = '!'

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
    if (message.content == '職場体験いいな') {
      for(var num = 0; num <5; num ++){
        message.channel.send('<@900661796917108737>ｼｮｸﾊﾞﾀｲｹﾝ ｼﾀｶｯﾀ ﾎﾞｸﾓ...');
      }     
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
        description: '簡易投票',
      },
    ];
    await client.application.commands.set(data);
    console.log("COMMANDS OK!");
});

//コマンドの内容
//commands
client.on("interactionCreate", async (i) => {
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
        const userId = 'ゆーざーあいでぃー' //どうID習得するの
        await i.reply(`<@${userId}>ごきげんよう`);
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
            ],
          color: 15221188,
          timestamp: new Date()
	      }], ephemeral: true});
    }
     if (!i.content.startsWith(prefix)) return
         const [command, ...args] = i.content.slice(prefix.length).split(' ')
         const emojis = ['🇦', '🇧', '🇨', '🇩']
         if (command === 'poll') {
           const [title, ...choices] = args
           if (!title) return i.channel.send('タイトルを指定してください')
           if (choices.length < 2 || choices.length > emojis.length)
             return i.channel.send(`選択肢は2から${emojis.length}つを指定してください`); 
           const embed = new Discord.MessageEmbed().setTitle(title).setDescription(choices.map((c,i)=> `${emojis[i]} ${c}`).join('\n'))
           const poll = await i.channel.send({
             embeds: [embed]
           });
           emojis.slice(0, choices.length).forEach(emoji => poll.react(emoji))
           embed.setFooter({
            text: `集計時は !endpoll ${poll.channel.id} ${poll.id} と送信してください。`
           })
           poll.edit({embeds:[embed]});
           return;
         }
         if (command === 'endpoll') {
          const [cid, mid] = args;
          if (!cid || !mid) return i.channel.send('IDが指定されていません。');
          const channel = await i.guild.channels.fetch(cid);
          const poll = await channel.messages.fetch(mid);
          if (poll.author.id !== client.user.id) return;
          if (poll.embeds[0]) return;
          let result = "投票結果";
          for (let i = 0; poll.reactions.cache.get(emojis[i]) && i < emojis.length; i++){
            const reaction = poll.reactions.cache.get(emojis[i])
            result = `${result}\n${emojis[i]}：${reaction.users.cache.has(client.user.id)?reaction.count-1:reaction.count}票`
          }
          poll.reply({
            embeds:[
              new Discord.MessageEmbed()
                .setTitle(poll.embeds[0].title)
                .setDescription(result)
            ]
          })
      }
});

//process.exit()
client.login(process.env.DISCORD_BOT_TOKEN);