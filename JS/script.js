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
function registrarDistribuicaoMatrizes() {
    // Get form data
    const quantidadeMatrizes = document.getElementById('quantidadeMatrizes').value;

    // Create an object with the form data
    const formData = {
        quantidade: quantidadeMatrizes,
    };

    // Make a POST request to the server
    fetch('/distribuicaoMatrizes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            console.log(data);
            // Display a message on the HTML page based on the response
            document.getElementById('mensagemDistribuicaoMatrizes').innerText = data.message;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

