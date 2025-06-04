const foco = document.getElementById('searchMoto');

document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true;
    btnDelete.disabled = true;
    
    foco.focus();
});

let frmMoto = document.getElementById("frmMoto");
let placa = document.getElementById("inputPlacaMoto");
let marcaMoto = document.getElementById("inputMarcaMoto");
let modeloMoto = document.getElementById("inputModeloMoto");
let anoMoto = document.getElementById("inputAnoMoto");
let corMoto = document.getElementById("inputCorMoto");

frmMoto.addEventListener('submit', async (event) => {
    
    event.preventDefault()
    
    // console.log(placa.value, marcaMoto.value, modeloMoto.value, anoMoto.value, corMoto.value)

    const moto = {
        placaMoto: placa.value,
        marcaM: marcaMoto.value,
        modeloM: modeloMoto.value,
        anoM: anoMoto.value,
        corM: corMoto.value
    }
     
    api.newMoto(moto)
})

function resetForm() {
    location.reload() 
}

api.resetForm((args) => {
    resetForm()
}) 