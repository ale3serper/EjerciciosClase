
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getDB } from "./db/mongo";
import { ObjectId } from "mongodb";

dotenv.config();

const userCollection="users";

export type TokenPayload={
    userId: string;
}

const SECRET= process.env.SECRET;

export const signToken= (userId: string)=>{
    return jwt.sign({userId},SECRET!, {expiresIn: "1h"});
}

export const verifyToken= (token: string): TokenPayload|null=> {
    try{
        return jwt.verify(token, SECRET!) as TokenPayload;

    }catch{
        return null;
    }
};

export const getUserFromToken= async (token: string)=>{
    const payload= verifyToken(token);
    if(!payload) return null;

    const db= getDB();
    return  await db.collection(userCollection).findOne({
        _id: new ObjectId(payload.userId)
    });
    
}