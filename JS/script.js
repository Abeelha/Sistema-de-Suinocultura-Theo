// script.js para entraca_racao.html

// Função para registrar entrada de ração
function registrarEntradaRacao() {
    const nomeRacao = $('#nomeRacao').val();
    const quantidadeRacao = $('#quantidadeRacao').val();
    const validadeRacao = $('#validadeRacao').val();

    const formData = {
        nomeRacao,
        quantidadeRacao,
        validadeRacao,
    };

    $.ajax({
        type: 'POST',
        url: '/entradaracao',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (data) {
            console.log(data);
            $('#mensagemEntradaRacao').text(data.message);
        },
        error: function (error) {
            console.error('Erro:', error);
        },
    });
}

// script.js para distribuicao_matrizes.html

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
function registrarEntradaRacao() {
    const nomeRacao = $('#nomeRacao').val();
    const quantidadeRacao = $('#quantidadeRacao').val();
    const validadeRacao = $('#validadeRacao').val();

    const formData = {
        nomeRacao,
        quantidadeRacao,
        validadeRacao,
    };

    $.ajax({
        type: 'POST',
        url: '/entradaracao',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (data) {
            console.log(data);
            $('#mensagemEntradaRacao').text(data.message);

            // Calcular a quantidade total de ração fornecida
            const quantidadeTotal = parseFloat(quantidadeRacao);

            // Atualizar o estoque no banco de dados
            atualizarEstoqueNoBanco(quantidadeTotal);
        },
        error: function (error) {
            console.error('Erro:', error);
        },
    });
}

// Função para atualizar o estoque no banco de dados
function atualizarEstoqueNoBanco(quantidade) {
    try {
        // Obter o estoque atual do banco de dados
        fetch('/estoque')
            .then(response => response.json())
            .then(data => {
                const estoqueAtual = parseFloat(data.quantidade);

                // Calcular o novo estoque
                const novoEstoque = estoqueAtual + quantidade;

                // Enviar uma requisição para atualizar o estoque no banco de dados
                fetch('/atualizarEstoqueManual', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantidade: novoEstoque }),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        obterEExibirEstoqueAtual(); // Atualizar a exibição do estoque
                    })
                    .catch(error => {
                        console.error('Erro:', error);
                    });
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    } catch (error) {
        console.error('Erro ao atualizar estoque no banco:', error);
    }
}
// Função para obter e exibir o estoque atual
async function obterEExibirEstoqueAtual() {
    try {
        console.log('Antes do fetch');
        const response = await fetch('/estoque');
        console.log('Depois do fetch');
        const data = await response.json();

        // Atualize o elemento HTML com o estoque atual
        document.getElementById('estoqueAtual').innerText = `Estoque Atual: ${data.quantidade}`;
    } catch (error) {
        console.error('Erro ao obter estoque:', error);
    }
}



// Chame esta função para obter e exibir o estoque assim que a página carregar
document.addEventListener('DOMContentLoaded', obterEExibirEstoqueAtual);


function obterRelatorioDiario() {
    fetch('/relatorioDiario')
        .then(response => response.json())
        .then(data => {
            if (data.totalRacaoFornecida !== undefined && data.estoqueAtual !== undefined) {
                $('#totalRacaoFornecida').html(`Total de Ração Fornecida: ${data.totalRacaoFornecida}`);
                $('#estoqueAtualRelatorio').html(`Estoque Atual: ${data.estoqueAtual}`);
            } else {
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
obterEExibirEstoqueAtual();
obterRelatorioDiario();
