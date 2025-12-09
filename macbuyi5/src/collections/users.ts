import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";
import bcrypt from "bcryptjs";


const userCollection="users";

export const createUser= async (username: string,email: string, password: string)=>{
    const db= getDB();

    const passwordEncriptada= await bcrypt.hash(password,10);

    const result= await db.collection(userCollection).insertOne({
       username,
        email, 
        pasword:passwordEncriptada
    });

    return result.insertedId.toString();    
};

export const validateUser= async (email: string, password: string)=>{
    const db= getDB();
    const user = await db.collection(userCollection).findOne({email});
   
    if(!user) return null;

    const comparacion = await bcrypt.compare(password, user.password);
    if(!comparacion) return null;

    return user;
};

export const findUserById= async (id: string)=>{
    const db= getDB();
    return await db.collection(userCollection).findOne({_id: new ObjectId(id)});

}