/**
 * Porecsso principal
 * Estudo do banco de dados MongoDB (CRUD)
 * @author Davi do couto
 */

//Importação do módulo de conexão
const {conectar, desconectar} = require("./database.js")

//Importação do modelo de dados do cliente
const clienteModel = require("./src/models/os.js")

//Função para cadastrar um novo cliente
//ATENÇÂO: Para trabalhar com banco de dados usar sempre
//async - await e try-catch
const salvarOS = async (nomeCli, prazo, valorOS, dadosEq, problemaCli, diagTecnico, pecasReparo, statusOS) => {
    try { 
        //setar a estrutura de dados com os valores
        //obs: usar os mesmo nomes da estrutura
        const novaOS = new clienteModel({
            nomeCliente: nomeCli,
            prazo: prazo,
            valor: valorOS,
            dadosEquipa: dadosEq,
            problemaCliente: problemaCli,
            diagTecnico: diagTecnico,
            pecasReparo: pecasReparo,
            statusOS: statusOS,
        })
        //A linha abaixo salva os dados no banco de dados
        await novaOS.save()
        console.log("OS adicionada com sucesso")
    } catch (error) {
        //Tratamento personalizado aos erros(exeções)
        if(error.code = 11000){
            console.log(`Erro no CPF ${cpfCli} já está cadastrado`)
        }else {
            console.log(error)
        }
    }
}

//===============================================================
//Função listar todas as OS
const listarOS = async () => {
    try{
        const OS = await clienteModel.find().sort({
            nomeOS: 1
        })
        console.log(OS)
    }catch(error){
        console.log(error)
    }
}

//Função para buscar um cliente pelo nome
//find({nomeOS: new RegExp(nome, i)}) = Ignorar na bucas letras maiúsculas ou minúsculas
//(i = casy insentive)
const buscarOSNome = async (nome) => {
    try{
        const buscarOSNome = await clienteModel.find({
            nomeCliente: new RegExp(nome, 'i')
        })
        console.log(buscarOSNome)
    }catch(error){
        console.log(error)
    }
}

//Função para editar os dados da OS
//ATENÇÃO: usar o id da OS
const atualizarOS = async (id, cpfCli, nomeCli, prazo, dadosEq, problemaCli, diagTecnico, pecasReparo, statusOS) => {
    try{
        const osAlterada = await clienteModel.findByIdAndUpdate(
            id,
            {
                nomeCliente: nomeCli,
                prazo: prazo,
                valor: valorOS,
                dadosEquipa: dadosEq,
                problemaCliente: problemaCli,
                diagTecnico: diagTecnico,
                pecasReparo: pecasReparo,
                statusOS: statusOS
            },
            {
                new: true,
                runValidators: true
            }
        )
        console.log("Dados da OS alterado com sucesso")
    }catch(error){
        //Tratamento personalizado aos erros(exeções)
        if(error.code = 11000){
            console.log(`Erro no CPF ${cpfCli} já está cadastrado`)
        }else {
            console.log(error)
        }
    }
}

//Função para excluir os dados do cliente
const excluirCliente = async (id) => {
    try{
        const osDeletado = await clienteModel.findByIdAndDelete(id)
        console.log("OS excluída com sucesso!")
    }catch(error){
        console.log(error)
    }
}

//===============================================================
const iniciarSistema = async () => {
    console.clear()
    console.log("Estudo do MongoDB")
    console.log("-------------------------------------")
    await conectar()
    //CRUD create(inscerção do banco de dados)
    //await salvarOS("Luiz henrique", "20dias", "R$500", "Lanterna", "Lanterna quebrada", "Lanterna", "Pendente", "2025/07/02")
    
    //CRUD read(listar todas as OS)
    //await listarOS()

    //CRUD read (buscar pelo nome do cliente)
    //await buscarOSNome("Luiz henrique")

    //CRUD update (id do cliente)
    //await atualizarOS("67e4461adc4f6c2716729da4", "Endrick Novaes", "R$872", "30 dias", "Placa", "Placa mudada", "Placa", "Placa", "Pendente")

    //CRUD delete (id do cliente)
    //await excluirCliente("67db23512ed7a6cceff4f67e")

    // await salvarOS("Fábio Alberto Lopes", "963903225", "26787813338", "20", "lanterna", "lanterna quebrada", "lanterna frontal")
    await desconectar()
}

iniciarSistema()

