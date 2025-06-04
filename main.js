const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')

const path = require('node:path')

const { conectar, desconectar } = require("./database.js")

const clientModel = require("./src/models/Clientes.js")

const OSModel = require("./src/models/os.js")

const motoModel = require("./src/models/placamoto.js")

const { jspdf, default: jsPDF } = require('jspdf')

const fs = require('fs')

const prompt = require('electron-prompt')

const mongoose = require('mongoose')

let win
const createWindow = () => {
    nativeTheme.themeSource = 'dark' 
    win = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,

        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')

    ipcMain.on('cliente-window', () => {
        clienteWindow()
    })

    ipcMain.on('placamoto-window', () => {
        placamotoWindow()
    })

    ipcMain.on('os-window', () => {
        osWindow()
    })
}

function aboutWindow() {
    nativeTheme.themeSource = 'light'

    const main = BrowserWindow.getFocusedWindow()

    let about

    if (main) {
        about = new BrowserWindow({
            width: 360,
            height: 220,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            parent: main,
            modal: true
        })
    }
    about.loadFile('./src/views/sobre.html')
}

let client

function clienteWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        client = new BrowserWindow({
            width: 1010,
            height: 720,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    client.loadFile('./src/views/cliente.html')
    client.center()
}

let placamoto

function placamotoWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        placamoto = new BrowserWindow({
            width: 1010,
            height: 560,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    placamoto.loadFile('./src/views/placamoto.html')
    placamoto.center()
}

let os

function osWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        os = new BrowserWindow({
            width: 1010,
            height: 720,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    os.loadFile('./src/views/os.html')
    os.center()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


app.commandLine.appendSwitch('log-level', '3')

ipcMain.on('db-connect', async (event) => {
    let conectado = await conectar()
    if (conectado) {
        setTimeout(() => {
            event.reply('db-status', "conectado")
        }, 500)
    }
})

app.on('before-quit', () => {
    desconectar()
})

const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Cliente',
                click: () => clienteWindow()
            },
            {
                label: 'Modelo e placa da moto',
                click: () => placamotoWindow()
            },
            {
                label: 'OS',
                click: () => osWindow()
            },
            {
                type: 'separator'
            },
            {
                label: 'Sair',
                click: () => app.quit(),
                accelerator: 'Alt+F4'
            }
        ]
    },
    {
        label: 'Relatório',
        submenu: [
            {
                label: 'Clientes',
                click: () => relatorioClientes()
            },
            {
                label: 'OS pendente',
                click: () => relatorioOSPendente()
            },
            {
                label: 'OS concluídas',
                click: () => relatorioOSConcluidas()
            }
        ]
    },
    {
        label: 'Ferramentas',
        submenu: [
            {
                label: 'Aplicar zoom',
                role: 'zoomin'
            },
            {
                label: 'Reduzidir',
                role: 'zoomOut'
            },
            {
                label: 'Ferramentas do desenvolvedor',
                role: 'toggleDevTools'
            },
            {
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]

ipcMain.on('new-client', async (event, client) => {
    try {
        const newClient = new clientModel({
            nomeCliente: client.nameCli,
            cpfCliente: client.cpfCli,
            emailCliente: client.emailCli,
            foneCliente: client.foneCli,
            cepCliente: client.cepCli,
            logradouroCliente: client.logfCli,
            numeroCliente: client.numCli,
            complementoCliente: client.complementoCli,
            bairroCliente: client.bairroCli,
            cidadeCliente: client.cidadeCli,
            ufCliente: client.ufCli
        })
        await newClient.save()

        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Cliente adicionando com sucesso",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            dialog.showMessageBox({
                type: 'error',
                title: "Atenção!",
                message: "CPF já está cadastrado\nverifique se digitou corretamente",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                }
            })
        }
        console.log(error)
    }
})

async function relatorioClientes() {
    try {
        const clientes = await clientModel.find().sort({ nomeCliente: 1 })
        console.log(clientes)

        const doc = new jsPDF('p', 'mm', 'a4')

        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logoMotoRela.jpg')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'JPG', 15, 10) 

        doc.setFontSize(26)

        doc.text("Relatório de clientes", 14, 45)

        const dataAtual = new Date().toLocaleDateString('pt-br')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)
        let y = 60
        doc.text("Nome", 14, y)
        doc.text("Telefone", 80, y)
        doc.text("Email", 130, y)
        y += 5
        doc.setLineWidth(0.5)
        doc.line(10, y, 200, y) 

        y += 10 
        clientes.forEach((c) => {
            if (y > 280) {
                doc.addPage()
                y = 20 
                doc.text("Nome", 14, y)
                doc.text("Telefone", 80, y)
                doc.text("Email", 130, y)
                y += 5
                doc.setLineWidth(0.5)
                doc.line(10, y, 200, y)
                y += 10
            }

            doc.text(c.nomeCliente, 14, y),
                doc.text(c.foneCliente, 80, y),
                doc.text(c.emailCliente || "N/A", 130, y)
            y += 10 

        })

        const paginas = doc.internal.getNumberOfPages()
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(`Páginas ${i} de ${paginas}`, 105, 290, { align: 'center' })
        }

        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'clientes.pdf')

        doc.save(filePath)
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
}

