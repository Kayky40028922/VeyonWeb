const intervalo = {};

// async function desligar() {
//     const resposta = await fetch("/desligar", {
//             method: "POST"
//     });

//     const resultado = await resposta.json();

//     alert(resultado.mensagem);
// }



// async function bloquear() {
//     const resposta = await fetch("/bloquear", {
//             method: "POST"
//     });

//     const resultado = await resposta.json();

//     alert(resultado.mensagem);
// }



// async function desbloquear() {
//     const resposta = await fetch("/desbloquear", {
//         method: "POST"
//     });
    
//     const resultado = await resposta.json();
    
//     alert(resultado.mensagem);
// }



async function bloquearComputador(ip) {
    const resposta = await fetch("/bloquear", {
            method: "POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({
                ip: ip
            })
    });

    const resultado = await resposta.json();

    alert(resultado.mensagem);
}




async function desbloquearComputador(ip) {
    const resposta = await fetch("/desbloquear", {
            method: "POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({
                ip: ip
            })
    });

    const resultado = await resposta.json();

    alert(resultado.mensagem);
}




// async function desbloquearPorTempo(){
    
//     const tempo = document.getElementById("tempo").value;

//     if(tempo <= 0){
//         alert("tempo invalido");
//         return;
//     }

//     await fetch("/desbloquear", {
//         method: "POST"
//     });


//     let segundos = tempo * 60;

//     const contador = document.getElementById("contador");

//     const intervalo = setInterval(()=>{

//         let minutos = Math.floor(segundos / 60);
//         let segundosRestantes = segundos % 60;

//         contador.textContent = `${minutos}:${segundosRestantes.toString().padStart(2, "0")}`;

//         segundos--;

//         if(segundos < 0){

//             clearInterval(intervalo);

//             fetch("/bloquear", {
//                 method: "POST"
//             });
//         }

//     }, 1000);
// }



// async function desbloquearPorTempo(){
    
//     const tempo = document.getElementById("tempo").value;

//     if(tempo <= 0){
//         alert("tempo inválido");
//         return;
//     }

//     const resposta = await fetch("/desbloquearPorTempo", {
//         method: "POST",

//         headers: {
//             "Content-Type": "application/json"
//         },

//         body: JSON.stringify({
//             tempo: tempo
//         })
//     });

//     const resultado = await resposta.json();

//     // alert(resultado.mensagem);

//     let respostaTempo = await fetch("/tempoRestante");

//     let dadosTempo = await respostaTempo.json();

//     let segundosRestantes = dadosTempo.segundosRestantes;

//     const contador = document.getElementById("contador");
    
//     if(intervalo){
//         clearInterval(intervalo);
//     }

//     intervalo = setInterval(()=>{

//         const minutos = Math.floor(segundosRestantes / 60);

//         const segundos = segundosRestantes % 60;

//         contador.textContent = `${minutos}:${segundos.toString().padStart(2, "0")}`;

//         segundosRestantes--;

//         if(segundosRestantes < 0){
//             clearInterval(intervalo);
//             contador.textContent = "00:00";
//         }
//     }, 1000);


//     // let segundosRestantes = tempo * 60;

//     // const contador = document.getElementById("contador");

//     // const intervalo = setInterval(()=>{

//     //     const minutos = Math.floor(segundosRestantes / 60);

//     //     const segundos = segundosRestantes % 60;

//     //     contador.textContent = `${minutos}:${segundos.toString().padStart(2, "0")}`;

//     //     segundosRestantes--;

//     //     if(segundosRestantes < 0){
//     //         clearInterval(intervalo);
//     //     }
//     // }, 1000);
// }



async function desbloquearComputadorPorTempo(ip){
    
    const tempo = document.getElementById(`tempo-${ip}`).value;

    const resposta = await fetch("/desbloquearPorTempo", {
        method: "POST",

        headers:{
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            ip: ip,
            tempo: tempo
        })
    });

    const resultado = await resposta.json();

    alert(resultado.mensagem);

    atualizarContador(ip);
}



async function atualizarContador(ip){
    
    const resposta = await fetch(`/tempoRestante?ip=${encodeURIComponent(ip)}`);
    const dados = await resposta.json();

    let segundosRestantes = dados.segundosRestantes;

    const contador = document.getElementById(`contador-${ip}`);

    if(segundosRestantes <= 0){
        contador.textContent = "00:00";
        return;
    }

    if(intervalo[ip]){
        clearInterval(intervalo[ip]);
    }

    intervalo[ip] = setInterval(()=>{

        const minutos = Math.floor(segundosRestantes / 60);
        const segundos = segundosRestantes % 60;

        contador.textContent = `${minutos}:${segundos.toString().padStart(2, "0")}`;

        segundosRestantes--;

        if(segundosRestantes < 0){
            clearInterval(intervalo[ip]);
            intervalo[ip] = null;
            contador.textContent = "00:00";
        }
    }, 1000);
}



// async function interromperTempo(){
    
//     const resposta = await fetch("/interromperTempo", {
//         method: "POST"
//     });

//     const resultado = await resposta.json();

//     if(intervalo){
//         clearInterval(intervalo);
//         intervalo = null;
//     }

//     document.getElementById("contador").textContent = "00:00";

//     alert(resultado.mensagem);
// }

async function interromperTempo(ip) {

    const resposta = await fetch("/interromperTempo", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            ip: ip
        })
    });

    const resultado = await resposta.json();

    if(intervalo[ip]){
        clearInterval(intervalo[ip]);
        intervalo[ip] = null;
    }

    const contador = document.getElementById(`contador-${ip}`);

    contador.textContent = "00:00"

    alert(resultado.mensagem);
}






import { ip } from "./backend/ip.js";

const computadores = document.getElementById("computadores");

ip.forEach((ip)=>{

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
        <h3>computador</h3>

        <p>IP: ${ip}</p>

        <button onclick="desbloquearComputador('${ip}')">desbloquear</button>
        
        <button onclick="bloquearComputador('${ip}')">bloquear</button>

        <select id="tempo-${ip}">
            <option value="0.5">0.5 minuto</option>
            <option value="1">1 minuto</option>
            <option value="5">5 minutos</option>
            <option value="10">10 minutos</option>
            <option value="15">15 minutos</option>
            <option value="30">30 minutos</option>
            <option value="60">60 minutos</option>
        </select>

        <button onclick="desbloquearComputadorPorTempo('${ip}')">desbloquear temporareamente</button>
        
        <button onclick="interromperTempo('${ip}')">interromper tempo</button>

        <p id="contador-${ip}">00:00</p>

        `;

        computadores.appendChild(card);

        atualizarContador(ip)
});


// window.desligar = desligar;
// window.bloquear = bloquear;
// window.desbloquear = desbloquear;
// window.desbloquearPorTempo = desbloquearPorTempo;
window.interromperTempo = interromperTempo;
window.bloquearComputador = bloquearComputador;
window.desbloquearComputador = desbloquearComputador;
window.desbloquearComputadorPorTempo = desbloquearComputadorPorTempo;