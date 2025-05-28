// Capturar o foco na busca pelo nome cliente
//A constante "foco" obtem o elemento html(input) indentificado como "searchClinet"
const foco = document.getElementById('inputSearchOs');

//Iniciar a janela de clientes alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    //Desativar os botão 
    btnUpdate.disabled = true;
    btnDelete.disabled = true;
    btnCreate.disabled = false;
    //Foco na busca do cliente
    foco.focus();
});

//Vetor global que sera usado na manipulação dos dados
let arrayOs = []

//captura dos dados dos inputs do formulário (Passo 1: fluxo)
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
// captura do id do campo data
let dateOS = document.getElementById('inputData');
let idOS = document.getElementById("inputNumOs");

//==========================================================================
//CRUD CREATE E UPDATE

//Evento associado botão submit (uso das validações do HTML)
frmOS.addEventListener('submit', async (event) => {
    //Evitar o comportamento padrão do submit, que é enviar os dados de formulário e reiniciar o documento HTML
    event.preventDefault()
    //teste importante (recebimento dos dados do formulário) - passo 1 do fluxo
    // console.log(placaOs.value, valorOS.value, prazoOS.value, funcRespOs.value, problemaOS.value, diagOS.value, pecasRepOS.value, statusOS.value, dateOS.value)

    if (idOS.value === "") {
        //Crair um objeto para armazenar os dados do cliente antes de enviar ao main 
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
        //Enviar ao main o objeto OS - Passo 2 (fluxo)
        //Uso do preload.js
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
            pecasOS: pecasRepOS.value,
            statusOS: statusOS.value
        }
        //Enviar ao main o objeto OS - Passo 2 (fluxo)
        //Uso do preload.js
        api.updateOS(os)
    }
})

//Fim crud create update====================================================

function resetForm() {
    //Limpar os campos e resetar o formulário com as configurações pré definidas
    location.reload() //Recarrega a página
}

//Recebimento do pedido do main para resetar o formulário
api.resetForm((args) => {
    resetForm()
})

//Buscar avançada - estilo google ============================================

//Buscar avançada - estilo google ============================================

//Capturar os ids referente ao campo do nome
const input = document.getElementById("inputSearchOs")

//Capturar o id da ul de lista de sugestão da os
const suggestionList = document.getElementById("viewListSuggestion")

let idOs = document.getElementById("inputIdOs")
let inputPlacaOs = document.getElementById("inputPlacaOs")
let placaMoto = document.getElementById("inputPlacaMoto")

let arrayPlaca = []

// captura em tempo real do input (digitação de caracteres na caixa de busca)
input.addEventListener('input', () => {
    // Passo 1: capturar o que for digitado na caixa de busca e converter tudo para letras minusculas (auxilio ao filtro)
    const search = input.value.toLowerCase()
    ///console.log(search) // teste de apoio a logica

    // passo 2: enviar ao main um pedido de busca de clientes pelo nome (via preload - api (IPC))
    api.searchMoto()

    // Recebimentos dos clientes do banco de dados (passo 3)
    api.listMoto((event, moto) => {
        ///console.log(clients) // teste do passo 3
        // converter o vetor para JSON os dados dos clientes recebidos
        const dataMoto = JSON.parse(moto)

        // armazenar no vetor os dados dos clientes
        arrayPlaca = dataMoto
        // Passo 4: Filtrar todos os dados dos clientes extraindo nomes que tenham relação com os caracteres digitados na busca em tempo real 
        const results = arrayPlaca.filter(c =>
            c.placaMoto && c.placaMoto.toLowerCase().includes(search)
        ).slice(0, 10) // maximo 10 resultados
        ///console.log(results) // IMPORTANTE para o entendimento
        // Limpar a lista a cada caractere digitado
        suggestionList.innerHTML = ""
        // Para cada resultado gerar um item da lista <li>

        console.log(results)
        results.forEach(c => {
            // criar o elemento li
            const item = document.createElement('li')
            // Adicionar classes bootstrap a cada li criado 
            item.classList.add('list-group-item', 'list-group-item-action')
            // exibir placa da moto
            item.textContent = c.placaMoto

            // adicionar os lis criados a lista ul
            suggestionList.appendChild(item)

            //Adicionar um evento de clique no item na lista para preencher os campos do comportamento
            item.addEventListener("click", () => {
                idOs.value = c._id;
                inputPlacaOs.value = c.placaMoto;
                marcaOs.value = c.marcaMoto;
                modeloOs.value = c.modeloMoto;

                // Ocultar a lista após o clique
                suggestionList.innerHTML = "";

                // (opcional) Limpar o campo de busca se quiser
                // input.value = "";
            });
        })
    })
})

//Ocultar a lista ao clicar fora
document.addEventListener("click", (event) => {
    if (!input.contains(event.target) && !suggestionList.contains(event.target)) {
        suggestionList.innerHTML = ""
    }
})

//CRUD READ====================================================================

function inputOs() {
    // console.log("teste")
    api.searchOs()
}

//FIM CRUD READ====================================================================

api.renderOS((event, dataOS) => {
    // console.log(dataOS)
    const os = JSON.parse(dataOS)

    // formatar data:
    const data = new Date(os.dataEntrada)
    const formatada = data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })
    // preencher os campos com os dados da OS
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

// == Fim - Buscar OS - CRUD Read =============================
// ============================================================

// ============================================================
// == CRUD Delete =============================================

function removeOS() {
    console.log(idOS.value) // Passo 1 (receber do form o id da OS)
    api.deleteOS(idOS.value) // Passo 2 (enviar o id da OS ao main)
}

// == Fim - CRUD Delete =======================================
// ============================================================

// ================================= IMPRIMIR OS =================================

function generateOS() {
    api.printOS()
}

// ================================= FIM IMPRIMIR OS =================================