const { Discord , Client, GatewayIntentBits , EmbedBuilder , userMention , MessageEmbed, Message , ColorResolvable , SlashCommandBuilder , PermissionFlagsBits , ChannelType } = require("discord.js");

const { poll } = require('discord.js-poll');

const on_message = require('./Commands/poll.js')

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
  //公開時に削除
client.on('messageCreate', message => {
    if (message.author.bot)return;
    if (message.content == 'hi') {
        message.channel.send('hi!');
      const userId =client.message.user.id;//https://discord.js.org/#/docs/main/stable/class/Message
      client.users.send( 'userId' , 'こんにちは' );
    }//なにこれ しらない
  console.log(message);
});
/*
client.on('messageCreate', message => {
    if (message.author.bot)return;
    if (message.content == 'MBot on top!') {
      for(var num = 0; num <5; num ++){
        message.channel.send('@everyone MBot on top!');
      }
    }
});*/

module.exports = {
	name: 'poll',
	description: 'Create a poll',
	usage: 'Title + Option 1 + Option 2 + Option 3 + etc',
	execute(client, message, args) {
		poll(message, args, '+', '#00D1CD');
	},
};
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
              { name: '/poll', value: '簡易的な投票を開始できます。' },
            ],
          color: 15221188,
          timestamp: new Date()
	      }], ephemeral: true});
    }
      //poll

});
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