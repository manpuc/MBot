const {Client, GatewayIntentBits} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on("ready", () => {
  console.log("Bot準備完了！");
});

//ここから

client.on("messageCreate", message =>{
  if (message.content === "hello."){
    message.channel.send(`hello! ${message.author}`)
  }
})

//ここまで

client.login(process.env.DISCORD_BOT_TOKEN);