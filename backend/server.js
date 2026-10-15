import express from "express";
import { desligar } from "./rotas/desligar.js";
import { bloquear } from "./rotas/bloquear.js";
import { desbloquear } from "./rotas/desbloquear.js";
import { desbloquearPorTempo } from "./rotas/desbloquearPorTempo.js";

const app = express();

app.use(express.json());

app.use(express.static("C:/Users/ALUNO/Documents/VeyonWeb"));

app.use(desligar);
app.use(bloquear);
app.use(desbloquear);
app.use(desbloquearPorTempo);

app.listen(3000, ()=>{
    console.log("rodando...");
});