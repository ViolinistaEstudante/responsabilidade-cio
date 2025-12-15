/* ========================================================================== */
/* CONFIGURAÇÃO */
/* ========================================================================== */

// URL do Web App do Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbyI1fifn5bzmLtp6-U1SuaQJFvxll-LRY76tTc9YQlxVJw8-G1PT0AYG7w5f2sMOI9R/exec";

// Carrega Google Charts
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(carregarDados);

/* ========================================================================== */
/* BUSCA DE DADOS */
/* ========================================================================== */

async function carregarDados() {
    try {
        const resposta = await fetch(API_URL);
        const dados = await resposta.json();

        renderListagem(dados.listagem);
        renderQuantidade(dados.quantidade);
        atualizarTabelaAssinaturas(dados.assinaturas);
        renderGraficoAssinaturas(dados.assinaturas);

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}

/* ========================================================================== */
/* LISTAGEM DE MOTORISTAS */
/* ========================================================================== */

function renderListagem(lista) {
    const tbody = document.querySelector("#listaMotoristas tbody");
    tbody.innerHTML = "";

    lista.forEach(item => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${item.matricula}</td>
            <td>${item.nome}</td>
        `;

        tbody.appendChild(tr);
    });
}

/* ========================================================================== */
/* TABELA DE QUANTIDADES */
/* ========================================================================== */

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

/* ========================================================================== */
/* TABELA DE ASSINATURAS */
/* ========================================================================== */

function atualizarTabelaAssinaturas(a) {
    const tbody = document.querySelector("#tabelaAssinaturas tbody");

    tbody.innerHTML = `
        <tr>
            <td>Assinaram</td>
            <td>${a.assinadosQtd}</td>
            <td>${(a.assinadosPorc * 100).toFixed(1)}%</td>
        </tr>
        <tr>
            <td>Não Assinaram</td>
            <td>${a.naoAssinadosQtd}</td>
            <td>${(a.naoAssinadosPorc * 100).toFixed(1)}%</td>
        </tr>
    `;
}

/* ========================================================================== */
/* GRÁFICO DE ASSINATURAS (GOOGLE CHARTS) */
/* ========================================================================== */

function renderGraficoAssinaturas(a) {
    const data = google.visualization.arrayToDataTable([
        ["Status", "Quantidade"],
        ["Assinaram", a.assinadosQtd],
        ["Não Assinaram", a.naoAssinadosQtd]
    ]);

    const options = {
        title: "Situação das Assinaturas",
        pieHole: 0.4,
        legend: { position: "bottom" }
    };

    const chart = new google.visualization.PieChart(
        document.getElementById("graficoAssinaturas")
    );

    chart.draw(data, options);
}
