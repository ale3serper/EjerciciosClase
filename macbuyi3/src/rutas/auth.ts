import {Router} from "express";
import dotenv from "dotenv";
import {ObjectId} from "mongodb";
import { getDB } from "../mongo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();



const router = Router();

const SECRET = process.env.SECRET;



type User= {
    _id?: ObjectId,
    email: string,
    password: string

};
const coleccion= ()=> getDB().collection<User>("UserMana");

router.post("/register", async(req,res)=>{
try{

    const {email, password}= req.body as User;

    const users= await coleccion();
    const existing= await users.findOne({email});

    if(existing){
        return res.status(404).json({mesagge:"Ya existe un usuario con ese mail :("})
    };

    const passToEncripta= await bcrypt.hash(password,10);
    await users.insertOne({email, password: passToEncripta});
    res.status(201).json({mesagge: "Usuario creado chavalote"});


}
catch(err){
    res.status(500).json({message: err})
}
});


router.post("/login", async(req,res) =>{
try{

    const {email, password}= req.body as User;
    const users= await coleccion();

    const user= await users.findOne({email});

    if(!user){
        return res.status(404).json({mesagge: "No existe un usuario con ese mail :("})
    };

    const passEncriptaYSinEncripta= await bcrypt.compare(password, user.password);

    if(!passEncriptaYSinEncripta) return res.status(401).json({mesagge: "Contraseña incorrecta looser"});

    const token= jwt.sign({id: user._id?.toString(), email: user.email}, SECRET as string, {
        expiresIn: "1h"
    });
    res.json({mesagge: "Login hecho crack",token});
}
catch(err){
    res.status(500).json({message: err})
}
});

export default router;
