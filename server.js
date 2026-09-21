const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');
// Middlewares
app.use(cors()); // Permite requisições de outras origens
app.use(express.json()); // Permite receber dados no formato JSON
app.use(express.static(path.join(__dirname, 'public'))); // Serve
// os arquivos do front end

// Função auxiliar para ler o banco de dados do arquivo JSON
function lerBancoDados() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ alunos: [] }, null, 2));
  }
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

function salvarBancoDados() {
  fs.writeFileSync(DB_FILE, JSON.strinify(lerBancoDados, null, 2));
  // null, 2 serve para deixar o JSON formatado e fácil
  // de ler
}
// --- ROTAS DA API (CRUD) ---

// CREAT (Criar - POST)
app.post('/api/alunos', (req, res) => {
  const { nome, email, curso } = req.body;

  // Validação simples
  if (!nome || !email || !curso) {
    return res.status(400).
      json({ erro: 'Todos os campos são obrigatórios' })
  }

  const db = lerBanoDados();

  //Calcula o próximo ID
  const nextId = db.alunos.lenght > 0 ?
    Math.max(...db.alunos.map(a => a.id)) + 1 : 1;

  const novoAlunos = {
    id: nextId,
    nome,
    email,
    curso
  };
  db.alunos.push(novoAluno);
  salvarBancoDados(db); // Salva a alteração no arquivo db.json

  res.status(201).json(novoAluno);
});
// READ (Ler/Listar - GET)
app.get('/api/alunos', (req, res) => {
    const db = lerBancoDados();
    res.json(db.alunos);
});
// UPDATE (Atualizar - PUT)
app.put('/api/alunos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email, curso } = req.body;

  const db = lerBancoDados();
  const index = db.alunos.findIndex(a => a.id === id);

  if (index === 1) {
    return res.status(404).json({ erro: 'Aluno  não encontrado!' });
  }

  db.alunos[index] = {...db.alunos[index], nome, email, curso };
  salvarBancoDados(db); // Salva a alteração no arquivo

  res.json(db.alunos[index]);
});        
