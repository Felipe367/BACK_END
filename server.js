const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function lerBancoDados() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ alunos: [] }, null, 2));
    return { alunos: [] };
  }

  const data = fs.readFileSync(DB_FILE, 'utf-8');

  if (!data || !data.trim()) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ alunos: [] }, null, 2));
    return { alunos: [] };
  }

  try {
    const db = JSON.parse(data);

    if (!db || typeof db !== 'object') {
      throw new Error('Banco inválido');
    }

    if (!Array.isArray(db.alunos)) {
      db.alunos = [];
    }

    return db;
  } catch (error) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ alunos: [] }, null, 2));
    return { alunos: [] };
  }
}

function salvarBancoDados(db) {
  const dadosValidos = db && typeof db === 'object' ? db : { alunos: [] };
  if (!Array.isArray(dadosValidos.alunos)) {
    dadosValidos.alunos = [];
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(dadosValidos, null, 2));
}

app.post('/api/alunos', (req, res) => {
  const { nome, email, curso } = req.body;

  if (!nome || !email || !curso) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  const db = lerBancoDados();
  const nextId = db.alunos.length > 0 ? Math.max(...db.alunos.map(a => a.id)) + 1 : 1;

  const novoAluno = {
    id: nextId,
    nome,
    email,
    curso
  };

  db.alunos.push(novoAluno);
  salvarBancoDados(db);

  return res.status(201).json(novoAluno);
});

app.get('/api/alunos', (req, res) => {
  const db = lerBancoDados();
  res.json(db.alunos);
});

app.put('/api/alunos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email, curso } = req.body;

  const db = lerBancoDados();
  const index = db.alunos.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Aluno não encontrado!' });
  }

  db.alunos[index] = { ...db.alunos[index], nome, email, curso };
  salvarBancoDados(db);

  return res.json(db.alunos[index]);
});

app.delete('/api/alunos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = lerBancoDados();
  const index = db.alunos.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Aluno não encontrado!' });
  }

  db.alunos.splice(index, 1);
  salvarBancoDados(db);

  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`👉 Acesse: http://localhost:${PORT}`);
  console.log(`📂 Banco de dados local ativo no arquivo db.json`);
});