ipcMain.on('new-os', async (event, os) => {
    try {
        const newOs = new OSModel({
            placaOs: os.placaOs,
            valor: os.valorOS,
            marcaOs: os.marcaOs,
            modeloOs: os.modeloOs,
            prazo: os.prazoOS,
            funcioResp: os.funcRespon,
            problemaCliente: os.problemaOS,
            diagTecnico: os.diagOS,
            pecasReparo: os.pecasOS,
            statusDaOS: os.statusOS
        })
        await newOs.save()

        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Os adicionado com sucesso",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }

        })
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('new-moto', async (event, moto) => {
    try {
        const newMoto = new motoModel({
            placaMoto: moto.placaMoto,
            marcaMoto: moto.marcaM,
            modeloMoto: moto.modeloM,
            anoMoto: moto.anoM,
            cor: moto.corM
        })
        await newMoto.save()

        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Moto adicionada com sucesso",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }

        })
    } catch (error) {
        if (error.code === 11000) {
            dialog.showMessageBox({
                type: 'error',
                title: "Atenção!",
                message: "Placa já está cadastrada\nverifique se digitou corretamente",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                }
            })
        }
        console.log(error)
    }
})

ipcMain.on('validate-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: "ATENÇÂO!",
        message: "Preencha o campo de buscas",
        buttons: ["OK"]
    })
})

