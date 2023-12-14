const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3002;

app.use('/CSS', express.static(path.join(__dirname, '../CSS')));
app.use('/IMGs', express.static(path.join(__dirname, '../IMGs')));
app.use('/JS', express.static(path.join(__dirname, '../JS')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

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

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/:page', (req, res) => {
    const page = req.params.page;
    if (page === 'index.html') {
        res.sendFile(path.join(__dirname, '../index.html'));
    } else {
        res.sendFile(path.join(__dirname, `../${page}.html`));
    }
});
// Página de distribuição para berçário
app.get('/distribuicaoBercario', (req, res) => {
    res.sendFile(path.join(__dirname, '../distribuicao_bercario.html'));
});

app.get('/controle_estoque', (req, res) => {
    res.sendFile(path.join(__dirname, '../controle_estoque.html'));
});

// Entrada de Ração
app.post('/entradaracao', async (req, res) => {
    try {
        const { quantidadeRacao, validadeRacao } = req.body;
        const quantidade = parseInt(quantidadeRacao);

        // Atualizar estoque
        await atualizarEstoque(quantidade);

        const query = 'INSERT INTO entradaracao (quantidadeRacao, validadeRacao) VALUES (?, ?)';
        connection.query(query, [quantidade, validadeRacao], (error, results) => {
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

// Distribuição para Matrizes
app.post('/distribuicaoMatrizes', async (req, res) => {
    try {
        const { quantidade } = req.body;

        await atualizarEstoque('Matrizes', quantidade);

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

// Distribuição para Machos
app.post('/distribuicaoMachos', async (req, res) => {
    try {
        const { quantidade } = req.body;

        await atualizarEstoque('Machos', quantidade);

        const query = 'INSERT INTO distribuicaomachos (quantidade) VALUES (?)';
        connection.query(query, [quantidade], (error, results) => {
            if (error) {
                console.error('Erro ao inserir distribuição para machos:', error);
                res.status(500).json({ message: 'Erro ao processar distribuição para machos.' });
            } else {
                res.status(201).json({ message: 'Distribuição para machos registrada com sucesso!' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao processar distribuição para machos.' });
    }
});

// Obter estoque atual
app.get('/estoque', async (req, res) => {
    try {
        const estoque = await obterEstoqueAtual();
        res.status(200).json({ quantidade: estoque });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao obter estoque.' });
    }
});

// Relatório Diário
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
process.on('SIGINT', () => {
    connection.end();
    process.exit();
});

app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});
