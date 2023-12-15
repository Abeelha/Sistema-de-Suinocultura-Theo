const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3002;

app.use('/CSS', express.static(path.join(__dirname, '../CSS')));
app.use('/IMGs', express.static(path.join(__dirname, '../IMGs')));
app.use('/JS', express.static(path.join(__dirname, '../JS')));

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

// Redirecionar /controle_estoque para /controle_estoque.html
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
async function realizarDistribuicao(categoria, quantidade) {
    try {
        // Check if there is enough stock
        const estoqueAtual = await obterEstoqueAtual();
        if (quantidade > estoqueAtual) {
            throw new Error(`Quantidade insuficiente em estoque para ${categoria}.`);
        }

        // Update stock by subtracting the quantity
        const novoEstoque = estoqueAtual - quantidade;
        await atualizarEstoque(novoEstoque);

        // Save distribution to the corresponding table
        const insertQuery = `INSERT INTO distribuicao${categoria.toLowerCase()} (quantidade) VALUES (?)`;
        connection.query(insertQuery, [quantidade], (error, results) => {
            if (error) {
                console.error(`Erro ao inserir distribuição para ${categoria}:`, error);
            }
        });

        return true;
    } catch (error) {
        console.error(`Erro ao realizar distribuição para ${categoria}:`, error);
        return false;
    }
}
// Route handler for distributing to Matrizes
app.post('/distribuicaoMatrizes', async (req, res) => {
    try {
        const { quantidade } = req.body;
        const sucesso = await realizarDistribuicao('Matrizes', quantidade);

        if (sucesso) {
            res.status(201).json({ message: 'Distribuição para Matrizes registrada com sucesso!' });
        } else {
            res.status(500).json({ message: 'Erro ao processar distribuição para Matrizes.' });
        }
    } catch (error) {
        console.error('Erro ao processar distribuição para Matrizes:', error);
        res.status(500).json({ message: 'Erro ao processar distribuição para Matrizes.' });
    }
});

// Route handler for distributing to Machos
app.post('/distribuicaoMachos', async (req, res) => {
    try {
        const { quantidade } = req.body;
        const sucesso = await realizarDistribuicao('Machos', quantidade);

        if (sucesso) {
            res.status(201).json({ message: 'Distribuição para Machos registrada com sucesso!' });
        } else {
            res.status(500).json({ message: 'Erro ao processar distribuição para Machos.' });
        }
    } catch (error) {
        console.error('Erro ao processar distribuição para Machos:', error);
        res.status(500).json({ message: 'Erro ao processar distribuição para Machos.' });
    }
});
// Route handler for distributing to Berçário
app.post('/distribuicaoBercario', async (req, res) => {
    try {
        const { quantidade } = req.body;
        const sucesso = await realizarDistribuicao('Bercario', quantidade);

        if (sucesso) {
            res.status(201).json({ message: 'Distribuição para Berçário registrada com sucesso!' });
        } else {
            res.status(500).json({ message: 'Erro ao processar distribuição para Berçário.' });
        }
    } catch (error) {
        console.error('Erro ao processar distribuição para Berçário:', error);
        res.status(500).json({ message: 'Erro ao processar distribuição para Berçário.' });
    }
});


app.post('/entradaracao', async (req, res) => {
    try {
        // Extract data from the request body
        const { quantidadeRacao } = req.body;

        // Insert data into entradaracao table
        const insertQuery = 'INSERT INTO entradaracao (quantidadeRacao, data) VALUES (?, CURRENT_TIMESTAMP)';
        connection.query(insertQuery, [quantidadeRacao], (error, results) => {
            if (error) {
                console.error('Erro ao inserir entrada de ração:', error);
                res.status(500).json({ success: false, message: 'Erro ao processar entrada de ração.' });
            } else {
                // Send a success response
                res.status(201).json({ success: true, message: 'Entrada de ração registrada com sucesso!' });
            }
        });
    } catch (error) {
        console.error('Erro ao processar entrada de ração:', error);
        res.status(500).json({ success: false, message: 'Erro ao processar entrada de ração.' });
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



process.on('SIGINT', () => {
    connection.end();
    process.exit();
});

app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});
