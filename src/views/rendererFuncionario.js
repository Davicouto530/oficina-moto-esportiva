// Capturar o foco na busca pelo nome cliente
//A constante "foco" obtem o elemento html(input) indentificado como "searchClinet"
const foco = document.getElementById('searchFunc');

//Iniciar a janela de clientes alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    //Desativar os botão 
    btnUpdate.disabled = true;
    btnDelete.disabled = true;
    //Foco na busca do cliente
    foco.focus();
});

//captura dos dados dos inputs do formulário (Passo 1: fluxo)
let frmFunc = document.getElementById("frmFunc");
let nomeFunc = document.getElementById("inputNameFunc");
let cpfFunc = document.getElementById("inputCPFFunc");
let emailFunc = document.getElementById("inputEmailNameFunc");
let foneFunc = document.getElementById("inputIPhoneFunc");
let cepFunc = document.getElementById("inputCEPFunc");
let cargoFunc = document.getElementById("inputCargoFunc");
let horaFunc = document.getElementById("inputHoraFunc");
let salarioFunc = document.getElementById("inputSalarioFunc");

//==========================================================================
//CRUD CREATE E UPDATE

//Evento associado botão submit (uso das validações do HTML)
frmFunc.addEventListener('submit', async (event) => {
    //Evitar o comportamento padrão do submit, que é enviar os dados de formulário e reiniciar o documento HTML
    event.preventDefault()
    //teste importante (recebimento dos dados do formulário) - passo 1 do fluxo
    console.log(nomeFunc.value, cpfFunc.value, emailFunc.value, foneFunc.value, cepFunc.value, cargoFunc.value, horaFunc.value, salarioFunc.value)

    // Limpa o CPF antes de salvar no banco
    let cpfSemFormatacao = cpfFunc.value.replace(/\D/g, "");

    //Crair um objeto para armazenar os dados do cliente antes de enviar ao main 
    const func = {
        nomeF: nomeFunc.value,
        cpfF: cpfSemFormatacao,
        emailF: emailFunc.value,
        foneF: foneFunc.value,
        cepF: cepFunc.value,
        cargoF: cargoFunc.value,
        horaF: horaFunc.value,
        salarioF: salarioFunc.value
    }
    //Enviar ao main o objeto OS - Passo 2 (fluxo)
    //Uso do preload.js
    api.newFuncionario(func)
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

// === Função para aplicar máscara no CPF ===
function aplicarMascaraCPF(campo) {
    let cpf = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})(\d)/, "$1.$2");
    if (cpf.length > 6) cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (cpf.length > 9) cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

    campo.value = cpf;
}

// === Função para validar CPF ===
function validarCPF() {
    let campo = document.getElementById('inputCPFFunc');
    let cpf = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    campo.style.borderColor = "green";
    campo.style.color = "green";
    return true;
}

// Adicionar eventos para CPF
cpfFunc.addEventListener("input", () => aplicarMascaraCPF(cpfFunc)); // Máscara ao digitar
cpfFunc.addEventListener("blur", validarCPF); // Validação ao perder o foco