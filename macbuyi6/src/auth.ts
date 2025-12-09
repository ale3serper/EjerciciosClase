import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { getDB } from "./db/mongo";
import { userCollection } from "./utils";
import { ObjectId } from "mongodb";

dotenv.config();
const SECRET= process.env.SECRET;

export const signToken= (userId: string)=> {
    

    if(!SECRET) throw new Error ("No secret to produce token");
    return jwt.sign({userId},SECRET!, {expiresIn: "1h"});
}


export const verifyToken= (token: string)=>{
    try{
        if(!SECRET) throw new Error ("No secret to decode token");
        return jwt.verify(token,SECRET) as {userId: string};
    }catch(err){
        return null;
    }
}

export const getUserFromToken= async (token: string)=>{
    const payload= verifyToken(token);

    if(!payload) return null;

    const db= getDB();
    return await db.collection(userCollection).findOne({
        _id: new ObjectId(payload.userId)
    });
}