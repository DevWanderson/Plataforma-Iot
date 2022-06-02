import base64
payload = "AYllhgIA//93" #payload dispositivo temperatura / umidade RisingHF
payload_bytes = base64.b64decode(payload)
temp = int.from_bytes(payload_bytes[2:4], byteorder = "big") #junção de bytes referentes à temperatura do array de payload decodificado
print(temp)
#operações descritas no datasheet do dispositivo para obtenção do valor de temperatura
temp = 25993
temp *= 175.72
temp /= 65536
temp -= 46.85
print(temp)