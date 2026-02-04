import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function getCollection() {
  await client.connect();
  const db = client.db("EPI_DATA");
  return db.collection("student registration");
}

// ✅ REGISTRAR ALUMNO
app.post("/register", async (req, res) => {
  try {
    const student = {
      name: req.body.name,
      phone: req.body.phone,
      age: req.body.age,
      paymentType: req.body.paymentType,
      createdAt: new Date()
    };

    const collection = await getCollection();
    await collection.insertOne(student);

    res.json({ message: "✅ Alumno registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Error al guardar" });
  }
});

// ✅ OBTENER TODOS LOS ALUMNOS
app.get("/students", async (req, res) => {
  try {
    const collection = await getCollection();
    const students = await collection
      .find({})
      .sort({ createdAt: -1 }) // más recientes primero
      .toArray();

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Error al obtener registros" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Servidor activo en puerto", PORT);
});
