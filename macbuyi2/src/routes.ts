import {Router} from "express";
import { getDB } from "./mongo";


const router = Router();
const coleccion = () => getDB().collection("Ejercicios");

router.get("/", async(req,res)=>{
    try{
        const ejercicios = await coleccion().find().toArray();
        res.json(ejercicios);
    }catch(err){
        res.status(404).json({error: "Esta muy vacio "});
    }
});

export default router;