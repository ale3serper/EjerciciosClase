import { Db, MongoClient } from "mongodb";






let client: MongoClient;
let db: Db;

export const connectToMongoDB = async (): Promise<void> => {
    try{
        const urlMongo=`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.CLUSTER}.34cugvl.mongodb.net/?appName=${process.env.CLUSTER_NAME}`;
        client = new MongoClient(urlMongo);
        await client.connect();
        db = client.db("auth")
        console.log("Estas completamente in");
    }
    catch(err){
        console.error("Error a conectar a mongo");
        process.exit(1);
    }
};

export const getDB= ():Db=> db;