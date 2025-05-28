console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')

//shell serve para importar pdf

//Esta linha está relacionado ao preload.js
const path = require('node:path')

//Importação dos métodos conectar o e desconecatr (do modulo de conexão)
const { conectar, desconectar } = require("./database.js")

//Importação do schema cliente conectar e desconectar (módulo de conexão)
const clientModel = require("./src/models/Clientes.js")

//Importação do modelo de dados do os
const OSModel = require("./src/models/os.js")

//Importação do modelo de dados do moto
const motoModel = require("./src/models/placamoto.js")

const funcModel = require("./src/models/funcionario.js")

//Importação do pacote jspdf (npm i jspdf)
const { jspdf, default: jsPDF } = require('jspdf')

//importação de biblioteca fs (nativa do js) para manipulação de dados
const fs = require('fs')

//Importação do recurso 'electron-prompt' (dialog de input)
//!º Instalar o recurso: npm i 'electron-prompt'
const prompt = require('electron-prompt')

//Importação do mongoose
const mongoose = require('mongoose')

//Janela principal
let win
const createWindow = () => {
    //A linha abaixo define o tema (claro ou escuro)
    nativeTheme.themeSource = 'dark' //Duas opções para deixar a tela (escuro(dark) / claro(light))
    win = new BrowserWindow({
        width: 800,
        height: 600,
        // autoHideMenuBar: true,
        // minimizabl: false,
        resizable: false,

        //Ativação do preload.js
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    //Menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')

    ipcMain.on('cliente-window', () => {
        clienteWindow()
    })

    ipcMain.on('funcionarios-window', () => {
        funcionariosWindow()
    })

    ipcMain.on('placamoto-window', () => {
        placamotoWindow()
    })

    ipcMain.on('os-window', () => {
        osWindow()
    })
}

//Janela sobre
function aboutWindow() {
    nativeTheme.themeSource = 'light'

    //A linha abaixo obtem a janela principal
    const main = BrowserWindow.getFocusedWindow()

    let about

    //Estabelecer uma relação hierarquica sobre janela
    if (main) {
        //Criar a janela sobre
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
    //Carreegar o documento HTML na janela
    about.loadFile('./src/views/sobre.html')
}

//Janela clientes
let client

function clienteWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        client = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            parent: main,
            modal: true,
            //Ativação do preload.js
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    client.loadFile('./src/views/cliente.html')
    client.center()//centralizar a tela
}

//Janela funcionarios
let funcionarios

function funcionariosWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        funcionarios = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            parent: main,
            modal: true,
            //Ativação do preload.js
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    funcionarios.loadFile('./src/views/funcionarios.html')
    funcionarios.center()
}

//Janela funcionarios
let placamoto

function placamotoWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        placamoto = new BrowserWindow({
            width: 1010,
            height: 560,
            //autoHideMenuBar: true,
            parent: main,
            modal: true,
            //Ativação do preload.js
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    placamoto.loadFile('./src/views/placamoto.html')
    placamoto.center()
}

//Janela os
let os

function osWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        os = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            parent: main,
            modal: true,
            //Ativação do preload.js
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    os.loadFile('./src/views/os.html')
    os.center()
}

//Iniciar aplicativo
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

//Reduzir logs não criticos
app.commandLine.appendSwitch('log-level', '3')

// iniciar a conexão com o banco de dados (pedido direto do preload.js)
ipcMain.on('db-connect', async (event) => {
    let conectado = await conectar()
    // se conectado for igual a true
    if (conectado) {
        // enviar uma mensagem para o renderizador trocar o ícone
        setTimeout(() => {
            event.reply('db-status', "conectado")
        }, 500)
    }
})

// IMPORTANTE! Desconectar do banco de dados quando a aplicação for encerrada
app.on('before-quit', () => {
    desconectar()
})

//Templete do menu
const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Cliente',
                click: () => clienteWindow()
            },
            {
                label: 'Funcionario',
                click: () => funcionariosWindow()
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
                label: 'Histórico de serviços'
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
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            },
            {
                type: 'separator'
            },
            {
                label: 'Recarregar',
                role: 'reload'
            },
            {
                label: 'Ferramenta do desenvolvedor',
                role: 'toggleDevTools'
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

// ===========================================================
//Clientes - CRUD CREATE

// Recebimento do objeto que contem os dados do cliente 
ipcMain.on('new-client', async (event, client) => {
    //Importante! Teste de recebimento dos dados do cliente
    console.log(client)
    // Cadastrar a  estrtura de dados no banco de dados no mongodb
    try {
        //Criar uma nova estrutura de dados usando a classe modelo
        //Atenção! OS atributos precisam ser identicos ao modelo de dados clientes.js
        //e os valores são definidos pelo conteúdo ao objeto client
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
        //Salvar os dados dos clientes no banco de dados
        await newClient.save()

        //Messagem de confirmação
        dialog.showMessageBox({
            //Customização
            type: 'info',
            title: "Aviso",
            message: "Cliente adicionando com sucesso",
            buttons: ['OK']
        }).then((result) => {
            //Ação ao pressionar o botão
            if (result.response === 0) {
                //Enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rotulo preload)
                event.reply('reset-form')
            }
        });
    } catch (error) {
        // Se o código de erro for 11000 (cpf duplicado) enviar uma mensagem ao usuario 
        if (error.code === 11000) {
            dialog.showMessageBox({
                type: 'error',
                title: "Atenção!",
                message: "CPF já está cadastrado\nverifique se digitou corretamente",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    //Limpar a caixa de input do cpf, focar essa caixa e deixar a borda em vermelho
                }
            })
        }
        console.log(error)
    }
})

