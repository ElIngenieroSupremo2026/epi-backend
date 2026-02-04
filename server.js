import express from "express";
import { MongoClient, ObjectId } from "mongodb";
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

// 🔹 REGISTRAR ALUMNO
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
    res.status(500).json({ message: "❌ Error al guardar" });
  }
});

// 🔹 OBTENER ALUMNOS
app.get("/students", async (req, res) => {
  try {
    const collection = await getCollection();
    const students = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "❌ Error al obtener registros" });
  }
});

// 🔥 BORRAR ALUMNO (OPERACIÓN CLASIFICADA)
app.delete("/students/:id", async (req, res) => {
  try {
    const collection = await getCollection();
    await collection.deleteOne({ _id: new ObjectId(req.params.id) });

    res.json({ message: "🗑️ Alumno eliminado" });
  } catch (err) {
    res.status(500).json({ message: "❌ Error al eliminar" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Servidor activo en puerto", PORT);
});
