// Função para registrar a entrada de ração
function registrarEntradaRacao() {
    // Obter os valores dos inputs
    const nomeRacao = document.getElementById('nomeRacao').value;
    const quantidadeRacao = document.getElementById('quantidadeRacao').value;
    const validadeRacao = document.getElementById('validadeRacao').value;

    // Construir objeto com os dados
    const dados = {
        nomeRacao,
        quantidadeRacao,
        validadeRacao,
    };

    // Enviar requisição AJAX para o backend
    $.ajax({
        type: 'POST',
        url: '/entradaRacao',
        contentType: 'application/json',
        data: JSON.stringify(dados),
        success: function (response) {
            // Exibir mensagem de sucesso
            exibirMensagem('mensagemEntradaRacao', 'green', response.message);
        },
        error: function (error) {
            // Exibir mensagem de erro
            exibirMensagem('mensagemEntradaRacao', 'red', 'Erro ao registrar entrada de ração.');
        },
    });
}

// Função utilitária para exibir mensagens
function exibirMensagem(idElemento, cor, mensagem) {
    const elemento = document.getElementById(idElemento);
    elemento.style.color = cor;
    elemento.innerHTML = mensagem;
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
        elemento.innerHTML = '';
    }, 3000);
}
