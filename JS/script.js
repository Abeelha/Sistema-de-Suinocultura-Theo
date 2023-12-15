$(document).ready(function () {
    obterEExibirEstoqueAtual();
});
$(document).ready(function () {
    if (window.location.pathname.includes('relatorio_diario.html')) {
        $(document).on('click', '#atualizarRelatorioButton', function () {
            obterEExibirRelatorioDiario();
        });
    }
});

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
            const estoqueQuantidade = parseInt(data.quantidade, 10); // Parse as an integer
            console.log('Estoque atual:', estoqueQuantidade);  // Add this line
            document.getElementById('estoqueAtual').innerText = `Estoque Atual: ${estoqueQuantidade}`;
        }
    } catch (error) {
        console.error('Erro ao obter estoque:', error);
    }
}

function atualizarEstoqueManualmente() {
    $.ajax({
        type: 'POST',
        url: '/atualizarEstoqueManual',
        success: function (data) {
            console.log(data);
            if (data.success) {
                // Optionally, you can update the displayed stock value
                obterEExibirEstoqueAtual();
            }
        },
        error: function (error) {
            console.error('Erro ao atualizar estoque:', error);
        },
    });
}

async function obterEExibirRelatorioDiario() {
    try {
        // Fetch totalEntradaRacao from entradaracao
        const entradaRacaoResponse = await fetch('/totalEntradaRacao');
        const entradaRacaoData = await entradaRacaoResponse.json();
        document.getElementById('totalEntradaRacao').innerText = `Total Entrada de Ração: ${entradaRacaoData.total || 0}`;

        // Fetch distribution data from each table
        const bercarioResponse = await fetch('/totalDistribuicao/bercario');
        const machosResponse = await fetch('/totalDistribuicao/machos');
        const matrizesResponse = await fetch('/totalDistribuicao/matrizes');

        const bercarioData = await bercarioResponse.json();
        const machosData = await machosResponse.json();
        const matrizesData = await matrizesResponse.json();

        document.getElementById('bercario').innerText = `Berçário: ${bercarioData.total || 0}`;
        document.getElementById('machos').innerText = `Machos: ${machosData.total || 0}`;
        document.getElementById('matrizes').innerText = `Matrizes: ${matrizesData.total || 0}`;
    } catch (error) {
        console.error('Erro ao gerar relatório diário:', error);
    }
}

// Check if the current page is controle_estoque.html
$(document).ready(function () {
    if (window.location.pathname.includes('controle_estoque.html')) {
        // Update stock manually when the button is clicked
        $(document).on('click', '#atualizarEstoqueButton', function () {
            atualizarEstoqueManualmente();
        });
    }
});
