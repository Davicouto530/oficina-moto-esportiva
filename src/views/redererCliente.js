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
