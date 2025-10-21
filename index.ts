import express from 'express';
import cors from 'cors';
import axios from 'axios';

type LD = {
    id: number,
    filmName: string,
    rotationType: "CAV" | "CLV",
    region: string,
    lengthMinutes: number,
    videoFormat: "NTSC" | "PAL"
}

let LDs: LD[] = [
    {
        id: 1,
        filmName: "Grease",
        rotationType: "CLV",
        region: "All",
        lengthMinutes: 110,
        videoFormat: "NTSC"
    },
    {
        id: 2,
        filmName: "Barbie",
        rotationType: "CAV",
        region: "All",
        lengthMinutes: 120,
        videoFormat: "NTSC"
    }
];

const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json());

app.get("/ld", (req, res) => {
    res.json(LDs);
});

//Mostrar una peli por su ID
//Buscar por ID. Si no existe, devolver 404 con { message: "Peli no encontrada" }.
app.get("/ld/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const ld = LDs.find(t => t.id === id);
    if (ld) {
        res.json(ld);
    } else {
        res.status(404).json({ message: "Pelicula no encontrada" });
    }
});

//Crear una nueva pelicula
//Recibir filmName,rotationType, region, lengthMinutes, videoFormat en el body. 
// Generar un id nuevo y añadirlo al array.
app.post("/ld", (req, res) => {
    const { filmName, rotationType, region, lengthMinutes, videoFormat } = req.body;
    const newLD: LD = {
        id: Date.now(),
        filmName,
        rotationType,
        region, 
        lengthMinutes, 
        videoFormat
    };
    LDs.push(newLD);
    res.status(201).json(newLD);
});

app.delete("/ld/:id", (req, res) => {
    try{
        const id = req.params.id;
        const PelisSinEliminada = LDs.filter(p=>!(p.id.toString()===id)); 
        LDs = PelisSinEliminada;
        res.json({message: "Pelicula eliminada correctamente"});
    }
    catch(error){
        res.status(404).json({message: "Error al eliminar la pelicula"});
    }
}); 

app.listen(3000, () => 
    console.log("Servidor en http://localhost:3000")
);

const testAPI= async (id:number)=>{
    const mostrareLDs= await axios.get("http://localhost:3000/ld");

    const mostratporID = await axios.get("http://localhost:3000/ld/"+id);

    const crearLD=await axios.post("http://localhost:3000/ld",{id:12, filmName:"El rey leon", rotationType:"CLV", region:"All", lengthMinutes:120, videoFormat:"NTSC"});

    const mostrartrascrear= await axios.get("http://localhost:3000/ld");

    const eliminar= axios.delete("http://localhost:3000/ld/"+id);
    const mostrartraseliminar= await axios.get("http://localhost:3000/ld");

    return {todos:mostrareLDs.data, uno: mostratporID.data, creado:mostrartrascrear.data, eliminado: mostrartraseliminar.data};
}
setTimeout(async () => {
  const resultado = await testAPI(1);
  console.log(resultado);

}, 1000);
