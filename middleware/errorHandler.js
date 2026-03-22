const { EmbedBuilder } = require("discord.js");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const { logError } = require("../utils/errorLogger");

// lowdbの設定
const adapter = new FileSync(path.join(__dirname, '../data/error_counts.json'));
const db = low(adapter);

// ファイルの初期化
db.defaults({ counts: {} }).write();

/**
 * コマンドの実行成功時にカウントをリセット
 */
function resetErrorCount(commandName) {
  db.get('counts').set(commandName, 0).write();
}

/**
 * 共通エラーハンドラー
 * @param {import('discord.js').Interaction} interaction
 * @param {Error|null} error エラー（nullの場合は初期化またはチェックのみ可）
 * @param {string} commandName コマンド名
 */
async function handleCommandError(interaction, error, commandName) {
  // エラーがない（成功時）
  if (!error) {
    resetErrorCount(commandName);
    return;
  }

  // ログ出力
  logError(commandName, error);

  // エラーカウントの更新
  const currentCount = (db.get('counts').get(commandName).value() || 0) + 1;
  db.get('counts').set(commandName, currentCount).write();

  // エラー分類
  const status = error.response?.status;
  const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
  
  // Embed生成
  let embed;
  const devUrl = "https://manpuc.me";

  if (currentCount >= 3) {
    // 3回目以降: サービス障害中
    embed = new EmbedBuilder()
      .setColor("#FF0000") // 赤
      .setTitle("❌ サービス障害中")
      .setDescription(`API制限やネットワークエラーにより、${commandName} コマンドを正常に実行できませんでした。\n\n**👨‍💻 デベロッパーに連絡**\n${devUrl}\n\nしばらく時間をおいてから再試行してください。`)
      .setFooter({ text: "MBot Service Outage" })
      .setTimestamp();
  } else if (currentCount === 2) {
    // 2回目: サービス制限中
    embed = new EmbedBuilder()
      .setColor("#F1C40F") // 黄
      .setTitle("⚠️ サービス制限中")
      .setDescription(`エラーが続いています。APIのクォータ制限または接続が不安定な可能性があります。\n\n少々お待ちを。`)
      .setFooter({ text: "MBot PageSpeed Service" })
      .setTimestamp();
  } else {
    // 1回目: 一時的エラー
    let errorTitle = "⚠️ 一時的エラー";
    let errorDesc = "エラーが発生しました。1分後に再試行してください。";

    if (status === 429) {
      errorTitle = "⚠️ クォータ制限";
      errorDesc = "APIのリミットに達しました。1分後に再試行してください。";
    } else if (isTimeout) {
      errorTitle = "⚠️ タイムアウト";
      errorDesc = "ネットワークのタイムアウトが発生しました。1分後に再試行してください。";
    }

    embed = new EmbedBuilder()
      .setColor("#F1C40F") // 黄
      .setTitle(errorTitle)
      .setDescription(errorDesc)
      .setFooter({ text: "MBot API Warning" })
      .setTimestamp();
  }

  try {
    // エラーメッセージの送信、または既存の応答を更新
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ embeds: [embed] });
    } else {
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  } catch (followupError) {
    console.error("Failed to send error response:", followupError);
  }
}

module.exports = { handleCommandError, resetErrorCount };
