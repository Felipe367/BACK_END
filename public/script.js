const API_URL = '/api/alunos';

const form = document.getElementById('aluno-form');
const tbody = document.getElementById('alunos-tbody');
const btnCancel = document.getElementById('btn-cancel');
const btnSave = document.getElementById('btn-save');

const inputId = document.getElementById('aluno-id');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputCurso = document.getElementById('curso');

let editandoId = null;

async function carregarAlunos() {
    try {
        const resposta = await fetch(API_URL);
        const alunos = await resposta.json();

        tbody.innerHTML = '';

        if (alunos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum aluno cadastrado.</td></tr>';
            return;
        }

        alunos.forEach(aluno => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.curso}</td>
                <td class="actions">
                    <button class="btn-icon btn-edit" onclick="iniciarEdicao(${aluno.id}, '${aluno.nome}', '${aluno.email}', '${aluno.curso}')">Editar</button>
                    <button class="btn-icon btn-delete" onclick="deletarAluno(${aluno.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (erro) {
        console.error('Erro ao buscar alunos:', erro);
        alert('Erro de conexão com o servidor!');
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const aluno = {
        nome: inputNome.value,
        email: inputEmail.value,
        curso: inputCurso.value
    };

    try {
        if (editandoId) {
            await fetch(`${API_URL}/${editandoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aluno)
            });
            editandoId = null;
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aluno)
            });
        }

        resetarFormulario();
        carregarAlunos();
    } catch (erro) {
        console.error('Erro ao salvar:', erro);
        alert('Erro ao salvar os dados no servidor!');
    }
});

async function deletarAluno(id) {
    if (!confirm(`Tem certeza que deseja excluir o aluno #${id}?`)) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        carregarAlunos();
    } catch (erro) {
        console.error('Erro ao deletar:', erro);
    }
}

function iniciarEdicao(id, nome, email, curso) {
    editandoId = id;
    inputId.value = id;
    inputNome.value = nome;
    inputEmail.value = email;
    inputCurso.value = curso;

    btnSave.textContent = 'Atualizar Aluno';
    btnCancel.style.display = 'block';
}

function resetarFormulario() {
    editandoId = null;
    form.reset();
    btnSave.textContent = 'Salvar Aluno';
    btnCancel.style.display = 'none';
}

btnCancel.addEventListener('click', resetarFormulario);

carregarAlunos();
