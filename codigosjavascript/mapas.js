const API = "http://localhost:3000/locais";
const lista = document.querySelector("#lista-locais");
const mapa = document.querySelector("#mapa");
const detalhes = document.querySelector("#detalhes");
const pesquisa = document.querySelector("#pesquisa");
const mensagem = document.querySelector("#mensagem");

let locais = [];

function mostrarDetalhes(local) {
    detalhes.replaceChildren();

    const titulo = document.createElement("h3");
    titulo.textContent = local.nome;

    const endereco = document.createElement("p");
    endereco.textContent = `${local.bairro} — ${local.cidade}`;

    const recursos = document.createElement("p");
    recursos.textContent = local.recursosAcessibilidade.length
        ? `Acessibilidade: ${local.recursosAcessibilidade.join(", ")}`
        : "Acessibilidade: informação não cadastrada.";

    detalhes.append(titulo, endereco, recursos);
}

function mostrarLocais() {
    const termo = pesquisa.value.toLowerCase();
    const encontrados = locais.filter((local) =>
        `${local.nome} ${local.bairro} ${local.cidade}`
            .toLowerCase()
            .includes(termo)
    );

    lista.replaceChildren();
    mapa.replaceChildren();

    encontrados.forEach((local) => {
        const botao = document.createElement("button");
        botao.className = "local";
        botao.textContent = `${local.nome} — ${local.bairro}, ${local.cidade}`;
        botao.addEventListener("click", () => mostrarDetalhes(local));
        lista.appendChild(botao);

        const marcador = document.createElement("button");
        marcador.className = "marcador";
        marcador.textContent = "📍";
        marcador.title = local.nome;
        marcador.style.left = `${local.posicaoX}%`;
        marcador.style.top = `${local.posicaoY}%`;
        marcador.addEventListener("click", () => mostrarDetalhes(local));
        mapa.appendChild(marcador);
    });

    mensagem.textContent = encontrados.length
        ? `${encontrados.length} local(is) encontrado(s).`
        : "Nenhum local encontrado.";
}

async function carregarLocais() {
    try {
        const resposta = await fetch(API);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os locais.");
        }

        locais = await resposta.json();
        mostrarLocais();
    } catch (erro) {
        mensagem.textContent = "Erro ao carregar. Verifique se o JSONServer está ligado.";
        console.error(erro);
    }
}

pesquisa.addEventListener("input", mostrarLocais);
carregarLocais();