export const ATUALIZAR_DEVICES = "ATUALIZAR_DEVICES";

export const atualizarDevices = evento => ({
    type: ATUALIZAR_DEVICES,
    payload: evento
})

export const SELECT_DEVICE = "SELECT_DEVICE";

export const selecionarDevice = evento => ({
    type: SELECT_DEVICE,
    payload: evento
})

export const DADOS_TYPE = "DADOS_TYPE";

export const dadosType = evento => ({
    type: DADOS_TYPE,
    payload: evento
})

export const DADOS_DEVICE = "DADOS_DEVICE";

export const dadosDevice = evento => ({
    type: DADOS_DEVICE,
    payload: evento
})

export const STATUS_LOAD = "STATUS_LOAD";

export const statusLoad = evento => ({
    type: STATUS_LOAD,
    payload: evento
})

export const USER = "USER";

export const userLogado  = event => ({
    type: USER,
    payload: event
})