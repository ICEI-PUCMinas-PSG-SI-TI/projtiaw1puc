
const API = "http://localhost:3001";

const formSugestao = document.getElementById("formSugestao");
const formSolicitacao = document.getElementById("formSolicitacao");
const modal = document.getElementById("modalDetalhes");

let servicos = [];

// ELEMENTOS DA NOVA FUNCIONALIDADE
const campoPesquisa = document.getElementById("pesquisaServico");
const campoCategoria = document.getElementById("filtroCategoria");
const textoResultado = document.getElementById("resultadoPesquisa");

// NORMALIZAR TEXTO PARA IGNORAR ACENTOS E MAIÚSCULAS
function normalizarTexto(texto) {
    return String(texto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// CARREGAR CATEGORIAS NO FILTRO
function carregarCategorias() {
    const categorias = [...new Set(
        servicos.map(function (servico) {
            return servico.categoria;
        })
    )];

    categorias.forEach(function (categoria) {
        const opcao = document.createElement("option");

        opcao.value = categoria;
        opcao.textContent = categoria;

        campoCategoria.appendChild(opcao);
    });
}

// PESQUISAR E FILTRAR SERVIÇOS
function filtrarServicos() {
    const termo = normalizarTexto(campoPesquisa.value.trim());
    const categoriaSelecionada = campoCategoria.value;

    const cards = document.querySelectorAll(".card-destaque");

    let quantidadeEncontrada = 0;

    cards.forEach(function (card) {

        const botao = card.querySelector(".botaoContratar");
        const idServico = botao.dataset.id;

        const servico = servicos.find(function (item) {
            return String(item.id) === String(idServico);
        });

        if (!servico) {
            card.hidden = true;
            return;
        }

        const nome = normalizarTexto(servico.nome);
        const descricao = normalizarTexto(servico.descricao);
        const categoria = normalizarTexto(servico.categoria);

        const correspondePesquisa =
            nome.includes(termo) ||
            descricao.includes(termo) ||
            categoria.includes(termo);

        const correspondeCategoria =
            !categoriaSelecionada ||
            servico.categoria === categoriaSelecionada;

        if (correspondePesquisa && correspondeCategoria) {
            card.hidden = false;
            quantidadeEncontrada++;
        } else {
            card.hidden = true;
        }
    });

    // MOSTRAR QUANTIDADE DE RESULTADOS
    if (quantidadeEncontrada === 0) {
        textoResultado.textContent =
            "Nenhum serviço encontrado. Tente outra pesquisa ou categoria.";

    } else if (quantidadeEncontrada === 1) {
        textoResultado.textContent = "1 serviço encontrado.";

    } else {
        textoResultado.textContent =
            quantidadeEncontrada + " serviços encontrados.";
    }
}

// EVENTOS DA PESQUISA E DO FILTRO
campoPesquisa.addEventListener("input", filtrarServicos);
campoCategoria.addEventListener("change", filtrarServicos);


// CARREGAR SERVIÇOS
async function carregarServicos() {
    try {
        const resposta = await fetch(API + "/servicos");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar serviços");
        }

        servicos = await resposta.json();

        // CARREGAR AS CATEGORIAS DO JSON
        carregarCategorias();

        // ATUALIZAR RESULTADOS
        filtrarServicos();

        // ATIVAR BOTÕES DE CONTRATAÇÃO
        const botoesContratar = document.querySelectorAll(".botaoContratar");

        botoesContratar.forEach(function (botao) {
            botao.addEventListener("click", function () {
                abrirDetalhes(botao.dataset.id);
            });
        });

    } catch (erro) {
        alert("Não foi possível carregar os serviços. Verifique se o JSON Server está ligado.");
    }
}


// ABRIR FORMULÁRIO
function abrirDetalhes(id) {
    const servico = servicos.find(function (item) {
        return String(item.id) === String(id);
    });

    if (!servico) {
        alert("Serviço não encontrado.");
        return;
    }

    formSolicitacao.reset();

    document.getElementById("idSolicitado").value = servico.id;

    document.getElementById("servicoEscolhido").textContent =
        "Serviço escolhido: " + servico.nome;

    document.getElementById("mensagemSolicitacao").textContent = "";

    modal.hidden = false;
}


// FECHAR FORMULÁRIO
document.getElementById("fecharModal").addEventListener("click", function () {
    modal.hidden = true;
});

modal.addEventListener("click", function (evento) {
    if (evento.target === modal) {
        modal.hidden = true;
    }
});


// ENVIAR SOLICITAÇÃO
async function enviarSolicitacao(evento) {
    evento.preventDefault();

    const solicitacao = {
        servicoId: document.getElementById("idSolicitado").value,
        servico: document.getElementById("servicoEscolhido").textContent.replace("Serviço escolhido: ", ""),
        nome: document.getElementById("nomeSolicitante").value.trim(),
        email: document.getElementById("emailSolicitante").value.trim(),
        telefone: document.getElementById("telefoneSolicitante").value.trim(),
        status: "Recebida"
    };

    try {
        const resposta = await fetch(API + "/solicitacoes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(solicitacao)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao enviar solicitação");
        }

        formSolicitacao.reset();

        document.getElementById("mensagemSolicitacao").textContent =
            "Solicitação enviada com sucesso! Nossa equipe recebeu seus dados e entrará em contato em breve.";

    } catch (erro) {
        document.getElementById("mensagemSolicitacao").textContent =
            "Não foi possível enviar a solicitação. Verifique se o JSON Server está ligado.";
    }
}


// ENVIAR SUGESTÃO
async function enviarSugestao(evento) {
    evento.preventDefault();

    const sugestao = {
        nome: document.getElementById("nomeSugestao").value.trim(),
        descricao: document.getElementById("descricaoSugestao").value.trim(),
        status: "Pendente"
    };

    try {
        const resposta = await fetch(API + "/sugestoes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sugestao)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao enviar sugestão");
        }

        formSugestao.reset();

        document.getElementById("mensagemSugestao").textContent =
            "Sugestão enviada com sucesso!";

    } catch (erro) {
        document.getElementById("mensagemSugestao").textContent =
            "Não foi possível enviar sua sugestão. Verifique se o JSON Server está ligado.";
    }
}


// EVENTOS DOS FORMULÁRIOS
formSugestao.addEventListener("submit", enviarSugestao);
formSolicitacao.addEventListener("submit", enviarSolicitacao);


// INICIAR PÁGINA
carregarServicos();
