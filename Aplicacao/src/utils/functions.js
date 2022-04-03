export function getpropsDevice(dadosDevice) {
    return (dadosDevice.length > 0) ? Object.keys(dadosDevice[0]) : []
}

export function getDate(unixTimestamp) {
    const dateObject = new Date(unixTimestamp * 1000)
    const humanDateFormat = dateObject.toLocaleString('pt-BR') //20/04/2021 10:30:15

    return humanDateFormat
}

export function getlatitude(num) {
    const hemis = (num < 0) ? 'S' : (num > 0) ? 'N' : '';
    if (Math.abs(num) > 90)
        return '???';
    else
        return parseFloat(Math.abs(num)).toFixed(3) + '° ' + hemis
}

export function getlongitude(num) {
    const hemis = (num < 0) ? 'O' : (num > 0) ? 'L' : '';
    if (Math.abs(num) > 180)
        return '???';
    else
        return parseFloat(Math.abs(num)).toFixed(3) + '° ' + hemis
}

export function lastTsBeforeOf(hours) {
    const milis = Date.now() - hours*1000*60*60
    return milis/1000
}