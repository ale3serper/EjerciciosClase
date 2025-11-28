import { connectToMongoDB } from "./db/mongo";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server";
import { getUserFromToken } from "./auth";


dotenv.config();


const start= async ()=>{
    await connectToMongoDB();
    
    const server= new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({req})=>{
            const authHeader= req.headers.authorization;
            const user= authHeader ? await getUserFromToken(authHeader!): null;

            return{user};
        }
    });

    await server.listen({port: 4000});
    console.log("GraphQl esta a full");
};

start().catch((err)=>{
    console.error("Apollo server error: ", err)
})




