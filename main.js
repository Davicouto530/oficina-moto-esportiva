console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu } = require('electron')

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
    })

    //Menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')
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

//Iniciar aplicativo
app.whenReady().then(() => {
    createWindow()
})

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

//Templete do menu
const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Cliente'
            },
            {
                label: 'Funcionario'
            },
            {
                label: 'Modelo e placa da moto'
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
                label: 'Clientes'
            },
            {
                type: 'separator'
            },
            {
                label: 'Orçamento'
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