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