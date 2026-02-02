import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

app.post("/register", async (req, res) => {
  try {
    const student = {
      name: req.body.name,
      phone: req.body.phone,
      age: req.body.age,
      paymentType: req.body.paymentType,
      createdAt: new Date()
    };

    await client.connect();
    const db = client.db("EPI_DATA");
    const collection = db.collection("student registration");

    await collection.insertOne(student);

    res.json({ message: "✅ Alumno registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Error al guardar" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Servidor activo en puerto", PORT);
});
