// Função executada quando o documento está pronto
$(document).ready(function () {
    obterEExibirEstoqueAtual();
});

// Verifica se a página atual é relatorio_diario.html e associa a função ao clique do botão
$(document).ready(function () {
    if (window.location.pathname.includes('relatorio_diario.html')) {
        $(document).on('click', '#atualizarRelatorioButton', function () {
            obterEExibirRelatorioDiario();
        });
    }
});

// Registra a entrada de ração no sistema
function registrarEntradaRacao() {
    const quantidadeRacao = $('#quantidadeRacao').val();
    const formData = { quantidadeRacao };

    // Requisição AJAX para '/entradaracao'
    $.ajax({
        type: 'POST',
        url: '/entradaracao',


        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (data) {
            if (data.success) {
                // Exibe mensagem de sucesso
                $('#mensagemEntradaRacao').html(`<p class="success">${data.message}</p>`);
            } else {
                // Exibe mensagem de erro
                $('#mensagemEntradaRacao').html(`<p class="error">${data.message}</p>`);
            }

            // Opcionalmente, limpa o campo de entrada após um registro bem-sucedido
            $('#quantidadeRacao').val('');
        },
        error: function (error) {
            console.error('Erro:', error);
        },
    });
}

// Registra a distribuição para matrizes
function registrarDistribuicaoMatrizes() {
    const quantidadeMatrizes = $('#quantidadeMatrizes').val();
    const formData = { quantidade: quantidadeMatrizes };

    // Requisição AJAX para '/distribuicaoMatrizes'
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

// Registra a distribuição para o Berçário
function registrarDistribuicaoBercario() {
    const quantidade = document.getElementById('quantidadeBercario').value;

    // Requisição AJAX para '/distribuicaoBercario'
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

// Registra a distribuição para machos
function registrarDistribuicaoMachos() {
    const quantidade = $('#quantidadeMachos').val();
    const formData = { quantidade };

    // Requisição AJAX para '/distribuicaoMachos'
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

// Verifica se a página atual é controle_estoque.html e associa a função ao clique do botão
if (window.location.pathname.includes('controle_estoque.html')) {
    $(document).on('click', '#atualizarEstoqueButton', function () {
        atualizarEstoqueManualmente();
    });
}

// Obtém e exibe o estoque atual quando necessário
async function obterEExibirEstoqueAtual() {
    try {
        // Verifica se a página atual é controle_estoque.html
        if (window.location.pathname.includes('controle_estoque.html')) {
            const response = await fetch('/estoque');
            const data = await response.json();
            const estoqueQuantidade = parseInt(data.quantidade, 10); // Converte para inteiro
            console.log('Estoque atual:', estoqueQuantidade); // Adiciona esta linha
            document.getElementById('estoqueAtual').innerText = `Estoque Atual: ${estoqueQuantidade}`;
        }
    } catch (error) {
        console.error('Erro ao obter estoque:', error);
    }
}

// Atualiza manualmente o estoque
function atualizarEstoqueManualmente() {
    $.ajax({
        type: 'POST',
        url: '/atualizarEstoqueManual',
        success: function (data) {
            console.log(data);
            if (data.success) {
                // Opcionalmente, atualiza o valor do estoque exibido
                obterEExibirEstoqueAtual();
            }
        },
        error: function (error) {
            console.error('Erro ao atualizar estoque:', error);
        },
    });
}

// Obtém e exibe o relatório diário quando necessário
async function obterEExibirRelatorioDiario() {
    try {
        // Obter a data fornecida pelo usuário
        const dataInput = $('#dataRelatorio').val();

        // Requisição AJAX para '/relatorio_diario'
        const response = await fetch(`/relatorio_diario?data=${dataInput}`);
        const data = await response.json();

        // Atualizar os elementos HTML com os valores obtidos
        document.getElementById('totalEntradaRacao').innerText = `Total Entrada de Ração: ${data.entradaracao.reduce((total, item) => total + item.quantidadeRacao, 0)}`;
        // ...

        // Atualizar dados de distribuição para Matrizes
        const distribuicaoMatrizesElement = document.getElementById('matrizes');
        const totalMatrizes = data.distribuicaoMatrizes.reduce((total, item) => total + item.quantidade, 0);
        distribuicaoMatrizesElement.innerText = `Matrizes: ${totalMatrizes}`;

        // Atualizar dados de distribuição para Machos
        const distribuicaoMachosElement = document.getElementById('machos');
        const totalMachos = data.distribuicaoMachos.reduce((total, item) => total + item.quantidade, 0);
        distribuicaoMachosElement.innerText = `Machos: ${totalMachos}`;

        // Atualizar dados de distribuição para Berçário
        const distribuicaoBercarioElement = document.getElementById('bercario');
        const totalBercario = data.distribuicaoBercario.reduce((total, item) => total + item.quantidade, 0);
        distribuicaoBercarioElement.innerText = `Berçário: ${totalBercario}`;

        // Exibir mensagem de sucesso
        alert('Relatório atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao gerar relatório diário:', error);
        alert('Erro ao gerar relatório diário. Verifique o console para mais detalhes.');
    }
}


// Função para atualizar elementos HTML com base em uma lista de dados
function atualizarElementoHTML(elementId, dataList) {
    const element = document.getElementById(elementId);
    if (element) {
        // Calcular a quantidade total a partir dos dados
        const quantidadeTotal = dataList.reduce((total, item) => total + item.quantidade, 0);

        // Criar uma lista de strings para cada item na dataList
        const listaItens = dataList.map(item => `${item.quantidade} (${item.data})`);

        // Atualizar o elemento HTML com a lista de itens
        element.innerText = `${elementId.charAt(0).toUpperCase() + elementId.slice(1)}: ${quantidadeTotal} - ${listaItens.join(', ')}`;
    }
}

// Verifica se a página atual é controle_estoque.html e associa a função ao clique do botão
$(document).ready(function () {
    if (window.location.pathname.includes('controle_estoque.html')) {
        $(document).on('click', '#atualizarEstoqueButton', function () {
            atualizarEstoqueManualmente();
        });
    }
});

// Aguarde até que o documento esteja pronto
$(document).ready(function () {
    // Adicione um ouvinte de evento de clique ao botão
    $('#atualizarRelatorioButton').on('click', function () {
        obterEExibirRelatorioDiario();
    });
});

