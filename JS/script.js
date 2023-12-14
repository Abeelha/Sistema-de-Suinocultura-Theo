// script.js entraca_racao.html

// Função para registrar entrada de ração
function registrarEntradaRacao() {
    // Obter dados do formulário
    const nomeRacao = $('#nomeRacao').val();
    const quantidadeRacao = $('#quantidadeRacao').val();
    const validadeRacao = $('#validadeRacao').val();

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

// Função para distribuir ração para matrizes
function registrarDistribuicaoMatrizes() {
    // Obter dados do formulário
    const quantidadeMatrizes = $('#quantidadeMatrizes').val();

    // Criar objeto com os dados do formulário
    const formData = {
        quantidade: quantidadeMatrizes,
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

// script.js distribuicao_bercario.html

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


// script.js distribuicao_machos.html

// Função para registrar distribuição para machos
function registrarDistribuicaoMachos() {
    // Obter dados do formulário
    const quantidade = $('#quantidadeMachos').val();

    // Fazer uma requisição POST para o servidor usando AJAX
    fetch('/distribuicaoMachos', {
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
                $('#mensagemDistribuicaoMachos').html(`<p>${data.message}</p>`);
            } else {
                // Exibir mensagem de erro
                $('#mensagemDistribuicaoMachos').html('<p>Erro ao processar distribuição para machos.</p>');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            $('#mensagemDistribuicaoMachos').html('<p>Erro de comunicação com o servidor.</p>');
        });
}

// script.js for controle_estoque.html

// Exemplo: Função para obter estoque atual
function obterEstoqueAtual() {
    // Fazer uma requisição AJAX para o servidor
    fetch('/estoque')
        .then(response => response.json())
        .then(data => {
            // Lidar com a resposta do servidor
            if (data.quantidade !== undefined) {
                // Exibir estoque atual
                $('#estoqueAtual').html(`Quantidade Atual: ${data.quantidade}`);
            } else {
                // Exibir mensagem de erro
                $('#estoqueAtual').html('Erro ao obter estoque atual.');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            $('#estoqueAtual').html('Erro de comunicação com o servidor.');
        });
}

// Exemplo: Função para atualizar estoque
function atualizarEstoque() {
    // Obter dados do formulário
    const quantidade = $('#quantidadeEstoque').val();

    // Fazer uma requisição AJAX para o servidor
    fetch('/atualizarEstoque', {
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
                $('#mensagemAtualizarEstoque').html(`<p>${data.message}</p>`);
                // Atualizar estoque atual após a atualização
                obterEstoqueAtual();
            } else {
                // Exibir mensagem de erro
                $('#mensagemAtualizarEstoque').html('<p>Erro ao atualizar estoque.</p>');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            $('#mensagemAtualizarEstoque').html('<p>Erro de comunicação com o servidor.</p>');
        });
}

// Exemplo: Atualizar estoque na carga da página
obterEstoqueAtual();

// script.js for relatorio_diario.html

// Exemplo: Função para obter relatório diário
function obterRelatorioDiario() {
    // Fazer uma requisição AJAX para o servidor
    fetch('/relatorioDiario')
        .then(response => response.json())
        .then(data => {
            // Lidar com a resposta do servidor
            if (data.totalRacaoFornecida !== undefined && data.estoqueAtual !== undefined) {
                // Exibir total de ração fornecida e estoque atual
                $('#totalRacaoFornecida').html(`Total de Ração Fornecida: ${data.totalRacaoFornecida}`);
                $('#estoqueAtualRelatorio').html(`Estoque Atual: ${data.estoqueAtual}`);
            } else {
                // Exibir mensagem de erro
                $('#totalRacaoFornecida').html('Erro ao obter relatório diário.');
                $('#estoqueAtualRelatorio').html('');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            $('#totalRacaoFornecida').html('Erro de comunicação com o servidor.');
            $('#estoqueAtualRelatorio').html('');
        });
}

// Exemplo: Atualizar relatório diário na carga da página
obterRelatorioDiario();