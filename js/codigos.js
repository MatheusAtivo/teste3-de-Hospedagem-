var nomeCodigos = document.getElementById('codigos-container');

setInterval(atualizadorNomeCodigos, 1000);


function atualizadorNomeCodigos() {
    // prefer window.codigos (sincronizado pelo firebase-sync), fallback para localStorage
    var codigos = (window.codigos && Array.isArray(window.codigos) && window.codigos.length > 0) ? window.codigos : (JSON.parse(localStorage.getItem("codigos")) || []);
    if (codigos && Array.isArray(codigos) && codigos.length > 0) {
        let tabela = `<table class="tabela-codigos">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Código</th>
                </tr>
            </thead>
            <tbody>
                ${codigos.map(item => `
                    <tr>
                        <td>${item.nome}</td>
                        <td>${item.codigo}
                               
        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
        nomeCodigos.innerHTML = tabela;
    } else {
        nomeCodigos.innerHTML = `<p>Nenhum código gerado ainda.</p>`;
    }
}

