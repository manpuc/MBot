const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { handleCommandError } = require("../middleware/errorHandler");

module.exports = {
  data: {
    name: "pagespeed",
    description: "Google PageSpeed Insights でウェブサイトのパフォーマンスを詳細分析します",
    options: [
      {
        name: "url",
        description: "測定したいURL (例: https://google.com)",
        type: 3,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const url = interaction.options.getString("url");
    const apiKey = process.env.PAGESPEED_API_KEY;
    const commandName = 'pagespeed';

    if (!apiKey) {
      return interaction.reply({
        content: "⚠️ `PAGESPEED_API_KEY` が設定されていません。.envファイルを確認してください。",
        ephemeral: true,
      });
    }

    if (!url.startsWith("http")) {
      return interaction.reply({
        content: "⚠️ 正しい形式のURLを入力してください (http:// または https:// で始まる必要があります)",
        ephemeral: true,
      });
    }

    // 自分にのみ見えるように予約
    await interaction.deferReply({ ephemeral: true });

    try {
      // モバイルとデスクトップの両方を並行してリクエスト (60秒タイムアウト)
      const [mobileResult, desktopResult] = await Promise.all([
        fetchPageSpeed(url, "mobile", apiKey, 60000),
        fetchPageSpeed(url, "desktop", apiKey, 60000),
      ]);

      const m = mobileResult.lighthouseResult;
      const d = desktopResult.lighthouseResult;

      const scores = {
        mobile: {
          perf: Math.round(m.categories.performance.score * 100),
          acc: Math.round(m.categories.accessibility.score * 100),
          seo: Math.round(m.categories.seo.score * 100),
        },
        desktop: {
          perf: Math.round(d.categories.performance.score * 100),
          acc: Math.round(d.categories.accessibility.score * 100),
          seo: Math.round(d.categories.seo.score * 100),
        },
      };

      const getEmoji = (score) => (score >= 90 ? "✅" : score >= 50 ? "⚠️" : "❌");
      const getColor = (score) => (score >= 90 ? "#2ECC71" : score >= 50 ? "#F1C40F" : "#E74C3C");

      const getSuggestions = (lighthouseResult, category) => {
        const auditRefs = lighthouseResult.categories[category].auditRefs;
        const audits = lighthouseResult.audits;
        return auditRefs
          .filter(ref => audits[ref.id].score !== null && audits[ref.id].score < 0.9)
          .sort((a, b) => (audits[a.id].score || 0) - (audits[b.id].score || 0))
          .slice(0, 3)
          .map(ref => `• **${audits[ref.id].title}**${audits[ref.id].displayValue ? ` (${audits[ref.id].displayValue})` : ""}`)
          .join("\n") || "特に大きな問題は見つかりませんでした。";
      };

      const embed = new EmbedBuilder()
        .setColor(getColor(scores.mobile.perf))
        .setTitle(`📊 PageSpeed 分析結果: ${url}`)
        .setURL(`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}`)
        .addFields(
          { name: "🎯 パフォーマンス", value: `📱 モバイル: **${scores.mobile.perf}** ${getEmoji(scores.mobile.perf)}\n💻 デスクトップ: **${scores.desktop.perf}** ${getEmoji(scores.desktop.perf)}` },
          { name: "🛠️ 改善案 (モバイル)", value: getSuggestions(m, "performance") },
          { name: "♿ アクセシビリティ", value: `📱 モバイル: **${scores.mobile.acc}** ${getEmoji(scores.mobile.acc)}\n💻 デスクトップ: **${scores.desktop.acc}** ${getEmoji(scores.desktop.acc)}`, inline: true },
          { name: "🔍 SEO", value: `📱 モバイル: **${scores.mobile.seo}** ${getEmoji(scores.mobile.seo)}\n💻 デスクトップ: **${scores.desktop.seo}** ${getEmoji(scores.desktop.seo)}`, inline: true },
          { name: "♿ アクセシビリティ改善案", value: getSuggestions(m, "accessibility") },
          { name: "🔍 SEO改善案", value: getSuggestions(m, "seo") }
        )
        .setTimestamp()
        .setFooter({ text: "MBot PageSpeed Service" });

      await interaction.editReply({ embeds: [embed] });

      // 成功時にカウントリセット
      await handleCommandError(interaction, null, commandName);

    } catch (error) {
      // 共通エラー処理の呼び出し
      await handleCommandError(interaction, error, commandName);
    }
  },
};

/**
 * PageSpeed Insights APIを呼び出す関数
 */
async function fetchPageSpeed(url, strategy, apiKey, timeout) {
  const endpoint = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
  const params = {
    url,
    key: apiKey,
    strategy,
    category: ["performance", "accessibility", "seo"],
    locale: "ja",
  };

  const response = await axios.get(endpoint, { 
    params,
    paramsSerializer: { indexes: null },
    timeout
  });
  return response.data;
}
