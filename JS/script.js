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

// Import the necessary function
const { obterEstoqueAtual } = require('/JS/script'); // Update the path accordingly

// ...

// Rota para obter estoque atual
app.get('/estoque', async (req, res) => {
    try {
        const estoque = await obterEstoqueAtual();
        res.status(200).json({ quantidade: estoque });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao obter estoque.' });
    }
});

// Remove the duplicate function definition outside the server code


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


// script.js para distribuicao_machos.html

// Função para registrar distribuição para machos
function registrarDistribuicaoMachos() {
    // Obter dados do formulário
    const quantidade = $('#quantidadeMachos').val();

    // Criar objeto com os dados do formulário
    const formData = {
        quantidade: quantidade,
    };

    // Fazer uma requisição POST para o servidor usando AJAX
    $.ajax({
        type: 'POST',
        url: '/distribuicaoMachos',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (data) {
            // Lidar com a resposta do servidor
            console.log(data);
            // Exibir uma mensagem na página HTML com base na resposta
            $('#mensagemDistribuicaoMachos').html(`<p>${data.message}</p>`);
        },
        error: function (error) {
            console.error('Erro:', error);
            $('#mensagemDistribuicaoMachos').html('<p>Erro ao processar distribuição para machos.</p>');
        },
    });
}

// script.js for controle_estoque.html
// Rota para obter estoque atual
app.get('/estoque', async (req, res) => {
    try {
        const estoque = await obterEstoqueAtual();
        res.status(200).json({ quantidade: estoque });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao obter estoque.' });
    }
});
// Função para obter o estoque atual
async function obterEstoqueAtual() {
    try {
        const query = 'SELECT quantidade FROM estoque';
        return new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0] ? results[0].quantidade : 0);
                }
            });
        });
    } catch (error) {
        console.error('Erro ao obter estoque atual:', error);
        return 0;
    }
}

// ...

process.on('SIGINT', () => {
    connection.end();
    process.exit();
});

app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});
;

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