function mostrarVagas() {

    const vagas = [
        "Intérprete de Libras",
        "Aux. Administrativo",
        "Designer UX/UI"
    ];

    let texto = "<h3>Vagas Disponíveis</h3><ul>";

    vagas.forEach(vaga => {
        texto += `<li>${vaga}</li>`;
    });

    texto += "</ul>";

    document.getElementById("resultado").innerHTML = texto;
}

function candidatar() {

    const nome = prompt("Digite seu nome:");

    if (nome) {
        document.getElementById("resultado").innerHTML =
            `Obrigado, ${nome}! Sua candidatura foi registrada.`;
    }
}

function abrirFAQ() {

    document.getElementById("resultado").innerHTML = `
        <h3>Perguntas Frequentes</h3>
        <p><strong>Como me candidatar?</strong><br>
        Acesse a página Trabalhe Conosco, selecione a vaga desejada e clique em Candidatar-se".</p>

        <p><strong>Como acompanhar minha candidatura</strong><br>
        Entre em sua conta e consulte o menu Minhas Candidaturas.</p>
        <p><strong>Como entrar em contato com o RH</strong><br>
        Sim. Acesse Perfil > Editar dados e atualize as informações necessárias.</p>    
    `;
}

function voltarInicio() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.getElementById("pesquisa")
    .addEventListener("keyup", function() {

        const termo = this.value.toLowerCase();

        if (termo.includes("vaga")) {
            document.getElementById("resultado").innerHTML =
                "Encontramos vagas disponíveis.";
        }
        else if (termo.includes("faq")) {
            document.getElementById("resultado").innerHTML =
                "Consulte nossa seção de perguntas frequentes.";
        }
        else if (termo === "") {
            document.getElementById("resultado").innerHTML = "";
        }
    });


document.getElementById("menu-btn")
    .addEventListener("click", () => {

        alert("Menu expandido!");
    });