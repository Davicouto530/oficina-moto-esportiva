//Buscar CEP
function buscarCEP(){
    //console.log("teste do evento blur");

    //Pegando a tag pelo input e colocando o valor dentro de "cep"
    let cep = document.getElementById("inputCEPClient").value
    //console.log(cep)

    //consumir a API do ViaCep
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`
    
    //Acessando o web service para obter os dados
    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {
            //Extração dos dados
            document.getElementById("inputAddressClient").value = dados.logradouro
            document.getElementById("inputNeighborhoodClient").value = dados.bairro
            document.getElementById("inputTSateClient").value = dados.localidade
            document.getElementById("uf").value = dados.uf
        })
        .catch(error => console.log(error))
};

// Capturar o foco na busca pelo nome cliente
//A constante "foco" obtem o elemento html(input) indentificado como "searchClinet"
const foco = document.getElementById('searchClient');

//Iniciar a janela de clientes alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    //Desativar os botão 
    btnUpdate.disabled = true;
    btnDelete.disabled = true;
    //Foco na busca do cliente
    foco.focus();
});

//captura dos dados dos inputs do formulário (Passo 1: fluxo)
let frmClient = document.getElementById("frmClient");
let nameClient = document.getElementById("inputNameClient");
let cpfClient = document.getElementById("inputCPFClient");
let emailClient = document.getElementById("inputEmailNameClient");
let foneClient = document.getElementById("inputIPhoneClient");
let cepClient = document.getElementById("inputCEPClient");
let logClient = document.getElementById("inputAddressClient");
let numClient = document.getElementById("inputNumberClient");
let complementoClient = document.getElementById("inputComplementClient");
let bairroClient = document.getElementById("inputNeighborhoodClient");
let cidadeClient = document.getElementById("inputTSateClient");
let ufClient = document.getElementById("inputUfClient");

//==========================================================================
//CRUD CREATE E UPDATE

//Evento associado botão submit (uso das validações do HTML)
frmClient.addEventListener('submit', async (event) => {
    //Evitar o comportamento padrão do submit, que é enviar os dados de formulário e reiniciar o documento HTML
    event.preventDefault()
    //teste importante (recebimento dos dados do formulário) - passo 1 do fluxo
    console.log(nameClient.value, cpfClient.value, emailClient.value, foneClient.value, cepClient.value, logClient.value, numClient.value, complementoClient.value, bairroClient.value, cidadeClient.value, ufClient.value)

    //Crair um objeto para armazenar os dados do cliente antes de enviar ao main 
    const client = {
        nameCli: nameClient.value,
        cpfCli: cpfClient.value,
        emailCli: emailClient.value,
        foneCli: foneClient.value,
        cepCli: cepClient.value,
        logfCli: logClient.value,
        numCli: numClient.value,
        complementoCli: complementoClient.value,
        bairroCli: bairroClient.value,
        cidadeCli: cidadeClient.value,
        ufCli: ufClient.value
    }
    //Enviar ao main o objeto client - Passo 2 (fluxo)
    //Uso do preload.js
    api.newClient(client)
})

//Fim crud create update====================================================