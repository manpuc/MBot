const fs = require('fs');
const path = require('path');

/**
 * エラーをログファイルに保存します
 */
function logError(commandName, error) {
  const logDir = path.join(__dirname, '../../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const logFile = path.join(logDir, 'error.log');
  const timestamp = new Date().toISOString();
  const errorMsg = `[${timestamp}] [Command: ${commandName}] Error: ${error.message}\nStack: ${error.stack}\n\n`;

  fs.appendFileSync(logFile, errorMsg);
  console.error(`[MBot ErrorLogger] Command: ${commandName}, Error: ${error.message}`);
}

module.exports = { logError };
