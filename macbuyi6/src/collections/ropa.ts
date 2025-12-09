import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo"
import { clothingCollection, userCollection } from "../utils";





export const getRopa= async(page?: number, size?:number)=>{
    const db= getDB();

    page= page || 1;
    size= size || 10;

    return await db.collection(clothingCollection).find().skip((page-1)*size).limit(size).toArray();
}

export const getRopaPorId= async(id: string)=>{
    const db= getDB();

    return await db.collection(clothingCollection).findOne({_id: new ObjectId(id)})
}

export const crearRopa= async(name: string, size: string, color: string, price: number)=>{
    const db= getDB();

    const result= await db.collection(clothingCollection).insertOne({
        name,
        size,
        color,
        price
    });

    const newClothing= await getRopaPorId(result.insertedId.toString());

    return newClothing;
};

export const buyRopa= async (idRopa: string, userId: string)=>{
    const db= getDB();

    const ropaAnadir= await getRopaPorId(idRopa);

    if(!ropaAnadir) return new Error("Esa prenda no existe");

    await db.collection(userCollection).updateOne({_id: new ObjectId(userId)},{
        $addToSet: {clothes: idRopa}
    });

    const updatedUser= await db.collection(userCollection).findOne({_id: new ObjectId(userId)});

    return updatedUser;

}

export const getRopaFromIds= async(ids: Array<string>)=>{
    
    const db= getDB();
    const idsParaMongo= ids.map(x=> new ObjectId(x));

    return db.collection(clothingCollection).find({
        _id:{$in: idsParaMongo}
    }).toArray();
}
