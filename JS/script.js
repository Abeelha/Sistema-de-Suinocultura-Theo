// script.js entraca_racao.html
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

// script.js distribuicao_matrizes.html
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

// script.js distribuicao_bercario.html
function registrarDistribuicaoBercario() {
    // Get data from the form
    const quantidade = document.getElementById('quantidadeBercario').value;

    // Example: Performing AJAX request to the server
    // Modify this part according to your server-side logic
    fetch('/distribuicaoBercario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantidade }),
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data.message) {
                // Display success message
                document.getElementById('mensagemDistribuicaoBercario').innerHTML = `<p>${data.message}</p>`;
            } else {
                // Display error message
                document.getElementById('mensagemDistribuicaoBercario').innerHTML = '<p>Erro ao processar distribuição para berçário.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('mensagemDistribuicaoBercario').innerHTML = '<p>Erro de comunicação com o servidor.</p>';
        });
}
// script.js distribuicao_machos.html

function registrarDistribuicaoMachos() {
    // Get data from the form
    const quantidade = document.getElementById('quantidadeMachos').value;

    // Example: Performing AJAX request to the server
    // Modify this part according to your server-side logic
    fetch('/distribuicaoMachos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantidade }),
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data.message) {
                // Display success message
                document.getElementById('mensagemDistribuicaoMachos').innerHTML = `<p>${data.message}</p>`;
            } else {
                // Display error message
                document.getElementById('mensagemDistribuicaoMachos').innerHTML = '<p>Erro ao processar distribuição para machos.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('mensagemDistribuicaoMachos').innerHTML = '<p>Erro de comunicação com o servidor.</p>';
        });
}
// script.js for controle_estoque.html

// Example: Function to get current stock
function obterEstoqueAtual() {
    // Performing AJAX request to the server
    // Modify this part according to your server-side logic
    fetch('/estoque')
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data.quantidade !== undefined) {
                // Display current stock
                document.getElementById('estoqueAtual').innerHTML = `Quantidade Atual: ${data.quantidade}`;
            } else {
                // Display error message
                document.getElementById('estoqueAtual').innerHTML = 'Erro ao obter estoque atual.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('estoqueAtual').innerHTML = 'Erro de comunicação com o servidor.';
        });
}

// Example: Function to update stock
function atualizarEstoque() {
    // Get data from the form
    const quantidade = document.getElementById('quantidadeEstoque').value;

    // Performing AJAX request to the server
    // Modify this part according to your server-side logic
    fetch('/atualizarEstoque', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantidade }),
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data.message) {
                // Display success message
                document.getElementById('mensagemAtualizarEstoque').innerHTML = `<p>${data.message}</p>`;
                // Refresh current stock after update
                obterEstoqueAtual();
            } else {
                // Display error message
                document.getElementById('mensagemAtualizarEstoque').innerHTML = '<p>Erro ao atualizar estoque.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('mensagemAtualizarEstoque').innerHTML = '<p>Erro de comunicação com o servidor.</p>';
        });
}

// Example: Refresh stock on page load
obterEstoqueAtual();

// script.js for relatorio_diario.html

// Example: Function to get daily report
function obterRelatorioDiario() {
    // Performing AJAX request to the server
    // Modify this part according to your server-side logic
    fetch('/relatorioDiario')
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data.totalRacaoFornecida !== undefined && data.estoqueAtual !== undefined) {
                // Display total feed provided and current stock
                document.getElementById('totalRacaoFornecida').innerHTML = `Total de Ração Fornecida: ${data.totalRacaoFornecida}`;
                document.getElementById('estoqueAtualRelatorio').innerHTML = `Estoque Atual: ${data.estoqueAtual}`;
            } else {
                // Display error message
                document.getElementById('totalRacaoFornecida').innerHTML = 'Erro ao obter relatório diário.';
                document.getElementById('estoqueAtualRelatorio').innerHTML = '';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('totalRacaoFornecida').innerHTML = 'Erro de comunicação com o servidor.';
            document.getElementById('estoqueAtualRelatorio').innerHTML = '';
        });
}

// Example: Refresh daily report on page load
obterRelatorioDiario();

