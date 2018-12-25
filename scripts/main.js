"use strict";
const poems = require("./poems").poems;

module.exports = (bot) => {
  bot.respond(/(へるぷ|ヘルプ|おしえて|教えて)/, (msg) => {
    msg.send({
      "attachments": [
        {
          "title": "おみくじ",
          "text": "\"おみくじ\" というメッセージに反応して占います\n結果の順番は *大吉 > 中吉 > 小吉 > 吉 > 末吉 > 凶 > 大凶* の順番です"
        }
      ]
    });
  });

  bot.respond(/(ひく|引く)/, (msg) => {
    const userID = msg.message.user.id;
    let result = bot.brain.get(userID);
    if (!result) {
      result = draw();
      bot.brain.set(userID, result);
    }
    msg.send(result);
  });
};

const draw = () => {
  let fortune;
  let color;
  let poem;
  const random = Math.floor(Math.random() * 100);
  if (70 <= random && random < 100) {
    fortune = "大吉";
    color = "#F44336";
  }
  if (50 <= random && random < 70) {
    fortune = "中吉";
    color = "#FF9800";
  }
  if (40 <= random && random < 50) {
    fortune = "小吉";
    color = "#FFC107";
  }
  if (25 <= random && random < 40) {
    fortune = "吉";
    color = "#FFEB3B";
  }
  if (15 <= random && random < 25) {
    fortune = "末吉";
    color = "#CDDC39";
  }
  if (5 <= random && random < 15) {
    fortune = "凶";
    color = "#2196F3";
  }
  if (0 <= random && random < 5) {
    fortune = "大凶";
    color = "#9C27B0";
  }
  poem = poems[Math.floor(Math.random() * poems.length)];

  return {
    "attachments": [
      {
        "title": fortune,
        "text": poem,
        "color": color
      }
    ]
  };
};