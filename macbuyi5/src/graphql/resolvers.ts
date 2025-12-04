import { IResolvers } from "@graphql-tools/utils"
import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";
import { createUser, validateUser } from "../collections/users";
import { signToken } from "../auth";


const collectionName= "juegos";
const COLLECTION= "users";

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
            ...user

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
        },

        addGameToList: async(_,{videoGameId}: {videoGameId: string}, {user})=>{
            if (!user) throw new Error("Logeate chaval");

            const db= getDB();
            const videoGameToAdd= await db.collection(collectionName).findOne({_id: new ObjectId(videoGameId)});
            if (!videoGameToAdd)throw new Error("No existe chaval");

            await db.collection(COLLECTION).updateOne({_id: user._id}, {$addToSet: {listOfMyGames: videoGameToAdd._id}})

            const updateUser = await db.collection(COLLECTION).findOne({_id: user._id});
            if(!updateUser)if (!user) throw new Error("Usuario no encontrado");

            return {
                id: updateUser?._id.toString(),
                ...updateUser
            }
        }
    },

    User:{
        listOfMyGames: async (parent)=>{
            const db= getDB();
            const listOfVideoGameIds= parent.listOfMyGames as Array<string>|| [];

            const videoGamesListOfObjects= await db.collection(collectionName).find({
                _id: {$in: listOfVideoGameIds.map(id=> new ObjectId(id))}
            }).toArray();

            return videoGamesListOfObjects;
        }
    }
}