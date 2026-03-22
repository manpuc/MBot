require('dotenv').config();

if (!process.env.DISCORD_BOT_TOKEN) {
  console.log("DISCORD_BOT_TOKENを設定してください。");
  process.exit(1);
}

const http = require("http");
const querystring = require("node:querystring");

http
  .createServer(function(req, res) {
    if (req.method == "POST") {
      let data = "";
      req.on("data", function(chunk) {
        data += chunk;
      });
      req.on("end", function() {
        if (!data || data.trim() === "") {
          res.end("No post data");
          return;
        }
        let dataObject = querystring.parse(data);
        console.log("post:" + dataObject.type);
        if (dataObject.type == "wake") {
          console.log("Woke up in post");
          res.statusCode = 200;
          res.end("OK"); // UptimeRobot用
          return;
        }
        res.statusCode = 200;
        res.end("OK");
      });
    } else if (req.method == "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Discord Bot is Operating!");
    } else {
      res.writeHead(404);
      res.end();
    }
  })
  .listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
  });

require("./code.js");
