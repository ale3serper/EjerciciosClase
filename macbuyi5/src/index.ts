import { connectToMongoDB } from "./db/mongo";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server";


dotenv.config();


const start= async ()=>{
    await connectToMongoDB();
    
    const server= new ApolloServer({
        typeDefs,
        resolvers,
        context: ({req,res})=>{
            return {req};
        }
    });

    await server.listen({port: 4000});
    console.log("GraphQl esta a full");
};

start().catch((err)=>{
    console.error("Apollo server error: ", err)
})




