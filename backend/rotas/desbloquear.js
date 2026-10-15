import { Router } from "express";
import { exec } from "child_process";
import { ip } from "../ip.js";

const desbloquear = Router();

desbloquear.post("/desbloquear", (req, res)=>{

    const ip = req.body.ip;

    console.log("pedido para desbloquear", ip);

    // for (const i of ip){

        const comando = `"C:\\Program Files\\Veyon\\veyon-cli.exe" feature stop ${ip} ScreenLock`;

        exec(comando, (erro, stdout, stderr)=>{

            if(erro){

                console.log("erro:",erro);

                return res.status(500).json({
                    sucesso: false,
                    mensagem: "erro ao desbloquear"
                });
            }

            console.log(stdout);

        });
    // }
    res.json({
        sucesso: true,
        mensagem: `${ip} desbloqueado`
    });
});

export  { desbloquear }






























// import { Router } from "express";
// import { exec } from "child_process";
// import { ip } from "../ip.js";

// const desbloquear = Router();

// desbloquear.post("/desbloquear", (req, res) => {

//     console.log("pedido para desbloquear");

//     const { computador, tempo } = req.body;


//     // Verifica se escolheu um computador

//     if (!computador) {

//         return res.status(400).json({
//             sucesso: false,
//             mensagem: "Nenhum computador foi selecionado"
//         });

//     }


//     // Verifica se escolheu um tempo

//     if (!tempo) {

//         return res.status(400).json({
//             sucesso: false,
//             mensagem: "Nenhum tempo foi selecionado"
//         });

//     }


//     // Verifica se o computador existe na lista de IPs

//     if (!ip.includes(computador)) {

//         return res.status(400).json({
//             sucesso: false,
//             mensagem: "Computador não encontrado"
//         });

//     }


//     // =====================================================
//     // DESBLOQUEAR O COMPUTADOR
//     // =====================================================

//     const comandoDesbloquear =
//         `"C:\\Program Files\\Veyon\\veyon-cli.exe" feature stop ${computador} ScreenLock`;


//     exec(comandoDesbloquear, (erro, stdout, stderr) => {

//         if (erro) {

//             console.log("erro ao desbloquear:", erro);

//             return;
//         }

//         console.log(`PC ${computador} desbloqueado`);

//     });


//     // =====================================================
//     // TRANSFORMAR MINUTOS EM MILISSEGUNDOS
//     // =====================================================

//     const tempoMilissegundos =
//         tempo * 60 * 1000;


//     // =====================================================
//     // ESPERAR O TEMPO E BLOQUEAR
//     // =====================================================

//     setTimeout(() => {

//         console.log(`Tempo do PC ${computador} acabou`);

//         console.log(`Bloqueando ${computador}...`);


//         const comandoBloquear =
//             `"C:\\Program Files\\Veyon\\veyon-cli.exe" feature start ${computador} ScreenLock`;


//         exec(comandoBloquear, (erro, stdout, stderr) => {

//             if (erro) {

//                 console.log("erro ao bloquear:", erro);

//                 return;
//             }

//             console.log(`PC ${computador} bloqueado novamente`);

//         });

//     }, tempoMilissegundos);


//     // =====================================================
//     // RESPONDER AO SITE
//     // =====================================================

//     res.json({

//         sucesso: true,

//         mensagem:
//             `PC ${computador} desbloqueado por ${tempo} minutos`

//     });

// });


// export { desbloquear };