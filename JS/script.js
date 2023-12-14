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

// script.js para controle_estoque.html

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

// script.js para relatorio_diario.html

// Exemplo: Função para obter relatório diário
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
// script.js para distribuicao_bercario.html

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


// Exemplo: Atualizar relatório diário na carga da página
obterRelatorioDiario();
