
// Função para registrar entrada de ração
// Função para registrar entrada de ração
function registrarEntradaRacao() {
    const quantidadeRacao = $('#quantidadeRacao').val();

    const formData = {
        quantidadeRacao,
    };

    $.ajax({
        type: 'POST',
        url: '/entradaracao',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (data) {
            console.log(data);
            $('#mensagemEntradaRacao').text(data.message);

            $('#quantidadeRacao').val('');
        },
        error: function (error) {
            console.error('Erro:', error);
        },
    });
}


// Função para distribuir ração para matrizes
function registrarDistribuicaoMatrizes() {
    const quantidadeMatrizes = $('#quantidadeMatrizes').val();

    const formData = {
        quantidade: quantidadeMatrizes,
    };

    $.ajax({
        type: 'POST',
        url: '/distribuicaoMatrizes',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (data) {
            console.log(data);
            $('#mensagemDistribuicaoMatrizes').text(data.message);
        },
        error: function (error) {
            console.error('Erro:', error);
        },
    });
}

// script.js para distribuicao_machos.html

// Função para registrar distribuição para machos
function registrarDistribuicaoMachos() {
    const quantidade = $('#quantidadeMachos').val();

    const formData = {
        quantidade: quantidade,
    };

    $.ajax({
        type: 'POST',
        url: '/distribuicaoMachos',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (data) {
            console.log(data);
            $('#mensagemDistribuicaoMachos').html(`<p>${data.message}</p>`);
        },
        error: function (error) {
            console.error('Erro:', error);
            $('#mensagemDistribuicaoMachos').html('<p>Erro ao processar distribuição para machos.</p>');
        },
    });
}

// Função para registrar distribuição para berçário
function registrarDistribuicaoBercario() {
    // Obter dados do formulário
    const quantidade = document.getElementById('quantidadeBercario').value;

    // Fazer uma requisição POST para o servidor usando AJAX
    fetch('/distribuicaoBercario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantidade }),
    })
        .then(response => response.json())
        .then(data => {
            // Lidar com a resposta do servidor
            if (data.message) {
                // Exibir mensagem de sucesso
                document.getElementById('mensagemDistribuicaoBercario').innerHTML = `<p>${data.message}</p>`;
            } else {
                // Exibir mensagem de erro
                document.getElementById('mensagemDistribuicaoBercario').innerHTML = '<p>Erro ao processar distribuição para berçário.</p>';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('mensagemDistribuicaoBercario').innerHTML = '<p>Erro de comunicação com o servidor.</p>';
        });
}

// Função para registrar entrada de ração
// ... (other script.js code) ...

// Função para registrar entrada de ração
function registrarEntradaRacao() {
    const quantidadeRacao = $('#quantidadeRacao').val();

    const formData = {
        quantidadeRacao,
    };

    $.ajax({
        type: 'POST',
        url: '/entradaracao',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (data) {
            console.log(data);
            if (data.success) {
                // Display success message
                $('#mensagemEntradaRacao').html(`<p class="success">${data.message}</p>`);
            } else {
                // Display error message
                $('#mensagemEntradaRacao').html(`<p class="error">${data.message}</p>`);
            }

            // Optionally, you can clear the input field after a successful entry
            $('#quantidadeRacao').val('');
        },
        error: function (error) {
            console.error('Erro:', error);
        },
    });
}
// Função para atualizar o estoque no banco de dados
async function atualizarEstoqueNoBanco(quantidade) {
    try {
        // Obter o estoque atual do banco de dados
        const response = await fetch('/estoque');
        if (!response.ok) {
            throw new Error(`Erro ao obter estoque: ${response.statusText}`);
        }

        const data = await response.json();
        const estoqueAtual = parseFloat(data.quantidade);

        // Calcular o novo estoque
        const novoEstoque = estoqueAtual - quantidade; // Subtract the quantity

        // Enviar uma requisição para atualizar o estoque no banco de dados
        const updateResponse = await fetch('/atualizarEstoqueManual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantidade: novoEstoque }),
        });

        if (!updateResponse.ok) {
            throw new Error(`Erro ao atualizar estoque: ${updateResponse.statusText}`);
        }

        const updateData = await updateResponse.json();
        console.log(updateData);

        // Atualizar a exibição do estoque
        obterEExibirEstoqueAtual();
    } catch (error) {
        console.error('Erro:', error);
    }
}


// Função para obter e exibir o estoque atual
async function obterEExibirEstoqueAtual() {
    try {
        // Check if the current page is controle_estoque.html
        if (window.location.pathname.includes('controle_estoque.html')) {
            const response = await fetch('/estoque');
            const data = await response.json();
            document.getElementById('estoqueAtual').innerText = `Estoque Atual: ${data.quantidade}`;
        }
    } catch (error) {
        console.error('Erro ao obter estoque:', error);
    }
}
// Função assíncrona para envolver a chamada
async function fazerChamadaEstoque() {
    try {
        // Check if the current page is controle_estoque.html
        if (window.location.pathname.includes('controle_estoque.html')) {
            console.log('Antes do fetch');
            const response = await fetch('/estoque');
            console.log('Depois do fetch');

            const data = await response.json();
            console.log('Dados recebidos:', data);

            // Atualize o conteúdo da div com o estoque atual
            document.getElementById('estoqueAtual').innerText = `Estoque Atual: ${data.quantidade}`;
        }
    } catch (error) {
        console.error('Erro ao obter estoque:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if the current page is controle_estoque.html
    if (window.location.pathname.includes('controle_estoque.html')) {
        obterEExibirEstoqueAtual();
    }
});
fazerChamadaEstoque();
if (window.location.pathname !== '/entrada_racao.html') {
    obterEExibirEstoqueAtual();
}
