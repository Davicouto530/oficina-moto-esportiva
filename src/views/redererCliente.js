
function buscarCEP() {
    
    let cep = document.getElementById("inputCEPClient").value
    
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`

    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {
            
            document.getElementById("inputAddressClient").value = dados.logradouro
            document.getElementById("inputNeighborhoodClient").value = dados.bairro
            document.getElementById("inputTSateClient").value = dados.localidade
            document.getElementById("inputUfClient").value = dados.uf
        })
        .catch(error => console.log(error))
};

let arrayClient = []

const foco = document.getElementById('searchClient');

document.addEventListener('DOMContentLoaded', () => {
    
    btnUpdate.disabled = true;
    btnDelete.disabled = true;
    
    foco.focus();
});

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

let id = document.getElementById('idClient');

function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault() 
        
        buscarCliente()
    }
}

function restaurarEnter() {
    frmClient.removeEventListener("keydown", teclaEnter)
}

frmClient.addEventListener("keydown", teclaEnter)

frmClient.addEventListener('submit', async (event) => {
    
    event.preventDefault()
    
    console.log(nameClient.value, cpfClient.value, emailClient.value, foneClient.value, cepClient.value, logClient.value, numClient.value, complementoClient.value, bairroClient.value, cidadeClient.value, ufClient.value, id.value)
    
    let cpfSemFormatacao = cpfClient.value.replace(/\D/g, "");
    
    if (id.value === "") {
        const client = {
            nameCli: nameClient.value,
            cpfCli: cpfSemFormatacao,
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
        api.newClient(client)
        
    } else {
        const client = {
            idCli: id.value,
            nameCli: nameClient.value,
            cpfCli: cpfSemFormatacao,
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
        api.updateClient(client)
        
        
    }
})

function buscarCliente() {
    
    let name = document.getElementById("searchClient").value

    if (name === "") {
        
        api.validateSearch()
        foco.focus()
    } else {
        api.searchName(name);

        
        api.renderClient((event, dataClient) => {
            
            const dadosCliente = JSON.parse(dataClient)

            arrayClient = dadosCliente
            
            arrayClient.forEach((c) => {
                id.value = c._id,
                    nameClient.value = c.nomeCliente,
                    cpfClient.value = c.cpfCliente,
                    emailClient.value = c.emailCliente,
                    foneClient.value = c.foneCliente,
                    cepClient.value = c.cepCliente,
                    logClient.value = c.logradouroCliente,
                    numClient.value = c.numeroCliente,
                    complementoClient.value = c.complementoCliente,
                    bairroClient.value = c.bairroCliente,
                    cidadeClient.value = c.cidadeCliente,
                    ufClient.value = c.ufCliente
                btnCreate.disabled = true
                
                btnUpdate.disabled = false
                btnDelete.disabled = false
            });
        })
    }
}


api.setClient((args) => {
    let campoBusca = document.getElementById('searchClient').value.trim()

    if (/^\d{11}$/.test(campoBusca)) {
        
        cpfClient.focus()
        foco.value = ""
        cpfClient.value = campoBusca
    }
    else if (/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(campoBusca)) {
        cpfClient.focus()
        foco.value = ""
        cpfClient.value = campoBusca
    }
    else {
        
        nameClient.focus()
        foco.value = ""
        nameClient.value = campoBusca
    }
})

function resetForm() {
    
    location.reload() 
}

api.resetForm((args) => {
    resetForm()
})

function aplicarMascaraCPF(campo) {
    let cpf = campo.value.replace(/\D/g, ""); 

    if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})(\d)/, "$1.$2");
    if (cpf.length > 6) cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (cpf.length > 9) cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

    campo.value = cpf;
}


function validarCPF() {
    let campo = document.getElementById('inputCPFClient');
    let cpf = campo.value.replace(/\D/g, ""); 

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


cpfClient.addEventListener("input", () => aplicarMascaraCPF(cpfClient)); 
cpfClient.addEventListener("blur", validarCPF); 

function excluirCliente() {
    api.deleteClient(id.value)
}


