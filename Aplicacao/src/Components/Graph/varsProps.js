const colorVarsMap = {
    '': 'silver',
    'temp': 'red',
    'hum': 'green',
    'velocidade': 'purple',
    'bateria': 'orange',
    'interval': 'gray',
}
const defaultColor = {
    get: function(target, prop) {
      return target.hasOwnProperty(prop) ? target[prop] : 'blue';
    }
}
export const colorVars = new Proxy(colorVarsMap, defaultColor);  // Garante q ñ dê undefined caso um device ainda não exista