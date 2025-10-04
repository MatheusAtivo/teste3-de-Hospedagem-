// Admin UI - controle de etapas e criação de códigos

var etapa1 = 1;
var B1 = document.getElementById('b1');
var B2 = document.getElementById('b2');
var B3 = document.getElementById('b3');
var B4 = document.getElementById('b4');
var B5 = document.getElementById('b5');
var B6 = document.getElementById('b6');
var B7 = document.getElementById('b7');
var B8 = document.getElementById('b8');
var B9 = document.getElementById('b9');
var EtapasAdmin1 = document.getElementById('EtapasAdmin');

var QetapaÉ = '';
var conta = parseInt(localStorage.getItem("contador")) || 1;

function getCoisas1() {
    return (window.coisas1 && typeof window.coisas1 === 'object') ? window.coisas1 : (JSON.parse(localStorage.getItem("coisas1")) || []);
}
var etapa = 1;
var sequenciamento;

function b1() {
    etapa1 = 1;
    resetador();
    B1.style.backgroundColor = 'yellow';
}
function b2() {
    etapa1 = 2;
    resetador();
    B2.style.backgroundColor = 'yellow';
}
function b3() {
    etapa1 = 3;
    resetador();
    B3.style.backgroundColor = 'yellow';
}
function b4() {
    etapa1 = 4;
    resetador();
    B4.style.backgroundColor = 'yellow';
}
function b5() {
    etapa1 = 5;
    resetador();
    B5.style.backgroundColor = 'yellow';
}
function b6() {
    etapa1 = 6;
    resetador();
    B6.style.backgroundColor = 'yellow';
}

function b8() {
    etapa1 = 0;
    resetador();
}

function resetador() {
    B1.style.backgroundColor = 'white';
    B2.style.backgroundColor = 'white';
    B3.style.backgroundColor = 'white';
    B4.style.backgroundColor = 'white';
    B5.style.backgroundColor = 'white';
    B6.style.backgroundColor = 'white';

    switch (etapa1) {
        case 2:
            B1.style.backgroundColor = 'green';
            break;

        case 3:
            B1.style.backgroundColor = 'green';
            B2.style.backgroundColor = 'green';
            break;

        case 4:
            B1.style.backgroundColor = 'green';
            B2.style.backgroundColor = 'green';
            B3.style.backgroundColor = 'green';
            break;

        case 5:
            B1.style.backgroundColor = 'green';
            B2.style.backgroundColor = 'green';
            B3.style.backgroundColor = 'green';
            B4.style.backgroundColor = 'green';
            break;

        case 6:
            B1.style.backgroundColor = 'green';
            B2.style.backgroundColor = 'green';
            B3.style.backgroundColor = 'green';
            B4.style.backgroundColor = 'green';
            B5.style.backgroundColor = 'green';
            break;

        default:
            break;
    }

}

function b7() {// botão de finalizar
    etapa1 = 7;
    B1.style.backgroundColor = 'green';
    B2.style.backgroundColor = 'green';
    B3.style.backgroundColor = 'green';
    B4.style.backgroundColor = 'green';
    B5.style.backgroundColor = 'green';
    B6.style.backgroundColor = 'green';
}

function b9() {
    // pega o código do input e força formato de 4 dígitos (ex: '1' -> '0001')
    QetapaÉ = document.getElementById('codigo2').value;
    const codigoStr = String(QetapaÉ || '').padStart(4, '0');
    const codigoNum = parseInt(QetapaÉ, 10);

    // atualiza etapa localmente e no Firebase quando possível
    try {
        if (window.updateCodigoEtapa && typeof window.updateCodigoEtapa === 'function') {
            // grava usando a chave formatada (4 dígitos)
            window.updateCodigoEtapa(codigoStr, etapa1).catch(err => console.warn(err));
        } else {
            // fallback: atualiza array ou objeto em localStorage
            const arr = getCoisas1();
            if (Array.isArray(arr)) {
                // se o usuário digitou um número válido usamos index (códigoNum - 1)
                if (!isNaN(codigoNum)) {
                    arr[codigoNum - 1] = etapa1;
                } else {
                    // se não for número, guardamos em última posição
                    arr.push(etapa1);
                }
            } else if (typeof arr === 'object') {
                // se for objeto mapeado por código, utilizamos a chave de 4 dígitos
                arr[codigoStr] = etapa1;
            }
            localStorage.setItem("coisas1", JSON.stringify(arr));
            console.log('Fallback updated coisas1:', arr);
        }
    } catch (e) {
        console.warn('Erro ao atualizar etapa:', e);
    }
}

