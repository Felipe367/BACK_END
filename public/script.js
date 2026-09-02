const API_URL = 'http://localhost:3000/api/alunos';

const form = document.getElementById('aluno-form');
const tbody = document.getElementById('alunos-tbody');
const btnCancel = document.getElementById('btn-cancel');
const btnSave = document.getElementById('btn-save');

// Campos do form
const inputId = document.getElementById('aluno-id');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputCurso = document.getElementById('curso');

// Estadp local
let editandoId = null;

// 1.LER (GET): Buscar dados do Backend e renderizar
// na tela
async function carregarAlunos() {
    try {
        const resposta = await fetch(API_URL);
        const alunos = await resposta.json();

         tbody.innerHTML = '';

        if(alunos.length === 0) {
            tbody.innerHTML = '<try><td colspan="5" style="text-align:center;">Nenhum alunos cadastrado.</td></try>';
            return;
        }
        alunos.forEach(aluno => {
            const tr = document.creatElement('tr');
            tr.innerHTML = `
                <td>#${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.curso}</td>
                <td class="action">
                    <button class="btn-icon btn-edit" onclick=
                    "iniciarEdicao(${aluno.id},
                     '${aluno.nome}','${aluno.email}',
                     '${aluno.curso}')">Editar</button>
                     <button class="btn-icon btn-delete"
                     onclick="deletarAluno(${aluno.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
            });
    } catch (erro) {
        console.error('Erro ao buscar alunos:', erro);
        alert('Erro de conexão com o servidor!');
    }
}
//2.CRIAR ou ATUALIZAR (POST / PUT)

