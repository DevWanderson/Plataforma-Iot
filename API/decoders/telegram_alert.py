import telebot

tb = telebot.AsyncTeleBot("1764004221:AAEBgIYb2AcEnUxQUCbkRoDkk-5WiQ3ifMg")

class Telegram:
    def send_alert(msg, user_id):
        message = telebot.util.split_string(msg, 3000)
        print(message)
        for txt in message:
            tb.send_message(user_id, txt)
        
