import { connectToMongoDB } from "./mongo";
import express from "express";
import rutillas from "./routes"
import dotenv from "dotenv";
dotenv.config();



connectToMongoDB();
const app = express();
app.use(express.json());


app.use("/api/Ejercicios", rutillas);

app.listen(3000, ()=> console.log("el API comenzo en el puerto 3000"));