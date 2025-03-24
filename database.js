/**
 * Modelo de conexão com o banco de dados. Uso de framework mongoose
 */

//Importação do mongoose 
const mongoose = require('mongoose');

//Configuração do acesso ao bancos de dados
//ip/link - autenticação(usuario e senha) 
//Obs: Atlas(obter via Compass)
//Para criar um banco de dados personalizado basta escolher um 
//nome no final da string da url(ex: dbdaviTI)
const url = "mongodb+srv://admin:123Senac@projetonode.ynvnv.mongodb.net/oficina-moto-esportiva"

//Criar uma variável de apoio para validação
let conectado = false;

//Método para conectar o banco de dados
//async (trabalhar de forma assincrona)
const conectar = async () => {
    //Validação (se não estiver conectado, conectar)
    if (!conectado) {
        //Conectar com o banco de dados

        try { //try catch - Tratamento de exceções
            await mongoose.connect(url)
            conectado = true
            console.log("MongoDB conectado")

            return true // para o main identificar a conexão estabelecida com sucesso
        } catch (error) {
            console.log(error)
            //Se o código de erro = 8000 (autenticação)
            if (error.code = 8000) {
                console.log("Erro de autenticação")
            } else {
                console.log(error)
            }
        }
    }
}

//Método para desconectar o banco de dados
const desconectar = async () => {
    //Validação (se não estiver conectado, conectar)
    if (conectado) {
        //Desconectar do banco de dados

        try { //try catch - Tratamento de exceções
            await mongoose.disconnect(url)//Desconectar
            conectado = false
            console.log("MongoDB desconectado")

            return true // para o main identificar que o banco de dados foi desconectado com sucesso
        } catch (error) {
            console.log(error)
        }
    }
}

//Exportar para o main os métodos conecatr e desconectar
module.exports = { conectar, desconectar }