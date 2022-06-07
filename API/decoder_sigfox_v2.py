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
    def decode(dict_input, type_dict):

        print("#### DECODER SIGFOX ####")
        payload = dict_input["data"]
        payload_bytes = []
        for ii in range(len(payload)):
            if (ii%2):
                var = payload[ii-1] + payload[ii]
                payload_bytes.append(int(var,16))
        #print("len: ", len(payload_bytes), " val: ", payload_bytes)
        ts = int(dict_input["ts"])

        output_dict = {}

        for variable in type_dict["variables"].keys():
            #print(variable)
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
        output_dict["ts"] = ts
        print("#### DECODER DONE ####")
        print (str(output_dict))
        return output_dict
