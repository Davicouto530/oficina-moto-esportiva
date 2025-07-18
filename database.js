const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/'

let conectado = false;

const conectar = async () => {
    if (!conectado) {

        try { 
            await mongoose.connect(url)
            conectado = true

            return true 
        } catch (error) {
            console.log(error)

            if (error.code = 8000) {
                console.log("Erro de autenticação")
            } else {
                console.log(error)
            }
        }
    }
}

const desconectar = async () => {
    if (conectado) {

        try {
            await mongoose.disconnect(url)
            conectado = false

            return true 
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = { conectar, desconectar }