ipcMain.on('search-name', async (event, name) => {

    try {
        const dataClient = await clientModel.find({
            $or: [
                { nomeCliente: new RegExp(name, 'i') },
                { cpfCliente: new RegExp(name, 'i') }
            ]
        })
        console.log(dataClient)
        if (dataClient.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: "Aviso",
                message: "Cliente não cadastro. \n Deseja cadastrar esse cliente?",
                defaultId: 0,
                buttons: ['SIM', 'NÃO'] 
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('set-client')
                } else {
                    event.reply('reset-form')
                }
            })
        }

        event.reply('render-client', JSON.stringify(dataClient))
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('delete-client', async (event, id) => {
    try {
        const { response } = await dialog.showMessageBox(client, {
            type: 'warning',
            title: "Atenção",
            message: "Deseja excluir este cliente?\nEsta ação não podera ser desfeita.",
            buttons: ['Cancelar', 'Excluir'] 
        })
        if (response === 1) {
            console.log("teste")
            const delClient = await clientModel.findByIdAndDelete(id)
            event.reply('reset-form')
        }
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('update-client', async (event, client) => {

    try {
        const updateClient = await clientModel.findByIdAndUpdate(
            client.idCli,
            {
                nomeCliente: client.nameCli,
                cpfCliente: client.cpfCli,
                emailCliente: client.emailCli,
                foneCliente: client.foneCli,
                cepCliente: client.cepCli,
                logradouroCliente: client.logfCli,
                numeroCliente: client.numCli,
                complementoCliente: client.complementoCli,
                bairroCliente: client.bairroCli,
                cidadeCliente: client.cidadeCli,
                ufCliente: client.ufCli
            },
            {
                new: true
            }
        )

        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Dados do cliente alterados com sucesso",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        });
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('delete-os', async (event, id) => {
    try {
        const { response } = await dialog.showMessageBox(os, {
            type: 'warning',
            title: "Atenção",
            message: "DESEJA EXCLUIR ESTA OS REALMENTE?",
            buttons: ['Cancelar', 'Excluir']
        })
        if (response === 1) {
            const delos = await OSModel.findByIdAndDelete(id)
            event.reply('reset-form')
        }
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('update-os', async (event, os) => {

    try {
        const updateOs = await OSModel.findByIdAndUpdate(
            os.idOS,
            {
                valor: os.valorOS,
                prazo: os.prazoOS,
                funcioResp: os.funcRespOs,
                problemaCliente: os.problemaOS,
                diagTecnico: os.diagOS,
                pecasReparo: os.pecasRepOS,
                statusDaOS: os.statusOS,
                placaOs: os.placaOs,
                marcaOs: os.marcaOs,
                modeloOs: os.modeloOs
            },
            {
                new: true
            }
        )

        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Dados da OS alterados com sucesso",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        });
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('search-os', (event) => {
    prompt({
        title: 'Buscar OS',
        label: 'Digite o número da OS:',
        inputAttrs: {
            type: 'text'
        },
        type: 'input',
        width: 400,
        height: 200
    }).then(async (result) => {
        if (result !== null) {

            if (mongoose.Types.ObjectId.isValid(result)) {
                try {
                    const dateOS = await OSModel.findById(result)
                    if (dateOS) {
                        console.log(dateOS)
                        event.reply('render-os', JSON.stringify(dateOS))
                    } else {
                        dialog.showMessageBox({
                            type: 'warning',
                            title: "Aviso!",
                            message: "OS não encontrada",
                            buttons: ['OK']
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                dialog.showMessageBox({
                    type: 'error',
                    title: "Atenção!",
                    message: "Formato do número da OS inválido.\nVerifique e tente novamente.",
                    buttons: ['OK']
                })
            }
        }
    })
})

ipcMain.on('search-moto', async (event) => {
    try {
        const moto = await motoModel.find().sort({ placaMoto: 1 })
        console.log(moto)
        event.reply('list-moto', JSON.stringify(moto))
    } catch (error) {
        console.log(error)
    }
})

async function relatorioOSPendente() {
    try {

        const relOs = await OSModel.find({ statusDaOS: 'Pendente' }).sort({ prazo: 1 })
        console.log(relOs)

        const doc = new jsPDF('p', 'mm', 'a4')

        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logoMotoRela.jpg')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'PNG', 20, 8) 

        doc.setFontSize(18)

        doc.text("Relatório de Ordem de Serviços Pendentes", 14, 45)

        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)

        let y = 60
        doc.text("Marca", 14, y)
        doc.text("Placa", 70, y)
        doc.text("Prazo de Entrega", 165, y)
        y += 5

        doc.setLineWidth(0.5) 
        doc.line(10, y, 200, y) 

        y += 10 

        relOs.forEach((c) => {

            if (y > 280) {
                doc.addPage()
                y = 20
                doc.text("Marca", 14, y)
                doc.text("Placa", 120, y)
                doc.text("Prazo de Entrega", 165, y)
                y += 5
                doc.setLineWidth(0.5)
                doc.line(10, y, 200, y)
                y += 10
            }

            doc.text(String(c.marcaOs), 14, y)
            doc.text(String(c.placaOs), 70, y)
            doc.text(String(c.prazo), 165, y)
            y += 10
        })

        const paginas = doc.internal.getNumberOfPages()
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(`Página ${i} de ${paginas}`, 105, 290, { align: 'center' })
        }

        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'ordemservico.pdf')

        doc.save(filePath)

        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
}

async function relatorioOSConcluidas() {
    try {

        const relOs = await OSModel.find({ statusDaOS: 'Concluída' }).sort({ prazo: 1 })
        console.log(relOs)

        const doc = new jsPDF('p', 'mm', 'a4')

        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logoMotoRela.jpg')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'PNG', 20, 8) 

        doc.setFontSize(18)

        doc.text("Relatório de Ordem de Serviços Concluídas", 14, 45)

        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)

        let y = 60
        doc.text("Marca", 14, y)
        doc.text("Placa", 70, y)
        doc.text("Prazo de Entrega", 165, y)
        y += 5

        doc.setLineWidth(0.5) 
        doc.line(10, y, 200, y)

        y += 10 

        relOs.forEach((c) => {

            if (y > 280) {
                doc.addPage()
                y = 20
                doc.text("Marca", 14, y)
                doc.text("Placa", 120, y)
                doc.text("Prazo de Entrega", 165, y)
                y += 5
                doc.setLineWidth(0.5)
                doc.line(10, y, 200, y)
                y += 10
            }

            doc.text(String(c.marcaOs), 14, y)
            doc.text(String(c.placaOs), 70, y)
            doc.text(String(c.prazo), 165, y)
            y += 10
        })

        const paginas = doc.internal.getNumberOfPages()
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(`Página ${i} de ${paginas}`, 105, 290, { align: 'center' })
        }

        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'ordemservico.pdf')

        doc.save(filePath)

        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
}

ipcMain.on('print-os', async (event) => {
    prompt({
        title: 'Imprimir OS',
        label: 'Digite o número da OS:',
        inputAttrs: {
            type: 'text'
        },
        type: 'input',
        width: 400,
        height: 200
    }).then(async (result) => {
        if (result !== null) {
            if (mongoose.Types.ObjectId.isValid(result)) {
                try {
                    const dataOS = await OSModel.findById(result)
                    if (dataOS && dataOS !== null) {
                        console.log(dataOS)
                        const dataClient = await motoModel.find({
                            _id: dataOS.idOS
                        })
                        console.log(dataClient)
                        const doc = new jsPDF('p', 'mm', 'a4')
                        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logoMotoRela.jpg')
                        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
                        doc.addImage(imageBase64, 'PNG', 5, 8)
                        doc.setFontSize(18)
                        doc.text("OS:", 14, 45) 
                        doc.setFontSize(12)

                        dataClient.forEach((c) => {
                            doc.text("Cliente:", 14, 65),
                                doc.text(c.marcaOs, 34, 65),
                                doc.text(c.prazo, 85, 65),
                                doc.text(c.valor || "N/A", 130, 65)
                        })

                        doc.text(String(dataOS.prazo), 14, 70)
                        doc.text(String(dataOS.diagTecnico), 60, 70)
                        doc.text(String(dataOS.valor), 150, 70)

                        doc.setFontSize(10)
                        const termo = `
    Termo de Serviço e Garantia
    
    O cliente autoriza a realização dos serviços técnicos descritos nesta ordem, ciente de que:
    
    - Diagnóstico e orçamento são gratuitos apenas se o serviço for aprovado. Caso contrário, poderá ser cobrada taxa de análise.
    - Peças substituídas poderão ser retidas para descarte ou devolvidas mediante solicitação no ato do serviço.
    - A garantia dos serviços prestados é de 90 dias, conforme Art. 26 do Código de Defesa do Consumidor, e cobre exclusivamente o reparo executado ou peça trocada, desde que o equipamento não tenha sido violado por terceiros.
    - Não nos responsabilizamos por dados armazenados. Recomenda-se o backup prévio.
    - Equipamentos não retirados em até 90 dias após a conclusão estarão sujeitos a cobrança de armazenagem ou descarte, conforme Art. 1.275 do Código Civil.
    - O cliente declara estar ciente e de acordo com os termos acima.`

                        doc.text(termo, 14, 150, { maxWidth: 180 }) 

                        const tempDir = app.getPath('temp')
                        const filePath = path.join(tempDir, 'os.pdf')
                        
                        doc.save(filePath)
                        
                        shell.openPath(filePath)
                    } else {
                        dialog.showMessageBox({
                            type: 'warning',
                            title: "Aviso!",
                            message: "OS não encontrada",
                            buttons: ['OK']
                        })
                    }

                } catch (error) {
                    console.log(error)
                }
            } else {
                dialog.showMessageBox({
                    type: 'error',
                    title: "Atenção!",
                    message: "Código da OS inválido.\nVerifique e tente novamente.",
                    buttons: ['OK']
                })
            }
        }
    })
})

async function printOS(osId) {
    try {
        const dataOS = await OSModel.findById(osId)

        const dataClient = await motoModel.find({
            _id: dataOS.idOS
        })
        console.log(dataClient)
        

        
        const doc = new jsPDF('p', 'mm', 'a4')
        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logoMotoRela.jpg')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'PNG', 5, 8)
        doc.setFontSize(18)
        doc.text("OS:", 14, 45) 
        doc.setFontSize(12)

        
        dataClient.forEach((c) => {
            doc.text("Moto:", 14, 65),
                doc.text(c.marcaOs, 34, 65),
                doc.text(c.prazo, 85, 65),
                doc.text(c.valor || "N/A", 130, 65)
            
        })

        
        doc.text(String(dataOS.prazo), 14, 70)
        doc.text(String(dataOS.diagTecnico), 60, 70)
        doc.text(String(dataOS.valor), 150, 70)

        
        doc.setFontSize(10)
        const termo = `
Termo de Serviço e Garantia

O cliente autoriza a realização dos serviços técnicos descritos nesta ordem, ciente de que:

- Diagnóstico e orçamento são gratuitos apenas se o serviço for aprovado. Caso contrário, poderá ser cobrada taxa de análise.
- Peças substituídas poderão ser retidas para descarte ou devolvidas mediante solicitação no ato do serviço.
- A garantia dos serviços prestados é de 90 dias, conforme Art. 26 do Código de Defesa do Consumidor, e cobre exclusivamente o reparo executado ou peça trocada, desde que o equipamento não tenha sido violado por terceiros.
- Não nos responsabilizamos por dados armazenados. Recomenda-se o backup prévio.
- Equipamentos não retirados em até 90 dias após a conclusão estarão sujeitos a cobrança de armazenagem ou descarte, conforme Art. 1.275 do Código Civil.
- O cliente declara estar ciente e de acordo com os termos acima.`

        
        doc.text(termo, 14, 150, { maxWidth: 180 }) 

        
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'os.pdf')
        
        doc.save(filePath)
        
        shell.openPath(filePath)

    } catch (error) {
        console.log(error)
    }
}


