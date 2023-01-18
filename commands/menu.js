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