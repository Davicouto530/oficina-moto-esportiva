console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')

//shell serve para importar pdf

//Esta linha está relacionado ao preload.js
const path = require('node:path')

//Importação dos métodos conectar o e desconecatr (do modulo de conexão)
const { conectar, desconectar } = require("./database.js")

//Importação do schema cliente conectar e desconectar (módulo de conexão)
const clientModel = require("./src/models/Clientes.js")

//Importação do pacote jspdf (npm i jspdf)
const { jspdf, default: jsPDF} = require('jspdf')

//importação de biblioteca fs (nativa do js) para manipulação de dados
const fs = require('fs')

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

    ipcMain.on ('cliente-window', () => {
        clienteWindow()
    })

    ipcMain.on ('funcionarios-window', () => {
        funcionariosWindow()
    })

    ipcMain.on ('placamoto-window', () => {
        placamotoWindow()
    })

    ipcMain.on ('os-window', () => {
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

function clienteWindow(){
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if(main){
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

function funcionariosWindow(){
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if(main){
        funcionarios = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            parent: main,
            modal: true
        })
    }
    funcionarios.loadFile('./src/views/funcionarios.html')
    funcionarios.center()
}

//Janela funcionarios
let placamoto

function placamotoWindow(){
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if(main){
        placamoto = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            parent: main,
            modal: true
        })
    }
    placamoto.loadFile('./src/views/placamoto.html')
    placamoto.center()
}

//Janela os
let os

function osWindow(){
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if(main){
        os = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            parent: main,
            modal: true
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
        label: 'Pagamentos',
        submenu: [
            {
                label: 'Registrar pagamento'

            },
            {
                label: 'Histórico de pagamentos'
            }
        ]
    },
    {
        label: 'Relatório',
        submenu: [
            {
                label: 'Clientes',
                click:() => relatorioClientes()
            }
        ]
    },
    {
        label: 'Serviços',
        submenu: [
            {
                label: 'Lista de serviços oferecidos'
            },
            {
                label: 'Estatísticas sobre os serviços mais realizados'
            },
            {
                label: 'OS'
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
    try{
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
            if(result.response === 0){
                //Enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rotulo preload)
                event.reply('reset-form')
            }
        });
    }catch (error){
        // Se o código de erro for 11000 (cpf duplicado) enviar uma mensagem ao usuario 
        if(error.code === 11000){
            dialog.showMessageBox({
                type: 'error',
                title: "Atenção!",
                message: "CPF já está cadastrado\nverifique se digitou corretamente",
                buttons: ['OK']
            }).then((result) => {
                if(result.response === 0){
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
    try{
        // passo 1: consultar o banco de dados e obter a listagem de clientes cadastrados por ordem alfabética
        const clientes = await clientModel.find().sort({nomeCliente: 1})
        //teste de recebimento da listagem de clientes
        // console.log(clientes)

        //Passo 2: formatação do documento
        //p - portrait | 1 - landscape | mm e a4 (folha)
        const doc = new jsPDF('p', 'mm', 'a4')
        //definir o tamanho da fonte
        doc.setFontSize(26)
        //Escrevendo um texto (título)
        doc.text("Relatório de clientes", 14, 20)//x, y (mm)

        //Inserir a data atual no relatório
        const dataAtual = new Date().toLocaleDateString('pt-br')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)
        //Variável de apoio na formação
        let y = 45
        doc.text("Nome", 14, y)
        doc.text("Telefone", 80, y)
        doc.text("Email", 130, y)
        y += 5
        // Desenhar a linha
        doc.setLineWidth(0.5)// espessura da linha
        doc.line(10,y, 200, y) // 10 (Inicio) e 200 (fim)
        
        //Definir o caminho do arquivo temporário
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir,'clientes.pdf')

        //Salvar temporariamente o arquivo
        doc.save(filePath)
        //Abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuario
        shell.openPath(filePath)
    }catch(error){
        console.log(error)
    }
}