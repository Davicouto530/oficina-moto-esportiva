// Capturar o foco na busca pelo nome cliente
//A constante "foco" obtem o elemento html(input) indentificado como "searchClinet"
const foco = document.getElementById('searchOS');

//Iniciar a janela de clientes alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    //Desativar os botão 
    btnUpdate.disabled = true;
    btnDelete.disabled = true;
    //Foco na busca do cliente
    foco.focus();
});

//Vetor global que sera usado na manipulação dos dados
let arrayOs = []

//captura dos dados dos inputs do formulário (Passo 1: fluxo)
let frmOS = document.getElementById("frmOS");
let placaOs = document.getElementById("inputPlaca");
let valorOS = document.getElementById("inputValorOS");
let prazoOS = document.getElementById("inputPrazoOS");
let funcRespOs = document.getElementById("inputFuncRespOS");
let problemaOS = document.getElementById("inputProblemaOS");
let diagOS = document.getElementById("inputDiagnosticoOS");
let pecasRepOS = document.getElementById("inputPecasRepOS");
let statusOS = document.getElementById("inputStatusOS");

//==========================================================================
//CRUD CREATE E UPDATE

//Evento associado botão submit (uso das validações do HTML)
frmOS.addEventListener('submit', async (event) => {
    //Evitar o comportamento padrão do submit, que é enviar os dados de formulário e reiniciar o documento HTML
    event.preventDefault()
    //teste importante (recebimento dos dados do formulário) - passo 1 do fluxo
    console.log(placaOs.value, valorOS.value, prazoOS.value, funcRespOs.value, problemaOS.value, diagOS.value, pecasRepOS.value, statusOS.value)

    //Crair um objeto para armazenar os dados do cliente antes de enviar ao main 
    const os = {
        placaOs: placaOs.value,
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

//CRUD READ====================================================================

function buscarOs() {
    //Passo 1: Capturar o nome do cliente
    let os = document.getElementById("searchOS").value
    console.log(os);

    //Validação de campo obrigatório
    //se o campo de buscar não foi preenchido
    if (os === "") {
        //Enviar ao main um pedido para alertar o usuário
        api.validateSearch()
        foco.focus()
    } else {
        api.searchOs(os);// Passo 2: envio de nome ao main

        //Recebimento dos dados cliente
        api.renderOs((event, dataOs) => {
            console.log(dataOs)//Teste passo 5
            //Passo 6: renderizar os dados do clientes no formulário
            // - Criar um vetor global para manipulação dos dados
            // - Criar uma constante para converter os dados recebidos que estão no formato string para o formato JSON
            // Usar o laço forEach para percorrer o vetor e setar os campos (caixa de textos do formula´rio)
            const dadosOs = JSON.parse(dataOs)

            //atribuir ao array 
            arrayOs = dadosOs
            //extrair os dados do cliente
            arrayOs.forEach((o) => {
                id.value = o._id,

                placaOs.value = o.placaOs,
                valorOS.value = o.valorOs,
                prazoOS.value = o.prazoOs,
                funcRespOs.value = o.funcRespOs,
                problemaOS.value = o.problemaOS,
                diagOS.value = o.diagOS,
                pecasRepOS.value = o.pecasRepOS,
                statusOS.value = o.statusOS 

                btnCreate.disabled = true
                //Desbloqueio dos botões editar e excluir
                btnUpdate.disabled = false
                btnDelete.disabled = false
            });
        })
    }
}

//FIM CRUD READ====================================================================

// == CRUD Delete OS ==================================

function excluirOs() {
    console.log(id.value)//Passo 1: receber do form o id
    api.deleteOs(id.value)//Passo 2: enviar o id ao main
}

// == FIM CRUD Delete OS ==================================