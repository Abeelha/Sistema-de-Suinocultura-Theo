const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3002;

// Pegar CSS e IMGs e JS
app.use('/CSS', express.static(path.join(__dirname, '../CSS')));
app.use('/IMGs', express.static(path.join(__dirname, '../IMGs')));
app.use('/JS', express.static(path.join(__dirname, '../JS')));

// Configurando o body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para lidar com solicitações para qualquer arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Create routes for each HTML file
const htmlFiles = [
    'entrada_racao',
    'controle_estoque',
    'relatorio_diario',
    'distribuicao_matrizes',
    'distribuicao_bercario',
    'distribuicao_machos',
];

htmlFiles.forEach((file) => {
    app.get(`/${file}.html`, (req, res) => {
        res.sendFile(path.join(__dirname, `../${file}.html`));
    });
});

// Rota para a página inicial (index.html)
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Rota para lidar com solicitações para qualquer arquivo HTML
app.get('/:page', (req, res) => {
    const page = req.params.page;
    if (page === 'index.html') {
        res.sendFile(path.join(__dirname, '../index.html'));
    } else {
        res.sendFile(path.join(__dirname, `../${page}.html`));
    }
});
//Fim Paginas


// Configurações do MySQL
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'admin', // Change this to your MySQL password
    database: 'SuinoCulturaTheo',
});

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        throw err;
    }
    console.log('Conectado ao MySQL');
});

// Modelos de dados Entrada Ração

// Configuração do body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Página de entrada de ração
app.get('/entradaracao', (req, res) => {
    res.sendFile(path.join(__dirname, '../entrada_racao.html'));
});

// Rota para processar entrada de ração
app.post('/entradaracao', async (req, res) => {
    try {
        const { nomeRacao, quantidadeRacao, validadeRacao } = req.body;
        const quantidade = parseInt(quantidadeRacao);

        // Salvar entrada no banco de dados
        const query = 'INSERT INTO entradaracao (nomeRacao, quantidadeRacao, validadeRacao) VALUES (?, ?, ?)';
        connection.query(query, [nomeRacao, quantidade, validadeRacao], (error, results) => {
            if (error) {
                console.error('Erro ao inserir entrada de ração:', error);
                res.status(500).json({ message: 'Erro ao processar entrada de ração.' });
            } else {
                res.status(201).json({ message: 'Entrada de ração registrada com sucesso!' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao processar entrada de ração.' });
    }
});

// Página de distribuição para matrizes
app.get('/distribuicaoMatrizes', (req, res) => {
    res.sendFile(__dirname + '/distribuicaoMatrizes.html');
});

// Rota para processar distribuição para matrizes
app.post('/distribuicaoMatrizes', async (req, res) => {
    try {
        const { quantidade } = req.body;

        // Atualizar estoque
        await atualizarEstoque('Matrizes', quantidade);

        // Salvar distribuição no banco de dados
        const query = 'INSERT INTO distribuicaomatrizes (quantidade) VALUES (?)';
        connection.query(query, [quantidade], (error, results) => {
            if (error) {
                console.error('Erro ao inserir distribuição para matrizes:', error);
                res.status(500).json({ message: 'Erro ao processar distribuição para matrizes.' });
            } else {
                res.status(201).json({ message: 'Distribuição para matrizes registrada com sucesso!' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao processar distribuição para matrizes.' });
    }
});

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

// Função para atualizar o estoque
async function atualizarEstoque(tipo, quantidade) {
    try {
        const query = 'UPDATE estoque SET quantidade = quantidade - ?';
        connection.query(query, [quantidade], (error, results) => {
            if (error) {
                console.error('Erro ao atualizar estoque:', error);
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
    }
}

// Página de relatório diário
app.get('/relatorioDiario', async (req, res) => {
    try {
        const totalRacaoFornecida = await calcularTotalRacaoFornecida();
        const estoqueAtual = await obterEstoqueAtual();
        res.status(200).json({ totalRacaoFornecida, estoqueAtual });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao gerar relatório diário.' });
    }
});

// Função para calcular o total de ração fornecida
async function calcularTotalRacaoFornecida() {
    try {
        const query = 'SELECT SUM(quantidadeRacao) AS total FROM entradaracao';
        return new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].total || 0);
                }
            });
        });
    } catch (error) {
        console.error('Erro ao calcular total de ração fornecida:', error);
        return 0;
    }
}

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

process.on('SIGINT', () => {
    connection.end();
    process.exit();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
