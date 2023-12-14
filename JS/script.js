// script.js

function registrarEntradaRacao() {
    const nomeRacao = document.getElementById('nomeRacao').value;
    const quantidadeRacao = document.getElementById('quantidadeRacao').value;
    const validadeRacao = document.getElementById('validadeRacao').value;

    const formData = {
        nomeRacao,
        quantidadeRacao,
        validadeRacao
    };

    $.ajax({
        type: 'POST',
        url: '/entradaracao',
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: function (data) {
            console.log(data);
            document.getElementById('mensagemEntradaRacao').innerText = data.message;
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}

function realizarDistribuicao(tabela) {
    const quantidade = document.getElementById(`quantidade${tabela}`).value;

    const formData = {
        tabela,
        quantidade
    };

    $.ajax({
        type: 'POST',
        url: '/distribuicao',
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: function (data) {
            console.log(data);
            document.getElementById(`mensagem${tabela}`).innerText = data.message;
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}
