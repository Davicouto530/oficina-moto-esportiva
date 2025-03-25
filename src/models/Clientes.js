/**
 * Modelo de dados para construção das coleções("tabelas")
 * clientes 
 */

//Importação dos recursos do framework mongoose
const {model, Schema} = require('mongoose')
const { version, type } = require('os')

//Criação da estrutura da coleção Clientes
const clienteSchema = new Schema({
    nomeCliente: {
        type: String
    }, 
    cpfCliente: {
        type: String,
        unique: true,
        index: true
    },
    emailCliente: {
        type: String
    },
    foneCliente: {
        type: String
    },
    cepCliente: {
        type: String
    },
    logradouroCliente: {
        type: String
    },
    numeroCliente: {
        type: String
    },
    complementoCliente: {
        type: String
    },
    bairroCliente: {
        type: String
    },
    cidadeCliente: {
        type: String
    },
    ufCliente: {
        type: String
    }
}, {versionKey: false}) //Não versionar os dados armazenadas

//Exportar para o main o modelo de dados
//Clientes será o nome da coleção

module.exports = model('Clientes', clienteSchema)

