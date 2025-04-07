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
let corMoto = document.getElementById("inputCorMoto");

//==========================================================================
//CRUD CREATE E UPDATE

//Evento associado botão submit (uso das validações do HTML)
frmMoto.addEventListener('submit', async (event) => {
    //Evitar o comportamento padrão do submit, que é enviar os dados de formulário e reiniciar o documento HTML
    event.preventDefault()
    //teste importante (recebimento dos dados do formulário) - passo 1 do fluxo
    console.log(placa.value, marcaMoto.value, modeloMoto.value, anoMoto.value, probleMoto.value, corMoto.value)

    //Crair um objeto para armazenar os dados do cliente antes de enviar ao main 
    const moto = {
        placaMoto: placa.value,
        marcaM: marcaMoto.value,
        modeloM: modeloMoto.value,
        anoM: anoMoto.value,
        probleM: probleMoto.value,
        corM: corMoto.value
    }
    //Enviar ao main o objeto OS - Passo 2 (fluxo)
    //Uso do preload.js
    api.newMoto(moto)
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