
const API = "../json/servicos.json";

const lista = document.getElementById("listaServicos");
const formulario = document.getElementById("formServico");

let servicos = [];
let idsOriginais = [];


// CARREGAR SERVIÇOS

async function carregarServicos() {
    try {
        const resposta = await fetch(API);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar o JSON.");
        }

        const dados = await resposta.json();

        servicos = dados.servicos || [];
        idsOriginais = servicos.map(servico => String(servico.id));

        const extras = JSON.parse(
            localStorage.getItem("servicosExtras") || "[]"
        );

        const excluidos = JSON.parse(
            localStorage.getItem("servicosExcluidos") || "[]"
        );

        const alteracoes = JSON.parse(
            localStorage.getItem("servicosAlterados") || "{}"
        );

        servicos = servicos
            .filter(servico =>
                !excluidos.includes(String(servico.id))
            )
            .map(servico =>
                alteracoes[String(servico.id)] || servico
            );

        servicos = [...servicos, ...extras];

        mostrarServicos();

    } catch (erro) {
        console.error("Erro ao carregar os serviços:", erro);
    }
}


// MOSTRAR SERVIÇOS

function mostrarServicos() {
    lista.innerHTML = "";

    if (servicos.length === 0) {
        lista.innerHTML = "<p>Ainda não há serviços cadastrados.</p>";
        return;
    }

    servicos.forEach(servico => {
        const card = document.createElement("div");
        card.className = "servico";

        const titulo = document.createElement("h3");
        titulo.textContent = servico.nome;

        const descricao = document.createElement("p");
        descricao.textContent = servico.descricao;

        const categoria = document.createElement("p");
        categoria.textContent = "Categoria: " + servico.categoria;

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Editar";
        botaoEditar.addEventListener("click", () => {
            editarServico(servico.id);
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.addEventListener("click", () => {
            excluirServico(servico.id);
        });

        card.append(
            titulo,
            descricao,
            categoria,
            botaoEditar,
            botaoExcluir
        );

        lista.appendChild(card);
    });
}


// CADASTRAR E ATUALIZAR SERVIÇOS

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const categoria = document.getElementById("categoria").value;

    if (!nome || !descricao || !categoria) {
        alert("Preencha todos os campos!");
        return;
    }

    const servico = {
        id: id || String(Date.now()),
        nome,
        descricao,
        categoria
    };

    let extras = JSON.parse(
        localStorage.getItem("servicosExtras") || "[]"
    );

    let alteracoes = JSON.parse(
        localStorage.getItem("servicosAlterados") || "{}"
    );

    if (id) {
        const indice = servicos.findIndex(
            item => String(item.id) === String(id)
        );

        if (indice === -1) return;

        servicos[indice] = servico;

        if (idsOriginais.includes(String(id))) {
            alteracoes[String(id)] = servico;
        } else {
            extras = extras.map(item =>
                String(item.id) === String(id) ? servico : item
            );
        }

    } else {
        servicos.push(servico);
        extras.push(servico);
    }

    localStorage.setItem("servicosExtras", JSON.stringify(extras));
    localStorage.setItem("servicosAlterados", JSON.stringify(alteracoes));

    mostrarServicos();
    formulario.reset();
    document.getElementById("id").value = "";

    formulario.querySelector('button[type="submit"]').textContent =
        "Cadastrar serviço";
});


// EDITAR SERVIÇO

function editarServico(id) {
    const servico = servicos.find(
        item => String(item.id) === String(id)
    );

    if (!servico) return;

    document.getElementById("id").value = servico.id;
    document.getElementById("nome").value = servico.nome;
    document.getElementById("descricao").value = servico.descricao;
    document.getElementById("categoria").value = servico.categoria;

    formulario.querySelector('button[type="submit"]').textContent =
        "Salvar alterações";

    formulario.scrollIntoView({ behavior: "smooth" });
}


// EXCLUIR SERVIÇO

function excluirServico(id) {
    if (!confirm("Tem certeza de que deseja excluir este serviço?")) {
        return;
    }

    const idTexto = String(id);

    servicos = servicos.filter(
        item => String(item.id) !== idTexto
    );

    let extras = JSON.parse(
        localStorage.getItem("servicosExtras") || "[]"
    );

    let excluidos = JSON.parse(
        localStorage.getItem("servicosExcluidos") || "[]"
    );

    let alteracoes = JSON.parse(
        localStorage.getItem("servicosAlterados") || "{}"
    );

    extras = extras.filter(
        item => String(item.id) !== idTexto
    );

    if (idsOriginais.includes(idTexto)) {
        if (!excluidos.includes(idTexto)) {
            excluidos.push(idTexto);
        }

        delete alteracoes[idTexto];
    }

    localStorage.setItem("servicosExtras", JSON.stringify(extras));
    localStorage.setItem("servicosExcluidos", JSON.stringify(excluidos));
    localStorage.setItem("servicosAlterados", JSON.stringify(alteracoes));

    mostrarServicos();
}


// INICIAR

carregarServicos();
