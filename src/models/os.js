/**
 * Modelo de dados para construção das coleções("tabelas")
 * clientes 
 */

//Importação dos recursos do framework mongoose
const {model, Schema} = require('mongoose')

//Criação da estrutura da coleção Clientes
const cadastroOS = new Schema({
    placaOs: {
        type: String
    },
    valor: {
        type: String
    },
    prazo: {
        type: String
    },
    funcioResp: {
        type: String
    },
    problemaCliente: {
        type: String
    },
    diagTecnico: {
        type: String
    },
    pecasReparo: {
        type: String
    },
    statusDaOS: {
        type: String
    }
}, {versionKey: false}) //Não versionar os dados armazenadas

//Exportar para o main o modelo de dados
//Clientes será o nome da coleção

module.exports = model('OS', cadastroOS)

