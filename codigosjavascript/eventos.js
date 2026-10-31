DOCUMENT.addEventListener("DOMContentLoaded", () => {
const eventsGrid = document.getElementById("events-grid");
    const totalEventosSpan = document.getElementById("total-eventos");

 fetch('../json/eventos.json')
        .then(response => response.json())
        .then(jsonDados => {
            eventsGrid.innerHTML = "";

            function obterBadge(recursos) {
                if (recursos.includes("Libras")) return "🤟";
                if (recursos.includes("Legendas") || recursos.includes("CART")) return "💬";
                return "🤟"; 
            }                         

            jsonDados.eventos.forEach(evento => {
                const badge = obterBadge(evento.recursosAcessibilidade);
                const labelRecursos = (evento.id === 2 || evento.id === 4) ? "Recursos:" : "Recursos de Acessibilidade:";

                const cardHTML = `
                    <div class="card">
                        <div class="image-placeholder">
                            <span class="badge">${badge}</span>
                            <div class="cam-icon">📷</div>
                            <p>[IMAGEM DO EVENTO]</p>
                        </div>
                        <div class="card-body">
                            <p><strong>Título:</strong> ${evento.titulo}</p>
                            <p><strong>Data:</strong> ${evento.data}, ${evento.horario}</p>
                            <p><strong>Local:</strong> ${evento.local}</p>
                            <p><strong>${labelRecursos}</strong> ${evento.recursosAcessibilidade}</p>
                        </div>
                        <button class="btn-details">Ver Detalhes</button>
                    </div>
                `;
                eventsGrid.insertAdjacentHTML("beforeend", cardHTML);
            });

            totalEventosSpan.textContent = `Total de Eventos: ${jsonDados.eventos.length}`;
        })
        .catch(error => console.error("Erro ao carregar o JSON:", error));
});  
