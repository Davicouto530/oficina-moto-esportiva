const foco = document.getElementById('inputSearchOs');

document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true;
    btnDelete.disabled = true;
    btnCreate.disabled = false;
    
    foco.focus();
});

let arrayOs = []

let frmOS = document.getElementById("frmOS");
let placaOs = document.getElementById("inputPlacaOs");
let modeloOs = document.getElementById('inputModeloOs')
let marcaOs = document.getElementById('inputMarcaOs');
let valorOS = document.getElementById("inputValorOS");
let prazoOS = document.getElementById("inputPrazoOS");
let funcRespOs = document.getElementById("inputFuncRespOS");
let problemaOS = document.getElementById("inputProblemaOS");
let diagOS = document.getElementById("inputDiagnosticoOS");
let pecasRepOS = document.getElementById("inputPecasRepOS");
let statusOS = document.getElementById("inputStatusOS");

let dateOS = document.getElementById('inputData');
let idOS = document.getElementById("inputNumOs");


frmOS.addEventListener('submit', async (event) => {
    
    event.preventDefault()

    if (idOS.value === "") {
        
        const os = {
            idOS: idOS.value,
            placaOs: placaOs.value,
            marcaOs: marcaOs.value,
            modeloOs: modeloOs.value,
            valorOS: valorOS.value,
            prazoOS: prazoOS.value,
            funcRespon: funcRespOs.value,
            problemaOS: problemaOS.value,
            diagOS: diagOS.value,
            pecasOS: pecasRepOS.value,
            statusOS: statusOS.value
        }
        
        api.newOs(os)
    } else {
        const os = {
            idOS: idOS.value,
            placaOs: placaOs.value,
            marcaOs: marcaOs.value,
            modeloOs: modeloOs.value,
            valorOS: valorOS.value,
            prazoOS: prazoOS.value,
            funcRespOs: funcRespOs.value,
            problemaOS: problemaOS.value,
            diagOS: diagOS.value,
            pecasRepOS: pecasRepOS.value,
            statusOS: statusOS.value
        }
        
        api.updateOS(os)
    }
})

function resetForm() {
    location.reload() 
}

api.resetForm((args) => {
    resetForm()
})

const input = document.getElementById("inputSearchOs")

const suggestionList = document.getElementById("viewListSuggestion")

let idOs = document.getElementById("inputIdOs")
let inputPlacaOs = document.getElementById("inputPlacaOs")
let placaMoto = document.getElementById("inputPlacaMoto")

let arrayPlaca = []

input.addEventListener('input', () => {
    
    const search = input.value.toLowerCase()
    
    api.searchMoto()

    api.listMoto((event, moto) => {
        
        const dataMoto = JSON.parse(moto)

        arrayPlaca = dataMoto
        
        const results = arrayPlaca.filter(c =>
            c.placaMoto && c.placaMoto.toLowerCase().includes(search)
        ).slice(0, 10) 
        
        suggestionList.innerHTML = ""

        results.forEach(c => {
            
            const item = document.createElement('li')
            
            item.classList.add('list-group-item', 'list-group-item-action')
            
            item.textContent = c.placaMoto
            
            suggestionList.appendChild(item)

            item.addEventListener("click", () => {
                idOs.value = c._id;
                inputPlacaOs.value = c.placaMoto;
                marcaOs.value = c.marcaMoto;
                modeloOs.value = c.modeloMoto;

                suggestionList.innerHTML = "";

            });
        })
    })
})

document.addEventListener("click", (event) => {
    if (!input.contains(event.target) && !suggestionList.contains(event.target)) {
        suggestionList.innerHTML = ""
    }
})

function inputOs() {
    api.searchOs()
}

api.renderOS((event, dataOS) => {
    
    const os = JSON.parse(dataOS)
    
    const data = new Date(os.dataEntrada)
    const formatada = data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })
    
    idOS.value = os._id
    dateOS.value = formatada
    placaOs.value = os.placaOs
    marcaOs.value = os.marcaOs
    modeloOs.value = os.modeloOs
    valorOS.value = os.valor
    prazoOS.value = os.prazo
    funcRespOs.value = os.funcioResp
    problemaOS.value = os.problemaCliente
    diagOS.value = os.diagTecnico
    pecasRepOS.value = os.pecasReparo
    statusOS.value = os.statusDaOS

    btnUpdate.disabled = false;
    btnDelete.disabled = false;
    btnCreate.disabled = true;
})

function removeOS() {
    api.deleteOS(idOS.value) 
}

function generateOS() {
    api.printOS()
}