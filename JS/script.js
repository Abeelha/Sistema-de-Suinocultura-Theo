// script.js

// Função para registrar a entrada de ração
function registrarEntradaRacao() {
    // Obter dados do formulário
    const nomeRacao = document.getElementById('nomeRacao').value;
    const quantidadeRacao = document.getElementById('quantidadeRacao').value;
    const validadeRacao = document.getElementById('validadeRacao').value;

    // Criar objeto com os dados do formulário
    const formData = {
        nomeRacao,
        quantidadeRacao,
        validadeRacao,
    };

    // Fazer uma requisição POST para o servidor usando AJAX
    $.ajax({
        type: 'POST',
        url: '/entradaracao',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (data) {
            // Lidar com a resposta do servidor
            console.log(data);
            // Exibir uma mensagem na página HTML com base na resposta
            $('#mensagemEntradaRacao').text(data.message);
        },
        error: function (error) {
            console.error('Erro:', error);
        },
    });
}

// Função para distribuir ração para matrizes
function distribuirRacaoMatrizes() {
    // Obter dados do formulário
    const quantidade = document.getElementById('quantidadeMatrizes').value;

    // Criar objeto com os dados do formulário
    const formData = {
        quantidade,
    };

    // Fazer uma requisição POST para o servidor usando AJAX
    $.ajax({
        type: 'POST',
        url: '/distribuicaoMatrizes',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (data) {
            // Lidar com a resposta do servidor
            console.log(data);
            // Exibir uma mensagem na página HTML com base na resposta
            $('#mensagemDistribuicaoMatrizes').text(data.message);
        },
        error: function (error) {
            console.error('Erro:', error);
        },
    });
}

// Adicione funções semelhantes para outras requisições AJAX conforme necessário
