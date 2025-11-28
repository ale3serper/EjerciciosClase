import { IResolvers } from "@graphql-tools/utils"
import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";
import { createUser, validateUser } from "../collections/users";
import { signToken } from "../auth";


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
        },
        me: async (_,__, {user} )=>{
           if(!user) return null;
           
           return {
            id: user._id.toString(),
            email: user.email

           }

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
        },
        register: async(_, {email, password}: {email: string,password:string })=>{
            const userId= await createUser(email,password);
            return signToken(userId);
        },
        login: async(_, {email, password}: {email: string,password:string })=>{
            const user= await validateUser(email,password);
            if(!user) throw new Error("El login esta mal hecho");

            return signToken(user._id.toString());
        }
    }
}