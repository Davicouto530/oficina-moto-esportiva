//Data atualizada no rodapé
function obterData(){
    let dataAtual = new Date()

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return dataAtual.toLocaleDateString('pt-BR', options)
}

//Executar a função ao iniciar o aplicativo(janela principal)
document.getElementById('dataAtual').innerHTML = obterData()