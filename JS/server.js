const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const helmet = require('helmet');
const app = express();
const PORT = 3002;

app.use('/CSS', express.static(path.join(__dirname, '../CSS')));
app.use('/IMGs', express.static(path.join(__dirname, '../IMGs')));
app.use('/JS', express.static(path.join(__dirname, '../JS')));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'admin',
    database: 'SuinoCulturaTheo',
});

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        throw err;
    }
    console.log('Conectado ao MySQL');
});
// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Rotas para páginas específicas
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

// Rota para obter o estoque atual
app.get('/estoque', async (req, res) => {
    try {
        const estoqueAtual = await obterEstoqueAtual();
        res.json({ quantidade: estoqueAtual });
    } catch (error) {
        console.error('Erro ao obter estoque:', error);
        res.status(500).json({ message: 'Erro ao obter estoque.' });
    }
});


// Rota para processar distribuição para berçário
app.post('/distribuicaoBercario', async (req, res) => {
    try {
        const { quantidade } = req.body;

        // Atualizar estoque
        await atualizarEstoque('Berçário', quantidade);

        // Salvar distribuição no banco de dados
        const query = 'INSERT INTO distribuicaobercario (quantidade) VALUES (?)';
        connection.query(query, [quantidade], (error, results) => {
            if (error) {
                console.error('Erro ao inserir distribuição para berçário:', error);
                res.status(500).json({ message: 'Erro ao processar distribuição para berçário.' });
            } else {
                res.status(201).json({ message: 'Distribuição para berçário registrada com sucesso!' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao processar distribuição para berçário.' });
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

// Função para atualizar o estoque
async function atualizarEstoque(quantidade) {
    try {
        const estoqueAtual = await obterEstoqueAtual();
        const novoEstoque = estoqueAtual + quantidade;

        const query = 'UPDATE estoque SET quantidade = ?';
        connection.query(query, [novoEstoque], (error) => {
            if (error) {
                console.error('Erro ao atualizar estoque:', error);
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
    }
}

// Rota para obter o relatório diário com base na data
app.get('/relatorioDiario', async (req, res) => {
    try {
        const { data } = req.query; // Obtenha a data da consulta de parâmetro
        const query = 'SELECT SUM(quantidadeRacao) AS totalRacaoFornecida FROM entradaracao WHERE data = ?';
        const [results] = await connection.promise().execute(query, [data]);
        const totalRacaoFornecida = results[0]?.totalRacaoFornecida || 0;

        // Exemplo de consulta ao banco de dados para obter o estoque atual
        const estoqueQuery = 'SELECT quantidade FROM estoque';
        const [estoqueResults] = await connection.promise().execute(estoqueQuery);
        const estoqueAtual = estoqueResults[0]?.quantidade || 0;

        res.json({ totalRacaoFornecida, estoqueAtual });
    } catch (error) {
        console.error('Erro ao obter relatório diário:', error);
        res.status(500).json({ message: 'Erro ao obter relatório diário.' });
    }
});


process.on('SIGINT', () => {
    connection.end();
    process.exit();
});

app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});
