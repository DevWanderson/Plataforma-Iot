import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags, rc):
    print("MQTT conectado. Cod:  " + str(rc))
    client.subscribe("ibti/#")
    
def on_message(client, userdata, msg):
    print(msg)

client = mqtt.Client("sub")
client.username_pw_set(username="####",password="####")
client.connect("localhost", 1883, 60)
client.on_connect = on_connect
client.on_message = on_message

client.loop_forever()
client.disconnect()

