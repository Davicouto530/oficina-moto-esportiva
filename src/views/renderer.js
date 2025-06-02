function cliente(){
    api.clientWindow()
}

function funcionarios(){
    api.funcionariosWindow()
}

function placamoto(){
    api.placamotoWindow()
}

function os(){
    api.osWindow()
}


api.dbStatus((event, message) => {
    if (message === "conectado") {
        document.getElementById('statusdb').src = "../public/img/dbon.png"
    } else {
        document.getElementById('statusdb').src = "../public/img/dboff.png"
    }
}
)