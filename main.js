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
                label: 'OS pendente'
            },
            {
                label: 'OS concluídas',
                click: () => relatorioOsConcluida()
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

//CRUD DELETE ================================================

ipcMain.on('delete-os', async (event, id) => {
    console.log(id)//Teste do passo 2 (recebimento do id)

    try {
        //IMPORTANTE - confirmar a exclusão
        //OS é o nome da variável que representa a janela
        const { response } = await dialog.showMessageBox(os, {
            type: 'warning',
            title: "Atenção",
            message: "Deseja excluir esta OS?\nEsta ação não podera ser desfeita.",
            buttons: ['Cancelar', 'Excluir'] //[0,1]
        })
        if (response === 1) {
            console.log("teste")
            //Passo 3: excluir o resgistro da OS
            const delOs = await OSModel.findByIdAndDelete(id)
            event.reply('reset-form')
        }
    } catch (error) {
        console.log(error)
    }
})

//FIM CRUD DELETE ================================================

// ============================================================
// == Buscar OS ===============================================

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

//Relátorio de OS concluidas ======================================
async function relatorioOsConcluida() {
    try {
        // passo 1: consultar o banco de dados e obter a listagem de clientes cadastrados por ordem alfabética
        const OsConcluida = await OSModel.find().sort({ OSconcluida: "Concluida" })
        //teste de recebimento da listagem de clientes
        console.log(OsConcluida)

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
        doc.text("Relatório de OS concluida", 14, 45)//x, y (mm)

        //Inserir a data atual no relatório
        const dataAtual = new Date().toLocaleDateString('pt-br')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)
        //Variável de apoio na formação
        let y = 60
        doc.text("Placa", 14, y)
        doc.text("Numero da OS", 80, y)
        doc.text("Serviço", 130, y)
        y += 5
        // Desenhar a linha
        doc.setLineWidth(0.5)// espessura da linha
        doc.line(10, y, 200, y) // 10 (Inicio) e 200 (fim)

        //Renderizar os clientes cadastro no banco
        y += 10 //Espaçamento da linha
        //Percorrer o vetor clientes(obtido no banco) usando o laço forEach (equivale a laço for)
        OsConcluida.forEach((c) => {
            //Adicionar outra página se a folha inteira for preenchida (estratágeia da folha)
            // folha a4 y = 270m
            if (y > 280) {
                doc.addPage()
                y = 20 //Resetar a variável y
                //redesenhar o cabeçalho
                doc.text("Placa", 14, y)
                doc.text("Numero da OS", 80, y)
                doc.text("Serviço", 130, y)
                y += 5
                doc.setLineWidth(0.5)// espessura da linha
                doc.line(10, y, 200, y)
                y += 10
            }

            doc.text(c.OSconcluida, 14, y),
                doc.text(c.placaOs, 80, y),
                doc.text(c.problemaOS || "N/A", 130, y)
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
        const filePath = path.join(tempDir, 'os.pdf')

        //Salvar temporariamente o arquivo
        doc.save(filePath)
        //Abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuario
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
}