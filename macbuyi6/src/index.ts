import { ApolloServer } from "apollo-server";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { getUserFromToken } from "./auth";
import { connectToMongo } from "./db/mongo";




const start= async ()=>{
    await connectToMongo();

    const server=new ApolloServer({
        typeDefs,
        resolvers,
        context: async({req})=>{
            const token = req.headers.authorization || "";
            const user= token ? await getUserFromToken(token): null;
            return {user}
        }
    });

    await server.listen({port: 4069});
    console.log("gql esta a tope");
};

start().catch(err=>console.log("Error", err));