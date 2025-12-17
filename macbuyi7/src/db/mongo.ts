import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
import { dbName } from "../utils";



dotenv.config();

let client: MongoClient;
let db: Db;


export const connectToMongo= async ()=>{
    try{
        const urlMongo=process.env.MONGO_URL;
        if(!urlMongo) throw new Error("No has metido la url de mongo mongolo");

        client= new MongoClient(urlMongo);
        await client.connect();

        db= client.db(dbName);
        console.log("Estas conectado a Mongo");


    }catch(err){
        console.log("Error de Mongo",err);
    }
};


export const getDB= ():Db =>db;