/**
 * Modelo de dados para construção das coleções("tabelas")
 * clientes 
 */

//Importação dos recursos do framework mongoose
const {model, Schema} = require('mongoose')

//Criação da estrutura da coleção Clientes
const funcionarioSchema = new Schema({
    nomeFun: {
        type: String
    }, 
    cpfFun: {
        type: String,
        unique: true,
        index: true
    },
    emailFun: {
        type: String
    },
    foneFun: {
        type: String
    },
    cepFun: {
        type: String
    },
    cargoFun: {
        type: String
    },
    horaFun: {
        type: String
    },
    salarioFun: {
        type: String
    }
}, {versionKey: false}) //Não versionar os dados armazenadas

//Exportar para o main o modelo de dados
//Clientes será o nome da coleção

module.exports = model('Funcionarios', funcionarioSchema)

