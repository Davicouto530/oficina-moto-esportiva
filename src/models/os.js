const {model, Schema} = require('mongoose')

const cadastroOS = new Schema({
    numOs: {
        type: Number
    },
    dataEntrada: {
        type: Date,
        default: Date.now
    },
    placaOs: {
        type: String
    },
    modeloOs: {
        type: String
    },
    marcaOs: {
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
}, {versionKey: false}) 

module.exports = model('OS', cadastroOS)

