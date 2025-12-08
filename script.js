// URL do seu Web App do Google Apps Script:
const API_URL = "https://script.google.com/macros/s/AKfycbyI1fifn5bzmLtp6-U1SuaQJFvxll-LRY76tTc9YQlxVJw8-G1PT0AYG7w5f2sMOI9R/exec";

// Carrega Google Charts
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(carregarDados);

async function carregarDados() {
    try {
        const resposta = await fetch(API_URL);
        const dados = await resposta.json();

        renderListagem(dados.listagem);
        renderQuantidade(dados.quantidade);
        renderGrafico(dados.assinaturas);

    } catch (e) {
        console.error("Erro ao carregar dados:", e);
    }
}

/* -------------------------------------------------------------------------- */
/* LISTAGEM DE MOTORISTAS */
/* -------------------------------------------------------------------------- */

function renderListagem(lista) {
    const tbody = document.querySelector("#listaMotoristas tbody");
    tbody.innerHTML = "";

    lista.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.matricula}</td>
                <td>${item.nome}</td>
            </tr>`;
    });
}

/* -------------------------------------------------------------------------- */
/* TABELA DE QUANTIDADES */
/* -------------------------------------------------------------------------- */

function renderQuantidade(q) {
    const tbody = document.querySelector("#tabelaQuantidade tbody");

    tbody.innerHTML = `
        <tr><td>Total</td><td>${q.total}</td></tr>
        <tr><td>Ativos</td><td>${q.ativos}</td></tr>
        <tr><td>Inativos</td><td>${q.inativos}</td></tr>
        <tr><td>Afastados</td><td>${q.afastado}</td></tr>
        <tr><td>Instrutores</td><td>${q.instrutores}</td></tr>
    `;
}

function atualizarTabelaAssinaturas(dados) {
    const total = dados.length;

    const assinados = dados.filter(l => l.assinou === true).length;
    const naoAssinados = dados.filter(l => l.assinou === false).length;

    const pAssinados = total > 0 ? ((assinados / total) * 100).toFixed(1) + "%" : "0%";
    const pNaoAssinados = total > 0 ? ((naoAssinados / total) * 100).toFixed(1) + "%" : "0%";

    const tbody = document.querySelector("#tabelaAssinaturas tbody");

    tbody.innerHTML = `
        <tr>
            <td>Assinaram</td>
            <td>${assinados}</td>
            <td>${pAssinados}</td>
        </tr>
        <tr>
            <td>Não Assinaram</td>
            <td>${naoAssinados}</td>
            <td>${pNaoAssinados}</td>
        </tr>
    `;
}

atualizarTabelaAssinaturas(dados);
