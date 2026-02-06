
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());



const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let collection;

async function iniciar() {
  try {
    await client.connect();
    console.log("✅ Conectado ao MongoDB");

    // 🔥 AQUI A CORREÇÃO
    const db = client.db("convite");
    collection = db.collection("aniversario_agnes");


    const PORT = process.env.PORT || 3000; // Render define PORT
    app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });


  } catch (err) {
    console.error("Erro ao conectar:", err);
  }
}

iniciar();

app.post("/rsvp", async (req, res) => {
  try {
    if (!req.body.nome) {
      return res.status(400).send("Nome não enviado");
    }

    await collection.insertOne({
      nome: req.body.nome,
      data_confirmacao: new Date()
    });

    console.log("🎉 RSVP salvo:", req.body.nome);
    res.send("Salvo com sucesso");

  } catch (err) {
    console.error("❌ Erro ao salvar:", err);
    res.status(500).send("Erro no servidor");
  }
});

app.get("/", (req, res) => {
  res.send("Backend rodando! 🎉");
});

