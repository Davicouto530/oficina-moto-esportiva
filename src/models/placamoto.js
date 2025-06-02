const {model, Schema} = require('mongoose')

const cadastroMoto = new Schema({
    placaMoto: {
        type: String, 
        unique: true
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
    cor: {
        type: String
    }
}, {versionKey: false}) 

module.exports = model('PlacaMoto', cadastroMoto)