//Fim - Clientes - CRUD CREATE==============================

//Relátorio de clientes ======================================
async function relatorioClientes() {
    try {
        // passo 1: consultar o banco de dados e obter a listagem de clientes cadastrados por ordem alfabética
        const clientes = await clientModel.find().sort({ nomeCliente: 1 })
        //teste de recebimento da listagem de clientes
        console.log(clientes)

        //Passo 2: formatação do documento
        //p - portrait | 1 - landscape | mm e a4 (folha a4 (210x279m))
        const doc = new jsPDF('p', 'mm', 'a4')

        //Inserir imagens no documento PDF
        // imagePath (caminho da imagem que será inserida no PDF)
        // imageBase64 (Uso da biblioteca fs para ler o arquivo no formato png)
        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logoMotoRela.jpg')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'JPG', 15, 10) //5mm, 8mm

        //definir o tamanho da fonte
        doc.setFontSize(26)
        //Escrevendo um texto (título)
        doc.text("Relatório de clientes", 14, 45)//x, y (mm)

        //Inserir a data atual no relatório
        const dataAtual = new Date().toLocaleDateString('pt-br')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)
        //Variável de apoio na formação
        let y = 60
        doc.text("Nome", 14, y)
        doc.text("Telefone", 80, y)
        doc.text("Email", 130, y)
        y += 5
        // Desenhar a linha
        doc.setLineWidth(0.5)// espessura da linha
        doc.line(10, y, 200, y) // 10 (Inicio) e 200 (fim)

        //Renderizar os clientes cadastro no banco
        y += 10 //Espaçamento da linha
        //Percorrer o vetor clientes(obtido no banco) usando o laço forEach (equivale a laço for)
        clientes.forEach((c) => {
            //Adicionar outra página se a folha inteira for preenchida (estratágeia da folha)
            // folha a4 y = 270m
            if (y > 280) {
                doc.addPage()
                y = 20 //Resetar a variável y
                //redesenhar o cabeçalho
                doc.text("Nome", 14, y)
                doc.text("Telefone", 80, y)
                doc.text("Email", 130, y)
                y += 5
                doc.setLineWidth(0.5)// espessura da linha
                doc.line(10, y, 200, y)
                y += 10
            }

            doc.text(c.nomeCliente, 14, y),
                doc.text(c.foneCliente, 80, y),
                doc.text(c.emailCliente || "N/A", 130, y)
            y += 10 //Quebra de linha

        })

        //Adicionar numeração automática de páginas
        const paginas = doc.internal.getNumberOfPages()
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(`Páginas ${i} de ${paginas}`, 105, 290, { align: 'center' })
        }

        //Definir o caminho do arquivo temporário
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'clientes.pdf')

        //Salvar temporariamente o arquivo
        doc.save(filePath)
        //Abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuario
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
}

//Create OS=====================================

// CRUD Os

ipcMain.on('new-os', async (event, os) => {
    console.log(os)
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


//Create Cadastro Moto=====================================

// CRUD Moto

ipcMain.on('new-moto', async (event, moto) => {
    console.log(moto)
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
                    //Limpar a caixa de input do cpf, focar essa caixa e deixar a borda em vermelho
                }
            })
        }
        console.log(error)
    }
})

