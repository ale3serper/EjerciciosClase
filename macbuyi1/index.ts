import express from "express";
import cors from "cors";
import axios from "axios";

const app = express()
const port = 3000;

app.use(cors())
app.use(express.json())

type Team = {
 id: number
 name: string
 city: string
 titles: number
}

let teams: Team[] = [

 { id: 1, name: "Lakers", city: "Los Angeles", titles: 17 },

 { id: 2, name: "Celtics", city: "Boston", titles: 17 },

];

app.get("/teams",(req,res)=>{
    res.json(teams);
})

app.get("/teams/:id",(req,res)=>{
    const id= Number(req.params.id);
    const resultado= teams.filter((n)=> n.id === id);

    resultado ? res.json(resultado) : res.status(404).send("Error. Equipo no encontrado")
})

app.post("/teams",(req,res)=>{
    const ultimoId= teams.at(-1) ?.id;
    const nuevoID= ultimoId? ultimoId +1 :0;

    const nuevoName= req.body.name;
    const nuevoCity= req.body.city;
    const nuevoTitles= req.body.titles;

    const nuevoEquipo : Team={
        id:nuevoID,
        name: nuevoName,
        city: nuevoCity,
        titles: nuevoTitles
    }
     if(typeof(nuevoName) === "string" && typeof(nuevoCity) === "string" && typeof(nuevoTitles) === "number"){
        teams.push(nuevoEquipo);
        res.status(201).json(nuevoEquipo);
    }
    else{
        const miErrorcito = {
            error: "Error, porque uno de los campos falla",
            body_error: nuevoEquipo
        }
        res.status(404).json(nuevoEquipo) // crear tipo apra representar el error correctamente
    }

})

app.delete("/teams/:id",(req,res)=>{
    const id= Number(req.params.id);
    const existe= teams.some((n)=> n.id==id);

    if(!existe){
        res.status(404).send("No existe ese equipo");
    }

    teams= teams.filter((n)=> n.id !== id)

    res.status(201).send("Personaje eliminado");

})


//APARTADO 2


app.listen(port, () => {
    
    console.log("Servidor en http://localhost:3000")
    
    setTimeout(testApi, 1000);
}
);

const testApi = async() => {

    try{
       //OBTENER TODOS LOS EQUIPOS 
      console.log("Estos son los equipos iniciales: ");
      const result1= await axios.get(`http://localhost:${port}/teams`)  ;
      console.log(result1.data);

      //CREAR UN NUEVO EQUIPO
      console.log("Insercion del nuevo equipo: ");
      const nuevoTeam= { name: "Bulls", city: "Chicago", titles: 6 };
      const result2= await axios.post(`http://localhost:${port}/teams`,nuevoTeam);

      //OBTENER TODOS LOS EQUIPOS DESPUES DEL POST
      console.log("Estos son los equipos despues del post: ");
      const result3= await axios.get(`http://localhost:${port}/teams`)  ;
      console.log(result3.data);

      //ELIMINAR ULTIMO EQUIPO
      const nuevoId = result2.data.id;
      console.log(`Eliminar el nuevo equipo:`);
      const result4 = await axios.delete(`http://localhost:${port}/teams/${nuevoId}`);
      console.log(result4.data);

      //OBTENER TODOS LOS EQUIPOS DESPUES DEL POST
      console.log("Estos son los equipos despues del delete: ");
      const result5= await axios.get(`http://localhost:${port}/teams`)  ;
      console.log(result5.data);



    }catch(err){
        if(axios.isAxiosError(err)){
            console.log("Error en la peticion: " + err.message)
       }
       else{
            console.log("Error general: " + err)
       }
    }
}
