"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://localhost:3000/eventos";

    const eventsGrid = document.getElementById("events-grid");

    const totalEventosSpan = document.getElementById("total-eventos");

    const paginaAtualSpan = document.getElementById("pagina-atual");

    const buscaHeader = document.getElementById("busca-header");

    const buscaEventos = document.getElementById("busca-eventos");

    const filtroCategoria = document.getElementById("filtro-categoria");

    const filtroDatasInicial = document.getElementById("data-inicial");

    const filtroDatasFinal = document.getElementById("data-final");

    const checkboxesRecursos = Array.from(
        document.querySelectorAll('input[name="recurso"]')
    );

    const botaoLimpar = document.getElementById("limpar-filtros");

    const botaoAnterior = document.getElementById("pagina-anterior");

    const botaoProxima = document.getElementById("proxima-pagina");

    const modal = document.getElementById("modal-detalhes");

    const modalTitulo = document.getElementById("modal-titulo");

    const conteudoDetalhes = document.getElementById("conteudo-detalhes");

    const mensagemApi = document.getElementById("mensagem-api");


    const ITENS_POR_PAGINA = 4;

    let todosEventos = [];

    let paginaAtual = 1;


    // NORMALIZAR RECURSOS DE ACESSIBILIDADE

    function normalizarRecursos(recursos) {

        if (Array.isArray(recursos)) {
            return recursos;
        }

        if (typeof recursos === "string") {

            return recursos
                .split(",")
                .map(item => item.trim())
                .filter(Boolean);

        }

        return [];

    }


    // FORMATAR DATA

    function formatarData(dataISO, dataOriginal) {

        if (!dataISO) {
            return dataOriginal || "Data não informada";
        }

        const [ano, mes, dia] = dataISO.split("-").map(Number);

        const data = new Date(ano, mes - 1, dia);

        return data.toLocaleDateString("pt-BR");

    }


    // CRIAR ELEMENTOS HTML

    function criarElemento(tag, classe, texto) {

        const elemento = document.createElement(tag);

        if (classe) {
            elemento.className = classe;
        }

        if (texto !== undefined) {
            elemento.textContent = texto;
        }

        return elemento;

    }


    // ÍCONE DE ACESSIBILIDADE

    function obterBadge(recursos) {

        if (recursos.some(item =>
            item.toLowerCase().includes("libras"))) {

            return "🤟";

        }

        if (recursos.some(item =>
            item.toLowerCase().includes("legenda") ||
            item.toLowerCase().includes("cart"))) {

            return "💬";

        }

        if (recursos.some(item =>
            item.toLowerCase().includes("audiodescrição"))) {

            return "🔊";

        }

        return "♿";

    }


    // PREENCHER CATEGORIAS AUTOMATICAMENTE

    function preencherCategorias() {

        const categorias = [
            ...new Set(
                todosEventos
                    .map(evento => evento.categoria)
                    .filter(Boolean)
            )
        ].sort((a, b) => a.localeCompare(b, "pt-BR"));


        categorias.forEach(categoria => {

            const option = document.createElement("option");

            option.value = categoria;

            option.textContent = categoria;

            filtroCategoria.appendChild(option);

        });

    }


    // APLICAR FILTROS

    function obterEventosFiltrados() {

        const termo = (
            buscaEventos.value ||
            buscaHeader.value ||
            ""
        ).trim().toLocaleLowerCase("pt-BR");


        const categoria = filtroCategoria.value;


        const recursosSelecionados = checkboxesRecursos
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);


        const dataInicial = filtroDatasInicial.value;

        const dataFinal = filtroDatasFinal.value;


        return todosEventos.filter(evento => {

            const titulo = (evento.titulo || "").toLocaleLowerCase("pt-BR");

            const local = (evento.local || "").toLocaleLowerCase("pt-BR");


            const correspondeBusca =
                !termo ||
                titulo.includes(termo) ||
                local.includes(termo);


            const correspondeCategoria =
                !categoria ||
                evento.categoria === categoria;


            const recursosEvento = normalizarRecursos(
                evento.recursosAcessibilidade
            );


            const correspondeRecursos =
                recursosSelecionados.every(recurso =>
                    recursosEvento.includes(recurso)
                );


            const dataEvento = evento.dataISO || "";


            const correspondeDataInicial =
                !dataInicial ||
                (dataEvento && dataEvento >= dataInicial);


            const correspondeDataFinal =
                !dataFinal ||
                (dataEvento && dataEvento <= dataFinal);


            return (
                correspondeBusca &&
                correspondeCategoria &&
                correspondeRecursos &&
                correspondeDataInicial &&
                correspondeDataFinal
            );

        });

    }


    // ADICIONAR INFORMAÇÕES AO MODAL

    function adicionarLinhaDetalhe(container, rotulo, valor) {

        const p = document.createElement("p");

        const strong = document.createElement("strong");

        strong.textContent = `${rotulo}: `;

        p.append(
            strong,
            document.createTextNode(valor || "Não informado")
        );

        container.appendChild(p);

    }


    // ABRIR DETALHES DO EVENTO

    function abrirDetalhes(evento) {

        modalTitulo.textContent = evento.titulo || "Detalhes do evento";

        conteudoDetalhes.replaceChildren();


        adicionarLinhaDetalhe(
            conteudoDetalhes,
            "Categoria",
            evento.categoria
        );


        adicionarLinhaDetalhe(
            conteudoDetalhes,
            "Data",
            `${formatarData(evento.dataISO, evento.data)} ${evento.horario || ""}`
        );


        adicionarLinhaDetalhe(
            conteudoDetalhes,
            "Local",
            evento.local
        );


        adicionarLinhaDetalhe(
            conteudoDetalhes,
            "Descrição",
            evento.descricao
        );


        adicionarLinhaDetalhe(
            conteudoDetalhes,
            "Recursos de acessibilidade",
            normalizarRecursos(evento.recursosAcessibilidade).join(", ")
        );


        if (typeof modal.showModal === "function") {

            modal.showModal();

        } else {

            alert(
                `${evento.titulo}\n${evento.local}`
            );

        }

    }


    // CRIAR CARD DO EVENTO

    function criarCard(evento) {

        const recursos = normalizarRecursos(
            evento.recursosAcessibilidade
        );


        const card = criarElemento("article", "card");


        const imagem = criarElemento("div", "image-placeholder");

        imagem.setAttribute(
            "aria-label",
            "Espaço reservado para imagem do evento"
        );


        imagem.appendChild(
            criarElemento(
                "span",
                "resource-badge",
                obterBadge(recursos)
            )
        );


        imagem.appendChild(
            criarElemento("div", "cam-icon", "▧")
        );


        imagem.appendChild(
            criarElemento("p", "", "IMAGEM DO EVENTO")
        );


        const corpo = criarElemento("div", "card-body");


        corpo.appendChild(
            criarElemento(
                "h3",
                "",
                evento.titulo || "Evento sem título"
            )
        );


        const data = `${formatarData(evento.dataISO, evento.data)}${evento.horario ? ", " + evento.horario : ""}`;


        const linhas = [
            ["Data", data],
            ["Local", evento.local],
            ["Categoria", evento.categoria]
        ];


        linhas.forEach(([rotulo, valor]) => {

            adicionarLinhaDetalhe(corpo, rotulo, valor);

        });


        const listaRecursos = criarElemento("div", "resource-list");


        recursos.forEach(recurso => {

            listaRecursos.appendChild(
                criarElemento("span", "resource-chip", recurso)
            );

        });


        corpo.appendChild(listaRecursos);


        const botao = criarElemento(
            "button",
            "btn-details",
            "Ver Detalhes"
        );


        botao.type = "button";

        botao.addEventListener("click", () => {
            abrirDetalhes(evento);
        });


        card.append(imagem, corpo, botao);

        return card;

    }


    // EXIBIR EVENTOS NA TELA

    function renderizarEventos() {

        const eventosFiltrados = obterEventosFiltrados();


        const totalPaginas = Math.max(
            1,
            Math.ceil(eventosFiltrados.length / ITENS_POR_PAGINA)
        );


        paginaAtual = Math.min(paginaAtual, totalPaginas);


        const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;


        const eventosDaPagina = eventosFiltrados.slice(
            inicio,
            inicio + ITENS_POR_PAGINA
        );


        eventsGrid.replaceChildren();


        if (eventosDaPagina.length === 0) {

            eventsGrid.appendChild(
                criarElemento(
                    "p",
                    "empty-state",
                    "Nenhum evento encontrado. Ajuste ou limpe os filtros."
                )
            );

        } else {

            eventosDaPagina.forEach(evento => {

                eventsGrid.appendChild(criarCard(evento));

            });

        }


        totalEventosSpan.textContent =
            `${eventosFiltrados.length} evento(s) encontrado(s)`;


        paginaAtualSpan.textContent =
            `Página ${paginaAtual} de ${totalPaginas}`;


        botaoAnterior.disabled = paginaAtual <= 1;

        botaoProxima.disabled = paginaAtual >= totalPaginas;

    }


    // SINCRONIZAR AS DUAS BUSCAS

    function sincronizarBuscas(origem, destino) {

        destino.value = origem.value;

        paginaAtual = 1;

        renderizarEventos();

    }


    // LIMPAR FILTROS

    function limparFiltros() {

        buscaHeader.value = "";

        buscaEventos.value = "";

        filtroCategoria.value = "";

        filtroDatasInicial.value = "";

        filtroDatasFinal.value = "";


        checkboxesRecursos.forEach(checkbox => {

            checkbox.checked = false;

        });


        mensagemApi.hidden = true;

        paginaAtual = 1;

        renderizarEventos();

    }


    // VALIDAR INTERVALO DE DATAS

    function validarIntervaloDatas() {

        if (
            filtroDatasInicial.value &&
            filtroDatasFinal.value &&
            filtroDatasInicial.value > filtroDatasFinal.value
        ) {

            mensagemApi.hidden = false;

            mensagemApi.textContent =
                "A data inicial não pode ser posterior à data final.";

            return false;

        }


        mensagemApi.hidden = true;

        mensagemApi.textContent = "";

        return true;

    }


    // CARREGAR EVENTOS DA API REST

    async function carregarEventosDoServidor() {

        try {

            const resposta = await fetch(API_URL);


            if (!resposta.ok) {

                throw new Error(
                    `A API retornou o status ${resposta.status}.`
                );

            }


            const dados = await resposta.json();


            if (!Array.isArray(dados)) {

                throw new Error(
                    "A resposta da API não contém uma lista de eventos."
                );

            }


            todosEventos = dados.map(evento => ({

                ...evento,

                recursosAcessibilidade: normalizarRecursos(
                    evento.recursosAcessibilidade
                )

            }));


            preencherCategorias();

            renderizarEventos();


        } catch (erro) {

            console.error("Erro ao carregar eventos:", erro);


            totalEventosSpan.textContent =
                "Não foi possível carregar os eventos";


            eventsGrid.replaceChildren(
                criarElemento(
                    "p",
                    "empty-state",
                    "Não foi possível conectar à API. Inicie o JSON Server pelo terminal e atualize esta página."
                )
            );


            mensagemApi.hidden = false;

            mensagemApi.textContent =
                `Falha na conexão com ${API_URL}. ${erro.message}`;

        }

    }


    // EVENTOS DOS CAMPOS DE BUSCA

    buscaHeader.addEventListener("input", () => {

        sincronizarBuscas(buscaHeader, buscaEventos);

    });


    buscaEventos.addEventListener("input", () => {

        sincronizarBuscas(buscaEventos, buscaHeader);

    });


    // EVENTOS DOS FILTROS

    filtroCategoria.addEventListener("change", () => {

        paginaAtual = 1;

        renderizarEventos();

    });


    checkboxesRecursos.forEach(checkbox => {

        checkbox.addEventListener("change", () => {

            paginaAtual = 1;

            renderizarEventos();

        });

    });


    [filtroDatasInicial, filtroDatasFinal].forEach(campo => {

        campo.addEventListener("change", () => {

            if (validarIntervaloDatas()) {

                paginaAtual = 1;

                renderizarEventos();

            }

        });

    });


    // BOTÃO LIMPAR

    botaoLimpar.addEventListener("click", limparFiltros);


    // PAGINAÇÃO

    botaoAnterior.addEventListener("click", () => {

        if (paginaAtual > 1) {

            paginaAtual--;

            renderizarEventos();

        }

    });


    botaoProxima.addEventListener("click", () => {

        paginaAtual++;

        renderizarEventos();

    });


    // FECHAR JANELA DE DETALHES

    document.getElementById("fechar-modal")
        .addEventListener("click", () => modal.close());


    document.getElementById("fechar-modal-rodape")
        .addEventListener("click", () => modal.close());


    modal.addEventListener("click", evento => {

        if (evento.target === modal) {

            modal.close();

        }

    });


    // INICIAR APLICAÇÃO

    carregarEventosDoServidor();

});
