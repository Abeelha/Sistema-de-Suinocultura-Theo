function gerarRelatorio() {
    const dataRelatorio = document.getElementById('dataRelatorio').value;

    // Fazer uma requisição para obter o relatório com base na data inserida
    fetch(`/relatorioDiario?data=${dataRelatorio}`)
        .then(response => response.json())
        .then(data => {
            // Exibir os resultados no HTML
            document.getElementById('totalRacaoFornecida').innerText = `Total de Ração Fornecida: ${data.totalRacaoFornecida}`;
            document.getElementById('estoqueAtualRelatorio').innerText = `Estoque Atual: ${data.estoqueAtual}`;
            document.getElementById('distribuicaoMatrizes').innerText = `Distribuição Matrizes: ${JSON.stringify(data.distribuicaoMatrizes)}`;
            document.getElementById('distribuicaoBercario').innerText = `Distribuição Berçário: ${JSON.stringify(data.distribuicaoBercario)}`;
            document.getElementById('distribuicaoMachos').innerText = `Distribuição Machos: ${JSON.stringify(data.distribuicaoMachos)}`;
        })
        .catch(error => {
            console.error('Erro ao gerar relatório:', error);
        });
}