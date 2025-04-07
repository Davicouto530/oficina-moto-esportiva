//Importação dos recursos do framework mongoose
const {model, Schema} = require('mongoose')

//Criação da estrutura da coleção Clientes
const cadastroMoto = new Schema({
    nomeCliente: {
        type: String
    },
    placaMoto: {
        type: String
    },
    marcaMoto: {
        type: String
    },
    modeloMoto: {
        type: String
    },
    anoMoto: {
        type: String
    },
    problemaTecnico: {
        type: String
    },
    cor: {
        type: String
    }
}, {versionKey: false}) //Não versionar os dados armazenadas

//Exportar para o main o modelo de dados
//Clientes será o nome da coleção

module.exports = model('PlacaMoto', cadastroMoto)