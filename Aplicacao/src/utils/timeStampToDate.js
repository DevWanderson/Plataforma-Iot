export function stampToDateAndHour(times) {

    if (times && isNaN(times) !== true) {
        return new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(times * 1000);

    } else {
        return '00/00/00 00:00'
    }

}

export function stampToDate(times) {

    if (times && isNaN(times) !== true) {
        return new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(times * 1000);

    } else {
        return '00/00/00'
    }

}

export function stampToHour(times) {

    if (times && isNaN(times) !== true) {
        return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(times * 1000);

    } else {
        return '00:00'
    }

}