//Create Cadastro Funcionario=====================================

// CRUD Funcionario

ipcMain.on('new-funcionario', async (event, func) => {
    console.log(func)
    try {
        const newFuncionario = new funcModel({
            nomeFun: func.nomeF,
            cpfFun: func.cpfF,
            emailFun: func.emailF,
            foneFun: func.foneF,
            cepFun: func.cepF,
            cargoFun: func.cargoF,
            horaFun: func.horaF,
            salarioFun: func.salarioF
        })
        await newFuncionario.save()

        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Funcionario adicionado com sucesso",
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

//Crud Read ======================================================

//Validação de busca (preenchimento obrigatoria)
ipcMain.on('validate-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: "ATENÇÂO!",
        message: "Preencha o campo de buscas",
        buttons: ["OK"]
    })
})

ipcMain.on('search-name', async (event, name) => {
    console.log("teste IPC search-name")

    //Passo 3 e 4: Busca dos dados do cliente no banco

    //find({nomeCliente: name}) - busca pelo nome
    //RegExp(name, i) - i (insensitive / Ignorar maiúsculo ou minúsculo)
    try {
        const dataClient = await clientModel.find({
            $or: [
                { nomeCliente: new RegExp(name, 'i') },
                { cpfCliente: new RegExp(name, 'i') }
            ]
        })
        console.log(dataClient)//Teste do pásso 3 e 4

        //Melhoria de experiência do usuário (se o cliente não estiver cadastrado, alertar o usuário e questionar se ele quer capturar este cliente, se não quiser cadastrar, limpar os campos, se quiser cadastrar recortar o nome do cliente ou o cpf do campo de busca e colar no campo nome ou cpf).
        //Se o vetor estiver vazio [] (cliente não cadastrado)
        if (dataClient.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: "Aviso",
                message: "Cliente não cadastro. \n Deseja cadastrar esse cliente?",
                defaultId: 0,
                buttons: ['SIM', 'NÃO'] // [0, 1]
            }).then((result) => {
                if (result.response === 0) {
                    //Enviar ao renderizador um pedido para setar os campos (recortar do campo de busca e colar no campo nome)
                    event.reply('set-client')
                } else {
                    //Limpar formulário
                    event.reply('reset-form')
                }
            })
        }

        //Passo 5: 
        //Enviando os dados do cliente ao rendererCliente
        //OBS: ipc só trabalha com string, então é necessario converter o JSON para JSON.stringify(dataClient)
        event.reply('render-client', JSON.stringify(dataClient))
    } catch (error) {
        console.log(error)
    }
})

//Fim Crud Read ======================================================

//CRUD DELETE ================================================

ipcMain.on('delete-client', async (event, id) => {
    console.log(id)//Teste do passo 2 (recebimento do id)

    try {
        //IMPORTANTE - confirmar a exclusão
        //Client é o nome da variável que representa a janela
        const { response } = await dialog.showMessageBox(client, {
            type: 'warning',
            title: "Atenção",
            message: "Deseja excluir este cliente?\nEsta ação não podera ser desfeita.",
            buttons: ['Cancelar', 'Excluir'] //[0,1]
        })
        if (response === 1) {
            console.log("teste")
            //Passo 3: excluir o resgistro do cliente
            const delClient = await clientModel.findByIdAndDelete(id)
            event.reply('reset-form')
        }
    } catch (error) {
        console.log(error)
    }
})

//FIM CRUD DELETE ================================================

//Crud UPDATE ====================================================

ipcMain.on('update-client', async (event, client) => {
    console.log(client)//Teste importante do recebimento dos dados do cliente

    try {
        //Criar uma nova estrutura de dados usando a classe modelo
        //Atenção! OS atributos precisam ser identicos ao modelo de dados clientes.js
        //e os valores são definidos pelo conteúdo ao objeto client
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

        //Messagem de confirmação
        dialog.showMessageBox({
            //Customização
            type: 'info',
            title: "Aviso",
            message: "Dados do cliente alterados com sucesso",
            buttons: ['OK']
        }).then((result) => {
            //Ação ao pressionar o botão
            if (result.response === 0) {
                //Enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rotulo preload)
                event.reply('reset-form')
            }
        });
    } catch (error) {
        console.log(error)
    }
})

//FIM Crud UPDATE ====================================================

// ============================================================
// == Excluir OS - CRUD Delete  ===============================

