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

// Function to register distribution to Berçário
function registrarDistribuicaoBercario() {
    const quantidade = document.getElementById('quantidadeBercario').value;

    $.ajax({
        type: 'POST',
        url: '/distribuicaoBercario',
        contentType: 'application/json',
        data: JSON.stringify({ quantidade }),
        success: function (data) {
            if (data.message) {
                document.getElementById('mensagemDistribuicaoBercario').innerHTML = `<p>${data.message}</p>`;
            } else {
                document.getElementById('mensagemDistribuicaoBercario').innerHTML = '<p>Erro ao processar distribuição para berçário.</p>';
            }
        },
        error: function (error) {
            console.error('Erro:', error);
            document.getElementById('mensagemDistribuicaoBercario').innerHTML = '<p>Erro de comunicação com o servidor.</p>';
        },
    });
}

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
    $.ajax({
        type: 'POST',
        url: '/distribuicaoBercario',
        contentType: 'application/json',
        data: JSON.stringify({ quantidade }),
        success: function (data) {
            // Lidar com a resposta do servidor
            if (data.message) {
                // Exibir mensagem de sucesso
                document.getElementById('mensagemDistribuicaoBercario').innerHTML = `<p>${data.message}</p>`;
            } else {
                // Exibir mensagem de erro
                document.getElementById('mensagemDistribuicaoBercario').innerHTML = '<p>Erro ao processar distribuição para berçário.</p>';
            }
        },
        error: function (error) {
            console.error('Erro:', error);
            document.getElementById('mensagemDistribuicaoBercario').innerHTML = '<p>Erro de comunicação com o servidor.</p>';
        },
    });
}

// Function to manually update stock
function atualizarEstoqueManualmente() {
    $.ajax({
        type: 'POST',
        url: '/atualizarEstoqueManual',
        success: function (data) {
            console.log(data);
            if (data.success) {
                // Display success message
                alert('Estoque atualizado com sucesso!');

                // Optionally, you can update the displayed stock value
                obterEExibirEstoqueAtual();
            } else {
                // Display error message
                alert('Erro ao atualizar estoque.');
            }
        },
        error: function (error) {
            console.error('Erro ao atualizar estoque:', error);
            alert('Erro ao atualizar estoque.');
        },
    });
}

// Check if the current page is controle_estoque.html
if (window.location.pathname.includes('controle_estoque.html')) {
    // Update stock manually when the button is clicked
    $(document).on('click', '#atualizarEstoqueButton', function () {
        atualizarEstoqueManualmente();
    });
}

// Fetch and display the current stock when needed
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
