const formCompra = document.getElementById('formCompra');

// pega o contador salvo ou começa do 1
var conta = parseInt(localStorage.getItem("contador")) || 1;
var coisas1 = JSON.parse(localStorage.getItem("coisas1")) || [];
if (formCompra) {
    const numeros = document.getElementById('div1');
    const numeros2 = document.getElementById('div2');

    formCompra.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nome = document.getElementById('nomeUsuario').value;
        const resultadoDiv = document.getElementById('resultadoCompra');

        // gera código
        var codigo = conta.toString().padStart(4, '0');
        conta++;
        div1.style.display = "block";
        div1.style.backgroundColor = "white";
        div2.style.display = "block";
        div2.style.backgroundColor = 'white';

        // mostra pro usuário
        resultadoDiv.innerHTML = "";
        numeros.innerHTML = `Muito Obrigado(a) ${nome}`;
        numeros2.innerHTML = `<strong>O seu código é: ${codigo}</strong>`;

        // PRIMEIRO: tenta escrever no Firebase através da função exposta pelo módulo.
        // Se não houver conexão/função, faz fallback para localStorage tratando objetos/arrays.
        const codigoObj = { codigo, nome, etapa: 1, createdAt: Date.now() };
        let wroteToFirebase = false;
        try {
            if (window.addCodigo && typeof window.addCodigo === 'function') {
                await window.addCodigo(codigoObj);
                wroteToFirebase = true;
            }
        } catch (err) {
            console.warn('Falha ao gravar no Firebase, usaremos fallback local:', err);
            wroteToFirebase = false;
        }

        // sempre atualiza contador local
        localStorage.setItem("contador", conta);

        if (!wroteToFirebase) {
            // fallback localStorage: atualiza lista de codigos
            var codigos = JSON.parse(localStorage.getItem("codigos")) || [];
            codigos.push({ codigo, nome });
            localStorage.setItem("codigos", JSON.stringify(codigos));

            // atualiza coisas1 local como array ou objeto
            let stored = JSON.parse(localStorage.getItem("coisas1"));
            if (!stored) {
                // inicia como array por compatibilidade
                stored = [];
            }
            if (Array.isArray(stored)) {
                stored.push(1);
            } else if (typeof stored === 'object') {
                // se for objeto mapeado por código, guardamos na chave formatada
                stored[codigo] = 1;
            }
            localStorage.setItem("coisas1", JSON.stringify(stored));
        }

        console.log("Códigos salvos:", codigos);
        console.log(coisas1);
    });
}

const resetBtn = document.getElementById('resetar');