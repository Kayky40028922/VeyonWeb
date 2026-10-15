import { Router } from "express";
import { exec } from "child_process";
// import { ip } from "../ip.js";

const CHAVE_AGENTE = "chave-lab-2026-trocar"

// let fimDoTempo = null;
// let contador = null;
// let bloqueio = null;

const timers = {};

const desbloquearPorTempo = Router();

desbloquearPorTempo.post("/desbloquearPorTempo", (req, res)=>{

    console.log("BODY:", req.body);
    
    const tempo = req.body.tempo;
    const ip = req.body.ip;

    console.log("ip recebido:", ip);
    console.log("tempo recebido:", tempo);

    console.log("tempo recebido:", tempo, "minutos");

    if(!tempo || tempo <= 0){
        return res.status(400).json({
            sucesso: false,
            mensagem: "tempo inválido"
        });
    }

    // for(const i of ip){

        const comando = `"C:\\Program Files\\Veyon\\veyon-cli.exe" feature stop ${ip} ScreenLock`;

        exec(comando, (erro, stdout, stderr)=>{

            if(erro){
                console.log(`erro ao desbloquear ${ip}:`, erro);
                return;
            }

            console.log(`computador ${ip} desbloqueado`);
            console.log(stdout);
        });
    // }



    const tempoEmMilissegundos = tempo * 60 * 1000;


    if(!tempo || tempo <= 0){
        return res.status(400).json({
            sucesso: false,
            mensagem: "tempo inválido"
        });
    }

    // if(fimDoTempo && Date.now() < fimDoTempo){
    //     return res.status(400).json({
    //         sucesso: false,
    //         mensagem: "já existe um timer ativo"
    //     });
    // }

    if(timers[ip] && Date.now() < timers[ip].fim){
        return res.status(400).json({
            sucesso: false,
            mensagem: "ja existe um timer ativo"
        });
    }

    // fimDoTempo = Date.now() + tempo * 60 * 1000;

    timers[ip] = {
        fim: Date.now() + tempo * 60 * 1000,
        bloqueio: null,
        contador: null
    };

    fetch(`http://${ip}:3001/timer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-agent-token": CHAVE_AGENTE
        },
        body: JSON.stringify({
            segundos: Math.ceil(tempo * 60)
        })
    })
    .then(async (resposta) => {
        const dados = await resposta.json();

        if (!resposta.ok) {
            console.log("Erro ao iniciar cronômetro no aluno:", dados);
            return;
        }

        console.log(`Cronômetro enviado para ${ip}`);
    })
    .catch((erro) => {
        console.log(`Não foi possível conectar ao agente ${ip}:`, erro.message);
    });

    let segundosRestantes = tempo * 60;

    timers[ip].contador = setInterval(()=>{

        if(!timers[ip]){
            clearInterval(timers[ip]?.contador);
            return;
        }

        segundosRestantes--;
    
        const minutos = Math.floor(segundosRestantes / 60);
        const segundos = segundosRestantes % 60;

        console.log(`tempo restante: ${minutos}:${segundos.toString().padStart(2, "0")}`);
        
    }, 1000);

    console.log("fim do tempo:", new Date(timers[ip].fim));

    // let segundosRestantes = tempo * 60;

    // if(timers[ip].contador){
    //     clearInterval(timers[ip].contador);
    // }

    // timers[ip].contador = setInterval(()=>{

    //     if(segundosRestantes <= 0){
    //         if(timers[ip]){
    //             clearInterval(timers[ip].contador);
    //             timers[ip].contador = null;
    //             return;
    //         }
    //     }
    
    //     segundosRestantes--;

    //     const minutos = Math.floor(segundosRestantes / 60);
    //     const segundos = segundosRestantes % 60;

    //     console.log(`tempo restante: ${minutos}:${segundos.toString().padStart(2, "0")}`);
        

    // }, 1000);


    if(timers[ip].bloqueio){
        clearTimeout(timers[ip].bloqueio);
    }

    timers[ip].bloqueio = setTimeout(()=>{

        if(timers[ip]?.contador){
        clearInterval(timers[ip].contador);
        }

        console.log("tempo acabou, bloquando computadores");

        // for(const i of ip){

            const comando = `"C:\\Program Files\\Veyon\\veyon-cli.exe" feature start ${ip} ScreenLock`;

            exec(comando, (erro, stdout, stderr)=>{

                if(erro){
                    console.log(`erro ao bloquear ${ip}:`, erro);
                    return;
                }

                console.log(`computador ${ip} bloqueado`);
                console.log(stdout);
                
                
                delete timers[ip];
            });
        // }

    }, tempoEmMilissegundos);

    res.json({
        sucesso: true,
        mensagem: "computadores desbloqueados"
    });

});

// desbloquearPorTempo.get("/tempoRestante", (req, res)=>{

//     if(!fimDoTempo){
//         return res.json({
//             ativo: false,
//             segundosRestantes: 0
//         });
//     }

//     const agora = Date.now();

//     const diferenca = fimDoTempo - agora;

//     const segundosRestantes = Math.max(0, Math.floor(diferenca / 1000));

//     res.json({
//         ativo: segundosRestantes > 0,
//         segundosRestantes: segundosRestantes
//     });
// });


desbloquearPorTempo.get("/tempoRestante", (req, res)=>{

    const ip = req.query.ip;

    const timer = timers[ip];

    if(!timer){
        return res.json({
            ativo: false,
            segundosRestantes: 0
        });
    }

    const agora = Date.now();

    const diferenca = timer.fim - agora;

    const segundosRestantes = Math.max(0, Math.floor(diferenca / 1000));

    res.json({
        ativo: segundosRestantes > 0,
        segundosRestantes: segundosRestantes
    });
});











// desbloquearPorTempo.post("/interromperTempo", (req, res)=>{

//     console.log("interromper tempo");

//     if(contador){
//         clearInterval(timers[ip].contador);
//         delete timers[ip];
//     }

//     if(bloqueio){
//         clearTimeout(bloqueio);
//         bloqueio = null;
//     }

//     fimDoTempo = null;

//     const comando = `"C:\\Program Files\\Veyon\\veyon-cli.exe" feature start ${ip} ScreenLock`;

//     exec(comando, (erro, stdout, stderr)=>{

//         if(erro){
//             console.log(`erro ao bloquear ${ip}`, erro);

//             return res.status(500).json({
//                 sucesso: false,
//                 mensagem: "erro ao bloquear computador"
//             });
//         }

//         console.log(`computador ${ip} bloqueado`);
//         console.log(stdout);

//         res.json({
//             sucesso: true,
//             mensagem: "tempo interrompido e computador bloqueado"
//         });
//     });
// });


desbloquearPorTempo.post("/interromperTempo", (req, res)=>{

    const ip = req.body.ip;

    console.log("interromper tempo do computador:", ip);

    const timer = timers[ip];

    if(timer){

        if(timer.contador){
            clearInterval(timer.contador);
        }

        if(timer.bloqueio){
            clearTimeout(timer.bloqueio);
        }

        delete timers[ip];
    }

    const comando =
        `"C:\\Program Files\\Veyon\\veyon-cli.exe" feature start ${ip} ScreenLock`;

    exec(comando, (erro, stdout, stderr)=>{

        if(erro){
            console.log(`erro ao bloquear ${ip}:`, erro);

            return res.status(500).json({
                sucesso: false,
                mensagem: "erro ao bloquear computador"
            });
        }

        console.log(`computador ${ip} bloqueado`);
        console.log(stdout);

        res.json({
            sucesso: true,
            mensagem: "tempo interrompido e computador bloqueado"
        });
    });
});

export { desbloquearPorTempo };