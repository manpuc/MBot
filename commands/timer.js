const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { handleCommandError } = require("../middleware/errorHandler");

module.exports = {
  data: {
    name: "timer",
    description: "高機能タイマー（一時停止・再開・キャンセル機能付き）",
    options: [
      { name: "minutes", description: "分数（最大15）", type: 4, required: true },
      { name: "seconds", description: "秒数（最大59）", type: 4, required: true },
    ],
  },
  async execute(interaction) {
    const commandName = 'timer';
    const initialMins = interaction.options.getInteger("minutes");
    const initialSecs = interaction.options.getInteger("seconds");
    let remaining = initialMins * 60 + initialSecs;

    if (initialMins > 15 || (initialMins === 0 && initialSecs < 1) || initialSecs > 59) {
      return interaction.reply({ 
        embeds: [new EmbedBuilder().setColor("#FF0000").setDescription("時間の指定が範囲外です（最大15分まで）。")], 
        ephemeral: true 
      });
    }

    let isPaused = false;
    const authorId = interaction.user.id;

    const createEmbed = (status = "計測中") => {
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      return new EmbedBuilder()
        .setColor(isPaused ? "#F1C40F" : "#E841C4")
        .setTitle(`⌛ タイマー: ${status}`)
        .setDescription(`残り時間: **${m}分${s}秒**`)
        .setFooter({ text: `作成者: ${interaction.user.tag}` })
        .setTimestamp();
    };

    const getButtons = (paused) => {
      return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('timer-pause-resume')
          .setLabel(paused ? '再開' : '一時停止')
          .setStyle(paused ? ButtonStyle.Success : ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('timer-cancel')
          .setLabel('キャンセル')
          .setStyle(ButtonStyle.Danger)
      );
    };

    try {
      const response = await interaction.reply({
        embeds: [createEmbed()],
        components: [getButtons(isPaused)],
        fetchReply: true
      });

      // エラーカウントリセット
      await handleCommandError(interaction, null, commandName);

      // --- タイマーロジック ---
      const interval = setInterval(async () => {
        if (!isPaused) {
          remaining--;
          
          // 表示を更新（Discordのレートリミットを考慮して一定間隔で更新）
          if (remaining > 0 && remaining % 5 === 0) {
            try {
              await interaction.editReply({ embeds: [createEmbed()], components: [getButtons(isPaused)] });
            } catch (e) {
              console.error("Timer update error:", e);
              clearInterval(interval);
            }
          }
        }

        if (remaining <= 0) {
          clearInterval(interval);
          collector.stop('ended');
          try {
            await interaction.editReply({ 
              content: `🔔 ${interaction.user} タイマーが終了しました！`,
              embeds: [createEmbed("終了")], 
              components: [] 
            });
            // メンション付きで通知
            await interaction.followUp({ content: `🔔 タイマー終了！ (${initialMins}分${initialSecs}秒)` });
          } catch (e) {}
        }
      }, 1000);

      // --- ボタン操作コレクター ---
      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: (initialMins * 60 + initialSecs + 60) * 1000 // タイマー時間 + 60秒
      });

      collector.on('collect', async (i) => {
        if (i.user.id !== authorId) {
          return i.reply({ content: "❌ このタイマーは作成者のみ操作可能です。", ephemeral: true });
        }

        if (i.customId === 'timer-cancel') {
          clearInterval(interval);
          collector.stop('cancelled');
          return await i.update({ 
            embeds: [createEmbed("キャンセル")], 
            components: [], 
            content: "🚫 タイマーをキャンセルしました。" 
          });
        }

        if (i.customId === 'timer-pause-resume') {
          isPaused = !isPaused;
          await i.update({ 
            embeds: [createEmbed(isPaused ? "一時停止中" : "計測中")], 
            components: [getButtons(isPaused)] 
          });
        }
      });

      collector.on('end', (_, reason) => {
        clearInterval(interval);
        if (reason === 'time' && remaining > 0) {
          // タイムアウト時にボタンを無効化
          interaction.editReply({ components: [] }).catch(() => {});
        }
      });

    } catch (error) {
      await handleCommandError(interaction, error, commandName);
    }
  },
};
