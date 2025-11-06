import {Router} from "express";
import { getDB } from "./mongo";
import { ObjectId } from "mongodb";


const router = Router();
const coleccion = () => getDB().collection("Ejercicios");

router.get("/", async(req,res)=>{
    try{
        //const queryYear= req.query?.year;
        const newer= req.query?.newer;


        const ejercicios = await coleccion().find(newer ? {year: {$gt : newer}}: {}).toArray();
        res.json(ejercicios);
    }catch(err){
        res.status(404).json({error: "Esta muy vacio "});
    }
});

router.post("/",async (req,res) =>{
try{
    const result = await coleccion().insertOne(req.body);
    const resultObject = await coleccion().findOne({_id: result.insertedId})
    res.status(201).json(resultObject);

}catch(err){
    res.status(404).json({error: "Chaval no has metido nada "});
}
});

router.get("/:id", async(req,res)=>{
try{

    const result = await coleccion().findOne({ _id: new ObjectId(req.params.id)})

    result ? res.status(201).json(result) : res.status(404).json({message: "No existe ese id"})


}catch(err){
    res.status(404).json({error: "Chaval cagaste"});
}
});

router.put("/:id", async(req,res)=>{
    try{
        const result= await coleccion().updateOne(
            { _id: new ObjectId(req.params.id) },
            {$set: req.body});
        res.json(result);

    }catch(err){
        res.status(404).json({error: "Chaval cagaste "});
    }
});

router.delete("/:id", async (req,res)=>{
    try{
        const result= await coleccion().deleteOne({
            _id : new ObjectId(req.params.id)
        });

       result && res.status(204).json({message: "Objeto con id " + req.params.id + " Eliminado"});

    }catch(err){
        res.status(404).json({error: "Chaval cagaste "});
    }
});

router.post("/many",async (req,res)=>{
     try{
        const result= await coleccion().insertMany(req.body.ejercicios);
       res.status(201).json(result);

    }catch(err){
        res.status(404).json({error: "Chaval cagaste "});
    }
});




export default router;