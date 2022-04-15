const {Client, GatewayIntentBits} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

/*
GatewayIntentBitsの項目リスト
Guilds
GuildMembers
GuildBans
GuildEmojisAndStickers
GuildIntegrations
GuildWebhooks
GuildInvites
GuildVoiceStates
GuildPresences
GuildMessages
GuildMessageReactions
GuildMessageTyping
DirectMessages
DirectMessageReactions
DirectMessageTyping: 16384,
MessageContent: 32768,
GuildScheduledEvents: 65536
*/

client.on("ready", () => {
  console.log("Bot準備完了！");
});

//ここから

client.on("message", message =>{
  if (message.content === "hello."){
    message.channel.send(`hello! ${message.author}`)
  }
})

//ここまで

client.login(process.env.DISCORD_BOT_TOKEN);