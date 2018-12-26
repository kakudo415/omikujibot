"use strict";
const poems = require("./poems").poems;

module.exports = (bot) => {
  bot.respond(/(へるぷ|ヘルプ|おしえて|教えて)/, (msg) => {
    msg.send({
      "attachments": [
        {
          "title": "おみくじ",
          "text": "私へのメンションと共にコマンドを入力することで占います\n結果の順番は *大吉 > 中吉 > 小吉 > 吉 > 末吉 > 凶 > 大凶* の順番です"
        }
      ]
    });
  });

  bot.respond(/(ひく|引く)/, (msg) => {
    const userID = msg.message.user.id;
    let result = brainGET(userID);
    if (!result) {
      result = draw();
      brainSET(userID, result);
    }
    result.attachments[0].author_name = `${msg.message.user.slack.profile.display_name} さんのおみくじの結果`;
    msg.send(result);
  });

  // 時刻つきで保存
  const brainSET = (key, value) => {
    bot.brain.set(`OMIKUJI:${key}`, { "value": value, "time": new Date() });
  };

  // GET from brain (今日以前のデータは削除)
  const brainGET = (key) => {
    let value = bot.brain.get(`OMIKUJI:${key}`);
    if (!value || !value.time) {
      return null;
    }

    let valueDate = new Date(value.time);
    valueDate = new Date(valueDate.getFullYear(), valueDate.getMonth(), valueDate.getDate())
    let today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (valueDate < today) {
      bot.brain.remove(key);
      return null;
    }
    return value.value;
  };
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