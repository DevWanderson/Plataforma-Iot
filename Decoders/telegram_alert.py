import telebot
import config

tb = telebot.AsyncTeleBot(config.telegram_token)

class Telegram:
    def send_alert(msg, user_id):
        message = telebot.util.split_string(msg, 3000)
        print(message)
        for txt in message:
            tb.send_message(user_id, txt)
        
