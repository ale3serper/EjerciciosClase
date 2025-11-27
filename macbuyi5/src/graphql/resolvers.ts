import { IResolvers } from "@graphql-tools/utils"
import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";


const collectionName= "juegos";

export const resolvers: IResolvers = {
    Query: {
        getVideoGames: async()=>{
            const db= getDB();
            return db.collection(collectionName).find().toArray();
        },
        getVideoGame: async (_, {_id}: {_id: string})=>{
            const db= getDB();
            return db.collection(collectionName).findOne({_id: new ObjectId(_id)});
        }
    },

    Mutation: {
        addVideoGame: async (_, {name, releaseYear, platform}: {name: string, releaseYear: number,platform: string})=>{
            const db= getDB();
            const result= await db.collection(collectionName).insertOne({
                name, releaseYear,platform
            });

            return{
                _id: result.insertedId,
                name,
                platform,
                releaseYear
                
            }
        }
    }
}