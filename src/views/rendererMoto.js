// Capturar o foco na busca pelo nome cliente
//A constante "foco" obtem o elemento html(input) indentificado como "searchClinet"
const foco = document.getElementById('searchMoto');

//Iniciar a janela de clientes alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    //Desativar os botão 
    btnUpdate.disabled = true;
    btnDelete.disabled = true;
    //Foco na busca do cliente
    foco.focus();
});

//captura dos dados dos inputs do formulário (Passo 1: fluxo)
let frmMoto = document.getElementById("frmMoto");
let placa = document.getElementById("inputPlacaMoto");
let marcaMoto = document.getElementById("inputMarcaNameMoto");
let modeloMoto = document.getElementById("inputModeloMoto");
let anoMoto = document.getElementById("inputAnoMoto");
let probleMoto = document.getElementById("inputProblemaMoto");
let pecasRepOS = document.getElementById("inputPecasRepOS");
let statusOS = document.getElementById("inputStatusOS");

//==========================================================================
//CRUD CREATE E UPDATE

//Evento associado botão submit (uso das validações do HTML)
frmMoto.addEventListener('submit', async (event) => {
    //Evitar o comportamento padrão do submit, que é enviar os dados de formulário e reiniciar o documento HTML
    event.preventDefault()
    //teste importante (recebimento dos dados do formulário) - passo 1 do fluxo
    console.log(valorOS.value, prazoOS.value, dadosEqOS.value, problemaOS.value, diagOS.value, pecasRepOS.value, statusOS.value)

    //Crair um objeto para armazenar os dados do cliente antes de enviar ao main 
    const os = {
        valorOS: valorOS.value,
        prazoOS: prazoOS.value,
        dadosOS: dadosEqOS.value,
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