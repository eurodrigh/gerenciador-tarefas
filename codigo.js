const URL = "https://jsonplaceholder.typicode.com/todos";

document.addEventListener("DOMContentLoaded", mostrarListaTarefas);

function mostrarListaTarefas() {
    document.getElementById("lista-tarefas").style.display = "block";
    document.getElementById("listar-usuario").style.display = "none";
    document.getElementById("nova-tarefa").style.display = "none";
    carregarTarefas();
}

function mostrarListaPorUsuario() {
    document.getElementById("lista-tarefas").style.display = "none";
    document.getElementById("listar-usuario").style.display = "block";
    document.getElementById("nova-tarefa").style.display = "none";
}

function mostrarFormularioAdicionar() {
    document.getElementById("lista-tarefas").style.display = "none";
    document.getElementById("listar-usuario").style.display = "none";
    document.getElementById("nova-tarefa").style.display = "block";
}

function carregarTarefas(userId = null) {
    let url = URL; 

    if (userId) {
        url = `${URL}?userId=${userId}`; 
    }

    fetch(url)
        .then(res => res.json())
        .then(tarefas => {
            const lista = document.getElementById("tarefas");
            lista.innerHTML = ""; 
            tarefas.forEach(tarefa => adicionarItemLista(tarefa));
        })
        .catch(err => console.error("Erro ao carregar tarefas:", err));
}

function listarTarefasPorUsuario() {
    const userId = document.getElementById("id-usuario").value;

    if (!userId) {
        alert("Por favor, forneça o ID do usuário.");
        return;
    }

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`)
        .then(res => res.json())
        .then(tarefas => {
            const listaUsuario = document.getElementById("tarefas-usuario");
            listaUsuario.innerHTML = "";  
            if (tarefas.length === 0) {
                listaUsuario.innerHTML = "<li>Nenhuma tarefa encontrada para este usuário.</li>";
            } else {
                tarefas.forEach(tarefa => adicionarItemLista(tarefa, listaUsuario));
            }
        })
        .catch(err => console.error("Erro ao carregar tarefas do usuário:", err));
}

function adicionarTarefa() {
    const titulo = document.getElementById("titulo").value;
    const usuario = document.getElementById("usuario").value;
    const descricao = document.getElementById("descricao").value;

    if (!titulo || !usuario) {
        alert("Preencha todos os campos!");
        return;
    }

    const novaTarefa = {
        title: titulo,
        description: descricao || "",
        userId: usuario,
        completed: false
    };

    fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaTarefa)
    })
    .then(res => res.json())
    .then(data => {
        alert("Tarefa adicionada!");
        adicionarItemLista(data);
        document.getElementById("titulo").value = '';
        document.getElementById("descricao").value = '';
        document.getElementById("usuario").value = '';
        mostrarListaTarefas();
    })
    .catch(err => console.error("Erro ao adicionar tarefa:", err));
}

function adicionarItemLista(tarefa, lista = document.getElementById("tarefas")) {
    const li = document.createElement("li");
    li.innerHTML = `
        <strong>${tarefa.title}</strong>
        <p>${tarefa.description}</p>
        <button onclick="editarTarefa(${tarefa.id})">Editar</button>
        <button onclick="excluirTarefa(${tarefa.id})">Excluir</button>
    `;
    lista.appendChild(li);
}

function excluirTarefa(id) {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
        fetch(`${URL}/${id}`, { method: "DELETE" })
            .then(() => {
                alert("Tarefa excluída!");
                mostrarListaTarefas();
            })
            .catch(err => console.error("Erro ao excluir tarefa:", err));
    }
}

function editarTarefa(id) {
    fetch(`${URL}/${id}`)
        .then(res => res.json())
        .then(tarefa => {
            // Preencher o formulário com os dados da tarefa
            document.getElementById("titulo").value = tarefa.title;
            document.getElementById("descricao").value = tarefa.description;
            document.getElementById("usuario").value = tarefa.userId;

            // Alterar a função do botão de adicionar para salvar as alterações
            const btnAdicionar = document.querySelector("#nova-tarefa button");
            btnAdicionar.textContent = "Salvar Alterações";
            btnAdicionar.onclick = function() {
                salvarAlteracoes(id);
            };

            // Mostrar a seção de adicionar tarefa
            mostrarFormularioAdicionar();
        })
        .catch(err => console.error("Erro ao carregar tarefa para edição:", err));
}

function salvarAlteracoes(id) {
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const usuario = document.getElementById("usuario").value;

    if (!titulo || !usuario) {
        alert("Preencha todos os campos!");
        return;
    }

    const tarefaAtualizada = {
        title: titulo,
        description: descricao,
        userId: usuario,
        completed: false
    };

    fetch(`${URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarefaAtualizada)
    })
    .then(res => res.json())
    .then(() => {
        alert("Tarefa atualizada!");
        mostrarListaTarefas();
    })
    .catch(err => console.error("Erro ao atualizar tarefa:", err));

    // Resetando o botão de adicionar
    const btnAdicionar = document.querySelector("#nova-tarefa button");
    btnAdicionar.textContent = "Adicionar Tarefa";
    btnAdicionar.onclick = adicionarTarefa;

    // Limpa os campos e volta para a lista
    document.getElementById("titulo").value = '';
    document.getElementById("descricao").value = '';
    document.getElementById("usuario").value = '';
    mostrarListaTarefas();
}