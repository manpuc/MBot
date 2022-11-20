function pingCommand(client) {
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
  });
}
module.exports = pingCommand