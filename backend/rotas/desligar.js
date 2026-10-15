import { Router } from "express";
import { exec } from "child_process";
import { ip } from "../ip.js";

const desligar = Router();

desligar.post("/desligar", (req, res)=>{

    console.log("pedido para desligar")

    // for (const i of ip){

        const comando = `"C:\\Program Files\\Veyon\\veyon-cli.exe" feature start ${ip} PowerDown`;
        

        exec(comando, (erro, stdout, stderr)=>{

            if(erro){

                console.log("Erro:", erro);

                return res.status(500).json({
                    sucesso: false,
                    mensagem: "erro ao desligar"
                });

            }

            console.log(stdout);

        });
    // }
    res.json({
        sucesso: true,
        mensagem: "desligado"
    })
});

export { desligar }