const erro1 = document.getElementById('botaoErro');

function erro() {
    document.getElementById("telaErro").style.display = "block";
    document.getElementById("estoqueProdutos").style.display = "none";
}

function tentar() {
    document.getElementById("telaErro").style.display = "none";
    document.getElementById("estoqueProdutos").style.display = "block";
}

function abrirPopup() {
      document.getElementById("popup").style.display = "flex";
    }

function fecharPopup() {
      document.getElementById("popup").style.display = "none";
}