import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv"; 


dotenv.config();

let client: MongoClient;
let miBase: Db;


export const connectToMongoDB = async (): Promise<void> => {
    try{
        const urlMongo=`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.CLUSTER}.34cugvl.mongodb.net/?appName=${process.env.CLUSTER_NAME}`;
        client = new MongoClient(urlMongo);
        await client.connect();
        miBase = client.db("VideoGames")
        console.log("Estas completamente in");
    }
    catch(err){
        console.error("Error a conectar a mongo",err);
        process.exit(1);
    }
};

export const getDB= ():Db=> miBase;