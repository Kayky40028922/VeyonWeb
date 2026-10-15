import { Router } from "express";
import { exec } from "child_process";
import { ip } from "../ip.js";

const bloquear = Router();

bloquear.post("/bloquear", (req, res)=>{

    const ip = req.body.ip;

    console.log("pedido para bloquear", ip);

    // for (const i of ip){

        const comando = `"C:\\Program Files\\Veyon\\veyon-cli.exe" feature start ${ip} ScreenLock`;

        exec(comando, (erro, stdout, stderr)=>{

            if(erro){

                console.log("erro:",erro);

                return res.status(500).json({
                    sucesso: false,
                    mensagem: "erro ao bloquear"
                });
            }

            console.log(stdout);

        });
    // }
    res.json({
        sucesso: true,
        mensagem: `${ip} bloqueado`
    });
});

export  { bloquear }