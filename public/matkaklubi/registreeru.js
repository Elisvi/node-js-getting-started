function registreeru() {
    const matkIndex = document.querySelector('#matkIndex').value;
    const email = document.querySelector('#registreerujaEmail').value;
    const nimi = document.querySelector('#registreerujaNimi').value;
    const vormEL = document.querySelector('#registreerumisVorm')
  
    var settings = {
        async: true,
        crossDomain: true,
        url: `/kinnita?matkIndex=${matkIndex}&email=${email}&nimi=${nimi}&markus=${markus}`,
        method: 'GET',
        headers: {},
    };
  
    $.ajax(settings).done(function (response) {
        console.log(response);
        //Näita vastust - näiteks vormi asemel teadet "Salvestamine õnnestus"
        vormEL.innerHTML = `<div class="message">Salvestamine õnnestus!</div>`
    });
    return false
 
}