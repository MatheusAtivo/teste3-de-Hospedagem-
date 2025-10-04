var tempo = 0;
var celulaTempo;
var minutos;
var segundos;
var operador;

var cEtapa1 = document.getElementById('cEtapa1');
var cEtapa2 = document.getElementById('cEtapa2');
var cEtapa3 = document.getElementById('cEtapa3');
var cEtapa4 = document.getElementById('cEtapa4');
var cEtapa5 = document.getElementById('cEtapa5');
var cEtapa6 = document.getElementById('cEtapa6');
var cEtapa7 = document.getElementById('cEtapa7');

function atualizarCronometro() {
  if (tempo > 0) {
    tempo--;
  }
  console.log(tempo);
  if (celulaTempo) {
    var min = Math.floor(tempo / 60);
    var seg = tempo % 60;
    celulaTempo.textContent = `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  }
}

setInterval(atualizarCronometro, 1000);

document.getElementById('formRastreamento').addEventListener('submit', function (e) {
  e.preventDefault();

  let codigoInput = document.getElementById('codigoProduto').value.trim();
  // Só aceita códigos com 4 dígitos (ex: '0001', '0002', ...)
  if (!/^\d{4}$/.test(codigoInput)) {
    const resultado = document.getElementById('resultado');
    const tabelaBody = document.querySelector('#tabelaProcessos tbody');
    tabelaBody.innerHTML = '';
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.textContent = 'Nenhum processo encontrado para este código.';
    row.appendChild(cell);
    tabelaBody.appendChild(row);
    resultado.style.display = 'block';
    celulaTempo = null;
    return;
  }
  const codigo = codigoInput;
  const resultado = document.getElementById('resultado');
  const tabelaBody = document.querySelector('#tabelaProcessos tbody');
  tabelaBody.innerHTML = '';

  var etapa = 1;
  var sequenciamento;

  // prefira dados sincronizados do Firebase via window.codigos / window.coisas1
  var codigos = (window.codigos && Array.isArray(window.codigos)) ? window.codigos : (JSON.parse(localStorage.getItem("codigos")) || []);
  var coisas1 = (window.coisas1 && typeof window.coisas1 === 'object') ? window.coisas1 : (JSON.parse(localStorage.getItem("coisas1")) || []);
  // se existir um mapa direto (window.codigosMap) podemos lookup direto
  var encontrado = null;
  if (window.codigosMap && window.codigosMap[codigo]) {
    encontrado = { codigo: codigo, nome: window.codigosMap[codigo].nome };
  } else {
    encontrado = codigos.find(c => c.codigo === codigo);
  }

  if (encontrado) {
    const dataAtual = new Date();
    const dia = dataAtual.getDate();
    const mes = dataAtual.getMonth() + 1;
    const ano = dataAtual.getFullYear();

    var index = codigos.findIndex(c => c.codigo === codigo);
    // se usamos coisas1 como objeto mapeado por código, tente recuperar diretamente
    if (typeof coisas1 === 'object' && !Array.isArray(coisas1) && coisas1[codigo] !== undefined) {
      etapa = coisas1[codigo];
    } else {
      etapa = coisas1[index];
    }
    console.log(etapa);

    switch (etapa) {
      case 1:
        sequenciamento = "Compra registrada";
        minutos = 5;
        segundos = 37;
        tempo = minutos * 60 + segundos;
        operador = "Maria Clara de Lima Rodrigues";

        resetarCirculos()
        cEtapa1.style.backgroundColor = 'yellow';
        break;
      case 2:
        sequenciamento = "Montagem dos meios em andamento";
        minutos = 5;
        segundos = 37;
        tempo = minutos * 60 + segundos;
        operador = "Matheus Gabriel Mendes Villa";

        resetarCirculos()
        cEtapa1.style.backgroundColor = 'green';
        cEtapa2.style.backgroundColor = 'yellow';
        break;
      case 3:
        sequenciamento = "Montagem das quinas em andamento";
        operador = "Maki Yoshitake Rocha";

        resetarCirculos()
        cEtapa1.style.backgroundColor = 'green';
        cEtapa2.style.backgroundColor = 'green';
        cEtapa3.style.backgroundColor = 'yellow';
        break;
      case 4:
        sequenciamento = "Testes de qualidade em andamento";
        operador = "Matheus Domingues Barbosa Ativo";

        resetarCirculos()
        cEtapa1.style.backgroundColor = 'green';
        cEtapa2.style.backgroundColor = 'green';
        cEtapa3.style.backgroundColor = 'green';
        cEtapa4.style.backgroundColor = 'yellow';

        break;
      case 5:
        sequenciamento = "Ajuste dos parafusos em andamento";
        operador = "Rafael Negoseki Claudino";

        resetarCirculos()
     
        cEtapa1.style.backgroundColor = 'green';
        cEtapa2.style.backgroundColor = 'green';
        cEtapa3.style.backgroundColor = 'green';
        cEtapa4.style.backgroundColor = 'green';
        cEtapa5.style.backgroundColor = 'yellow';
        break;

      case 6:
        sequenciamento = "Montagem das tampas em andamento";
        operador = "Matheus Gabriel Mendes Villa";

        resetarCirculos()
        cEtapa1.style.backgroundColor = 'green';
        cEtapa2.style.backgroundColor = 'green';
        cEtapa3.style.backgroundColor = 'green';
        cEtapa4.style.backgroundColor = 'green';
        cEtapa5.style.backgroundColor = 'green';
        cEtapa6.style.backgroundColor = 'yellow';
        break;
      case 7:
        sequenciamento = "Montagem finalizada";
        operador = "Sedex";

        resetarCirculos()
        cEtapa1.style.backgroundColor = 'green';
        cEtapa2.style.backgroundColor = 'green';
        cEtapa3.style.backgroundColor = 'green';
        cEtapa4.style.backgroundColor = 'green';
        cEtapa5.style.backgroundColor = 'green';
        cEtapa6.style.backgroundColor = 'green';
        cEtapa7.style.backgroundColor = 'yellow';

        tempo = 0;
        break;
      default:
        sequenciamento = "Etapa desconhecida";
        tempo = 0;
        operador = "Erro ao encontrar o produto, Verifique se o código está escrito corretamente";
         resetarCirculos();
    }

    const row = document.createElement('tr');

    [encontrado.codigo, sequenciamento, `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`, '', encontrado.nome, operador].forEach((text, index) => {
      const cell = document.createElement('td');
      cell.textContent = text;
      const cell2 = document.createElement('td');
      cell2.textContent = text;

      if (index === 3) {
        cell.id = 'tempo-estimado';
        celulaTempo = cell;
      }
      if (index === 5) {
        cell2.id = 'operador';
        operador = cell2;
      }
      row.appendChild(cell);
    });

    tabelaBody.appendChild(row);
    resultado.style.display = 'block';

  } else {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.textContent = 'Nenhum processo encontrado para este código.';
    resetarCirculos()
    row.appendChild(cell);
    tabelaBody.appendChild(row);
    resultado.style.display = 'block';
    // Garante que a variável 'celulaTempo' seja resetada caso não encontre o produto
    celulaTempo = null;
  }
});

function resetarCirculos() {
  cEtapa1.style.backgroundColor = 'white';
  cEtapa2.style.backgroundColor = 'white';
  cEtapa3.style.backgroundColor = 'white';
  cEtapa4.style.backgroundColor = 'white';
  cEtapa5.style.backgroundColor = 'white';
  cEtapa6.style.backgroundColor = 'white';
  cEtapa7.style.backgroundColor = 'white';
}

