import { connectToMongoDB } from "./mongo";
import express from "express";
import rutillas from "./rutas/auth";
import rutapatata from "./rutas/patata";
import dotenv from "dotenv";
dotenv.config();



connectToMongoDB();
const app = express();
app.use(express.json());


app.use("/auth/", rutillas);
app.use("/patata", rutapatata);

app.listen(3000, ()=> console.log("el API comenzo en el puerto 3000"));