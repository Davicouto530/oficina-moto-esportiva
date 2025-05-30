/**
 * Arquivo de pré carregamento e reforço de segurança na
 * comunicação entre processos (IPC)
 */

//Importação dos recursos do framework electron 
//contextBridge (segurança) | ipcRenderer (comunicação)
const { contextBridge, ipcRenderer } = require('electron')

// enviar ao main um pedido para conexão com o banco de dados e troca do icone no processo de renderização (index.html - renderer.html)
ipcRenderer.send('db-connect')

//Expor (autorizar a comunicação entre processos)
contextBridge.exposeInMainWorld('api', {
    clientWindow: () => ipcRenderer.send('cliente-window'),
    funcionariosWindow: () => ipcRenderer.send('funcionarios-window'),
    placamotoWindow: () => ipcRenderer.send('placamoto-window'),
    osWindow: () => ipcRenderer.send('os-window'),
    dbStatus: (message) => ipcRenderer.on('db-status', message),
    newClient: (client) => ipcRenderer.send('new-client', client),
    resetForm: (args) => ipcRenderer.on('reset-form', args),
    newOs: (os) => ipcRenderer.send('new-os', os),
    newMoto: (moto) => ipcRenderer.send('new-moto', moto),
    newFuncionario: (func) => ipcRenderer.send('new-funcionario', func),
    searchName: (name) => ipcRenderer.send('search-name', name),
    renderClient: (dataClient) => ipcRenderer.on('render-client', dataClient),
    validateSearch: () => ipcRenderer.send('validate-search'),
    setClient: (args) => ipcRenderer.on('set-client', args),
    deleteClient: (id) => ipcRenderer.send('delete-client', id),
    updateClient: (client) => ipcRenderer.send('update-client', client),
    searchOs: () => ipcRenderer.send('search-os'),
    searchMoto: (moto) => ipcRenderer.send('search-moto', moto),
    listMoto: (moto) => ipcRenderer.on('list-moto', moto),
    renderOS: (dataOS) => ipcRenderer.on('render-os', dataOS),
    deleteOS: (idOS) => ipcRenderer.send('delete-os', idOS),
    updateOS: (os) => ipcRenderer.send('update-os', os),
    printOS: () => ipcRenderer.send('print-os')
})

function dbStatus(message) {
    ipcRenderer.on('db-status', message)
}