ipcMain.on('delete-os', async (event, id) => {
    console.log("TESTE")
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

// == Fim Excluir OS - CRUD Delete ============================
// ============================================================

//Crud UPDATE OS ====================================================

ipcMain.on('update-os', async (event, os) => {
    console.log(os)//Teste importante do recebimento dos dados do cliente

    try {
        //Criar uma nova estrutura de dados usando a classe modelo
        //Atenção! OS atributos precisam ser identicos ao modelo de dados clientes.js
        //e os valores são definidos pelo conteúdo ao objeto client
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

        //Messagem de confirmação
        dialog.showMessageBox({
            //Customização
            type: 'info',
            title: "Aviso",
            message: "Dados da OS alterados com sucesso",
            buttons: ['OK']
        }).then((result) => {
            //Ação ao pressionar o botão
            if (result.response === 0) {
                //Enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rotulo preload)
                event.reply('reset-form')
            }
        });
    } catch (error) {
        console.log(error)
    }
})

//FIM Crud UPDATE OS ====================================================

//=============================================== Buscar OS========================================
ipcMain.on('search-os', (event) => {
    //console.log("teste: busca OS")
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

            //buscar a os no banco pesquisando pelo valor do result (número da OS)
            if (mongoose.Types.ObjectId.isValid(result)) {
                try {
                    const dateOS = await OSModel.findById(result)
                    if (dateOS) {
                        console.log(dateOS) // teste importante
                        // enviando os dados da OS ao rendererOS
                        // OBS: IPC só trabalha com string, então é necessário converter o JSON para string JSON.stringify(dateOS)
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

// == Fim - Buscar OS =========================================
// ============================================================

//Buscar cliente para vincular na os - estilo google======================================
ipcMain.on('search-moto', async (event) => {
    try {
        //Buscar no banco os placa em ordem alfabética
        const moto = await motoModel.find().sort({ placaMoto: 1 })
        console.log(moto)//Teste do passo 2

        //Passo 3: envio das placa para o renderizador
        event.reply('list-moto', JSON.stringify(moto))
    } catch (error) {
        console.log(error)
    }
})
//FIM Buscar cliente para vincular na os======================================

//==================== RELATORIO OS ==============================/

async function relatorioOSPendente() {
    try {

        const relOs = await OSModel.find({ statusDaOS: 'Pendente' }).sort({ prazo: 1 })
        console.log(relOs)

        const doc = new jsPDF('p', 'mm', 'a4')

        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logoMotoRela.jpg')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'PNG', 20, 8) //(5mm, 8mm x,y)

        doc.setFontSize(18)

        doc.text("Relatório de Ordem de Serviços Pendentes", 14, 45)//x,y (mm) 

        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)

        let y = 60
        doc.text("Marca", 14, y)
        doc.text("Placa", 70, y)
        doc.text("Prazo de Entrega", 165, y)
        y += 5

        doc.setLineWidth(0.5) // expessura da linha
        doc.line(10, y, 200, y) // inicio e fim

        y += 10 // espaçãmento da linha

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
        doc.addImage(imageBase64, 'PNG', 20, 8) //(5mm, 8mm x,y)

        doc.setFontSize(18)

        doc.text("Relatório de Ordem de Serviços Concluídas", 14, 45)//x,y (mm) 

        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)

        let y = 60
        doc.text("Marca", 14, y)
        doc.text("Placa", 70, y)
        doc.text("Prazo de Entrega", 165, y)
        y += 5

        doc.setLineWidth(0.5) // expessura da linha
        doc.line(10, y, 200, y) // inicio e fim

        y += 10 // espaçãmento da linha

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

//FIM RELATORIO OS ================================

// IMPRIMIR OS =====================================================

// ipcMain.on('print-os', (event) => {
//     //console.log("teste: busca OS")
//     prompt({
//         title: 'Imprimir OS',
//         label: 'Digite o número da OS:',
//         inputAttrs: {
//             type: 'text'
//         },
//         type: 'input',
//         width: 400,
//         height: 200
//     }).then(async (result) => {
//         if (result !== null) {

//             //buscar a os no banco pesquisando pelo valor do result (número da OS)
//             if (mongoose.Types.ObjectId.isValid(result)) {
//                 try {
//                     // teste importante
//                     // console.log("imprimir os")

//                     const dateOS = await OSModel.findById(result)
//                     if (dateOS) {
//                         console.log(dateOS) // teste importante
//                         // enviando os dados da OS ao rendererOS
//                         // console.log(dateOS.placaOs)
//                         // const moto = await motoModel.find("JEN-2066")
//                         // console.log(moto)

//                         // impressão (documento PDF) com os dados da OS da moto e termos do serviço (uso de jspdf)
//                     } else {
//                         dialog.showMessageBox({
//                             type: 'warning',
//                             title: "Aviso!",
//                             message: "OS não encontrada",
//                             buttons: ['OK']
//                         })
//                     }
//                 } catch (error) {
//                     console.log(error)
//                 }
//             } else {
//                 dialog.showMessageBox({
//                     type: 'error',
//                     title: "Atenção!",
//                     message: "Formato do número da OS inválido.\nVerifique e tente novamente.",
//                     buttons: ['OK']
//                 })
//             }
//         }
//     })
// })

//===============================================================================

// ============================================================
// Impressão de OS ============================================

// impressão via botão imprimir
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
        // buscar OS pelo id (verificar formato usando o mongoose - importar no início do main)
        if (result !== null) {
            // Verificar se o ID é válido (uso do mongoose - não esquecer de importar)
            if (mongoose.Types.ObjectId.isValid(result)) {
                try {
                    // teste do botão imprimir
                    //console.log("imprimir OS")
                    const dataOS = await OSModel.findById(result)
                    if (dataOS && dataOS !== null) {
                        console.log(dataOS) // teste importante
                        // extrair os dados do cliente de acordo com o idCliente vinculado a OS
                        const dataClient = await motoModel.find({
                            _id: dataOS.idOS
                        })
                        console.log(dataClient)
                        // impressão (documento PDF) com os dados da OS, do cliente e termos do serviço (uso do jspdf)

                        // formatação do documento pdf
                        const doc = new jsPDF('p', 'mm', 'a4')
                        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logoMotoRela.jpg')
                        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
                        doc.addImage(imageBase64, 'PNG', 5, 8)
                        doc.setFontSize(18)
                        doc.text("OS:", 14, 45) //x=14, y=45
                        doc.setFontSize(12)

                        // Extração dos dados do cliente vinculado a OS
                        dataClient.forEach((c) => {
                            doc.text("Cliente:", 14, 65),
                                doc.text(c.marcaOs, 34, 65),
                                doc.text(c.prazo, 85, 65),
                                doc.text(c.placaOs || "N/A", 130, 65)
                            //...
                        })

                        // Extração dos dados da OS                        
                        doc.text(String(dataOS.problemaCliente), 14, 85)
                        doc.text(String(dataOS.diagTecnico), 80, 85)

                        // Texto do termo de serviço
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

                        // Inserir o termo no PDF
                        doc.text(termo, 14, 150, { maxWidth: 180 }) // x=14, y=60, largura máxima para quebrar o texto automaticamente

                        // Definir o caminho do arquivo temporário e nome do arquivo
                        const tempDir = app.getPath('temp')
                        const filePath = path.join(tempDir, 'os.pdf')
                        // salvar temporariamente o arquivo
                        doc.save(filePath)
                        // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
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
        // impressão (documento PDF) com os dados da OS, do cliente e termos do serviço (uso do jspdf)

        // formatação do documento pdf
        const doc = new jsPDF('p', 'mm', 'a4')
        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logoMotoRela.jpg')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'PNG', 5, 8)
        doc.setFontSize(18)
        doc.text("OS:", 14, 45) //x=14, y=45
        doc.setFontSize(12)

        // Extração dos dados do cliente vinculado a OS
        dataClient.forEach((c) => {
            doc.text("Moto:", 14, 65),
                doc.text(c.marcaOs, 34, 65),
                doc.text(c.prazo, 85, 65),
                doc.text(c.placaOs || "N/A", 130, 65)
            //...
        })

        // Extração dos dados da OS                        
        doc.text(String(dataOS.problemaCliente), 14, 85)
        doc.text(String(dataOS.diagTecnico), 80, 85)

        // Texto do termo de serviço
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

        // Inserir o termo no PDF
        doc.text(termo, 14, 150, { maxWidth: 180 }) // x=14, y=60, largura máxima para quebrar o texto automaticamente

        // Definir o caminho do arquivo temporário e nome do arquivo
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'os.pdf')
        // salvar temporariamente o arquivo
        doc.save(filePath)
        // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
        shell.openPath(filePath)

    } catch (error) {
        console.log(error)
    }
}

// Fim - Impressão de OS ======================================
// ============================================================