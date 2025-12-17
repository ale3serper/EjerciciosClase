import { getDB } from "../db/mongo"
import bcrypt from "bcryptjs";
import { clothingCollection, userCollection } from "../utils";



export const createUser= async (email: string, password: string)=>{
    const db= getDB();

    const passEncriptada= await bcrypt.hash(password,10);

    const result= await db.collection(userCollection).insertOne({
        email,
        password: passEncriptada,
        clothes: []
    });

    return result.insertedId.toString();
}

export const validateUser= async (email: string, password: string)=>{
    const db= getDB();
    const user= await db.collection(userCollection).findOne({email});
    if(!user) return null;

    const passComparada= await bcrypt.compare(password,user.password);
    if(!passComparada) return null;

    return user;
}

