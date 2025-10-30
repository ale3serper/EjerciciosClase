import { Db, MongoClient } from "mongodb";




let client: MongoClient;
let db: Db;

export const connectToMongoDB = async (): Promise<void> => {
    try{
        const urlMongo="mongodb+srv://ale3serper_db_user:EsOhP2e7zxD930Q8@cluster0.34cugvl.mongodb.net/?appName=Cluster0";
        client = new MongoClient(urlMongo);
        await client.connect();
        db = client.db("ClaseSistemas")
        console.log("Estas completamente in");
    }
    catch(err){
        console.error("Error a conectar a mongo");
        process.exit(1);
    }
};

export const getDB= ():Db=> db;