function b10() {

       const nome = document.getElementById('codigo3').value;
    // gera código
        var codigo = conta.toString().padStart(4, '0');
        conta++;

       // salva códigos no Firebase quando possível, senão no localStorage
        try {
            const codigoObj = { codigo, nome, etapa: 1, createdAt: Date.now(), };
            if (window.addCodigo && typeof window.addCodigo === 'function') {
                window.addCodigo(codigoObj).catch(err => console.warn('Falha addCodigo:', err));
            } else {
                var codigos = JSON.parse(localStorage.getItem("codigos")) || [];
                codigos.push({ codigo, nome });
                localStorage.setItem("codigos", JSON.stringify(codigos));
                // fallback: atualiza coisas1 local (array ou objeto)
                const arr = getCoisas1();
                if (Array.isArray(arr)) {
                    arr.push(1);
                } else if (typeof arr === 'object') {
                    arr[codigo] = 1; // usa a chave formatada
                }
                localStorage.setItem("coisas1", JSON.stringify(arr));
            }
            // atualiza contador local
            localStorage.setItem("contador", conta);
            console.log("Códigos salvos (tentativa):", codigoObj);
        } catch (e) {
            console.warn('Erro ao criar código:', e);
        }
}

function b11() {
    // pega o código como string e também como número para compatibilidade
    const codigoInput = document.getElementById('codigo2').value;
    const codigoStr = String(codigoInput || '').padStart(4, '0');
    const codigoNum = parseInt(codigoInput, 10);
    const coisas = getCoisas1();
    var etapaAtual;
    // se coisas for um objeto mapeado por código (ex: { "0001": 1 }), usar a chave formatada
    if (typeof coisas === 'object' && !Array.isArray(coisas) && coisas[codigoStr] !== undefined) {
        etapaAtual = coisas[codigoStr];
    } else if (Array.isArray(coisas) && !isNaN(codigoNum)) {
        etapaAtual = coisas[codigoNum - 1]; // compatibilidade com array indexado
    } else {
        etapaAtual = undefined;
    }
    let sequenciamento = "";

    switch (etapaAtual) {
        case 1:
            sequenciamento = "Compra registrada";
            break;
        case 2:
            sequenciamento = "Montagem dos meios em andamento";
            break;
        case 3:
            sequenciamento = "Montagem das quinas em andamento";
            break;
        case 4:
            sequenciamento = "Ajuste dos parafusos em andamento";
            break;
        case 5:
            sequenciamento = "Testes de qualidade em andamento";
            break;
        case 6:
            sequenciamento = "Montagem das tampas em andamento";
            break;
        case 7:
            sequenciamento = "Montagem finalizada";
            break;
        default:
            sequenciamento = "Etapa desconhecida";
            break;
    }

    const EtapasAdmin1 = document.getElementById('EtapasAdmin');
  EtapasAdmin1.innerHTML = `<strong>${sequenciamento}</strong>`;
        console.log("Etapa:", sequenciamento);
            // usa getCoisas1() para obter snapshot atual de coisas1 (pode ser array ou objeto)
            console.log('etapaAtual, coisas1 snapshot, codigo:', etapaAtual, getCoisas1(), codigo);
}


const reset = document.getElementById('resetar');

if (reset) {
    reset.addEventListener('click', async function () {
        // limpa o localStoragevar
        try {
            if (window.resetCodigos && typeof window.resetCodigos === 'function') {
         
                const p = window.resetCodigos();
                const timeout = new Promise((res, rej) => setTimeout(() => rej(new Error('timeout')), 5000));
                try {
                    await Promise.race([p, timeout]);
                    console.log('Firebase reset concluído');
                } catch (err) {
                    console.warn('Falha/timeout ao resetar no Firebase:', err);
                }
            }

            if (window.getCodigosOnce && typeof window.getCodigosOnce === 'function') {
                try {
                    const remaining = await window.getCodigosOnce();
                    if (Array.isArray(remaining) && remaining.length > 0) {
                        console.warn('Ainda existem códigos após reset, tentando remover individualmente:', remaining);
                        if (window.removeCodigo && typeof window.removeCodigo === 'function') {
                            for (const item of remaining) {
                                try { await window.removeCodigo(item.codigo); } catch (e) { console.warn('Falha ao remover', item.codigo, e); }
                            }
                        }
                    }
                } catch (e) {
                    console.warn('Erro ao verificar códigos restantes:', e);
                }
            }
        } catch (e) { console.warn(e); }
        localStorage.removeItem("coisas1");
        localStorage.removeItem("codigos");
        localStorage.removeItem("contador");
        // limpa o conteúdo do nomeCodigos
        var nomeCodigos = document.getElementById('codigos-container');
       nomeCodigos.innerHTML = ``;
        // recarrega a página
        location.reload();
    });
}