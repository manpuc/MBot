const http = require("http");
const querystring = require("node:querystring");

http
  .createServer(function(req, res) {
    if (req.method == "POST") {
      var data = "";
      req.on("data", function(chunk) {
        data += chunk;
      });
      req.on("end", function() {
        if (!data) {
          res.end("No post data");
          return;
        }
        var dataObject = querystring.parse(data);
        console.log("post:" + dataObject.type);
        if (dataObject.type == "wake") {
          console.log("Woke up in post");
          res.end();
          return;
        }
        res.end();
      });
    } else if (req.method == "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Discord Bot is Operating!");
    }
  })
  .listen(process.env.PORT || 3000); // ← 修正ポイント

if (!"MTA0MDU2MTg3NDI3OTg3MDQ4NA.GkhWBH.N90MFJLmnT3yzAPcc4Woyrx1exzPgFEXsAS824") {
  console.log("DISCORD_BOT_TOKENを設定してください。");
  process.exit(0);
}

require("./code.js");
