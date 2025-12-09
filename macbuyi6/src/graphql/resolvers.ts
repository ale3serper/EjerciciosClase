import { IResolvers } from "@graphql-tools/utils";
import { crearRopa, createUser, validateUser } from "../collections/users";
import { signToken } from "../auth";
import { buyRopa, getRopa, getRopaFromIds } from "../collections/ropa";
import { getDB } from "../db/mongo";





export const resolvers: IResolvers= {
    Query:{
        me: async(_,__,{user})=>{
            if(!user) throw new Error("No estas logeado");
            return{
                _id: user._id.toString(),
                ...user
            }
        },
        clothes: async (_,{page,size})=>{
            return await getRopa(page,size);
        },
        clothing: async (_,{id})=>{
            return await getRopa(id);
        }
    },

    User: {
        clothes: async(parent)=>{
            return await getRopaFromIds(parent.clothes)

        }
    },

    Mutation:{
        register: async(_, {email, password})=>{
            const idCliente= await createUser(email, password);
            return signToken(idCliente);
        },
        login: async (_,{email, password})=>{
            const user= await validateUser(email, password);
            if(!user) throw new Error("Bad credentials");

            return signToken(user._id.toString());
        },
        addClothing: async(_,{name,size,color, price},{user})=>{
            if(!user) throw new Error("Tienes que estar logado");

            const result = await crearRopa(name,size,color,price);

            return result;

        },
        buyClothing: async(_,{clothingId},{user})=>{
            if(!user) throw new Error("Tienes que logearte");

            return await buyRopa(clothingId,user._id);
        }
    }
}