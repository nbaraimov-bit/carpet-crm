import TelegramBot
from "node-telegram-bot-api"

const token = "7843106853:AAGDXuNZPv0jY6LRyWtoTJl0ZXJ6gWfcgVc"

const bot = new TelegramBot(
  token,
  {
    polling: true
  }
)

bot.setChatMenuButton({

  menu_button: {

    type: "web_app",

    text: "Open",

    web_app: {

      url:
        "https://carpet-crm.onrender.com"

    }

  }

})

console.log("Bot ishga tushdi")

bot.onText(
  /\/start/,
  (msg) => {

    bot.sendMessage(

      msg.chat.id,

      "Gilam CRM",

    )

  }
)

bot.sendMessage(
  5793538486,
  "Test xabar 🚀"
)