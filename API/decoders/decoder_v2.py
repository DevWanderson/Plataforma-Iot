import json
import base64
from datetime import datetime

def operation(value1, value2, opt):
                if ("sum" in opt):
                    return value1 + value2
                elif ("mux" in opt):
                    return value1 * value2
                elif ("div" in opt):
                    return value1 / value2
                elif ("mask" in opt):
                    return value1 & value2
                elif ("shiftright" in opt):
                    return value1 >> value2
                elif ("shiftleft" in opt):
                    return value1 << value2

class Decode:
    
    def decode(payload_json_input, type_dict):

        print("#### DECODER ####")
        payload_json_full = json.loads(payload_json_input)
        #payload_json_full = payload_json_input
        payload = payload_json_full["params"]["payload"]
        payload_bytes = (base64.b64decode(payload))
        ts = payload_json_full["meta"]["time"]
        print(type_dict)

        output_dict = {}

        for variable in type_dict["variables"].keys():
            print(variable)
            byte_min = type_dict["variables"][variable]["bytes"][0]
            byte_max = type_dict["variables"][variable]["bytes"][1]
            is_signed = type_dict["variables"][variable]["signed"]
            order = type_dict["order"]
            var = int.from_bytes(payload_bytes[byte_min:byte_max + 1], byteorder = order, signed = is_signed)
            if ('if_comp' in type_dict["variables"][variable].keys()):
                if ("and" in type_dict["variables"][variable]['if_comp']):
                    if (var & int(type_dict["variables"][variable]['if_arg'])):
                        var = operation(var, int(type_dict["variables"][variable]['arg_do']), type_dict["variables"][variable]['if_do'])
                    else:
                        var = operation(var, int(type_dict["variables"][variable]['arg_else']), type_dict["variables"][variable]['else'])
                elif ("or" in type_dict["variables"][variable]['if_comp']):
                    if (var & int(type_dict["variables"][variable]['if_arg'])):
                        var = operation(var, int(type_dict["variables"][variable]['arg_do']), type_dict["variables"][variable]['if_do'])
                    else:
                        var = operation(var, int(type_dict["variables"][variable]['arg_else']), type_dict["variables"][variable]['else'])
                elif ("lt" in type_dict["variables"][variable]['if_comp']):
                    if (var & int(type_dict["variables"][variable]['if_arg'])):
                        var = operation(var, int(type_dict["variables"][variable]['arg_do']), type_dict["variables"][variable]['if_do'])
                    else:
                        var = operation(var, int(type_dict["variables"][variable]['arg_else']), type_dict["variables"][variable]['else'])
                elif ("gt" in type_dict["variables"][variable]['if_comp']):
                    if (var & int(type_dict["variables"][variable]['if_arg'])):
                        var = operation(var, int(type_dict["variables"][variable]['arg_do']), type_dict["variables"][variable]['if_do'])
                    else:
                        var = operation(var, int(type_dict["variables"][variable]['arg_else']), type_dict["variables"][variable]['else'])
            if ("operations" in type_dict["variables"][variable].keys()):
                for op in range(len(type_dict["variables"][variable]['operations'])):
                    var = operation(var, int(type_dict["variables"][variable]['op_args'][op]), type_dict["variables"][variable]['operations'][op])
                    if (op == len(type_dict["variables"][variable]['operations']) - 1):
                            output_dict[variable] = var
        output_dict["ts"] = int(ts)
        print("#### DECODER DONE ####")
        print (str(output_dict))
        return output_dict

""""

dict = {
    "name": "winext_gps",

    "variables": {
        "moving": {
            "bytes" : [1, 1],
            "signed" : False,
            "if_comp" : "gt",
            "if_arg" : 0,
            "if_do" : "sum",
            "arg_do" : 0,
            "else" : "mux",
            "arg_else" : 1,
            "operations" : ["sum"],
            "op_args": [0]
        },
        "charging": {
            "bytes" : [2, 2],
            "signed" : False
        },
        "lowvoltage": {
            "bytes" : [3, 3],
            "signed" : False,
            "operations" : ["mask", "shiftright"],
            "op_args": [128, 7]
        },
        "bateria": {
            "bytes" : [3, 3],
            "signed" : False,
            "operations" : ["mask", "div"],
            "op_args": [127, 10]
        },
        "lat": {
            "bytes" : [4, 6],
            "signed" : True,
            "operations" : ["div", "mux"],
            "op_args": [8388607, 90]
        },
        "long": {
            "bytes" : [7, 9],
            "signed" : True,
            "operations" : ["div", "mux"],
            "op_args": [8388607, 180]
        }
    },
    "size": 10,
    "order": "big",
    "global": True
}

payload_json_full = {}
payload_json_full["params"] = {}
payload_json_full["meta"] = {}
payload_json_full["params"]["payload"] = "AQAAI+llR93KRw==" #"AQAAKOmntN3uFg=="
payload_json_full["meta"]["time"] = 1626872661

Decode.decode(payload_json_full, dict)
"""

