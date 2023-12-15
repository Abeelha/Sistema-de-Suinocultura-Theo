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
    database: 'suinoculturaTheo',
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

async function obterEstoqueAtual() {
    try {
        const query = 'SELECT quantidade FROM estoque';
        return new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    // Check if there are any results
                    const estoqueAtual = results.length > 0 ? results[0].quantidade : 0;
                    resolve(estoqueAtual);
                }
            });
        });
    } catch (error) {
        console.error('Erro ao obter estoque atual:', error);
        return 0;
    }
}

async function atualizarEstoque(novoEstoque) {
    try {
        const updateQuery = 'UPDATE estoque SET quantidade = ?';
        return new Promise((resolve, reject) => {
            connection.query(updateQuery, [novoEstoque], (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
    }
}

// Route handler for updating stock manually
app.post('/atualizarEstoqueManual', async (req, res) => {
    try {
        // Your logic to update stock manually goes here
        // For example, you might call obterEExibirEstoqueAtual() to fetch the latest stock from the database

        // Assuming a successful update
        res.status(200).json({ success: true, message: 'Estoque atualizado manualmente.' });
    } catch (error) {
        console.error('Erro ao atualizar estoque manualmente:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar estoque manualmente.' });
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
                res.status(500).json({ message: 'Erro ao processar entrada de ração.' });
            } else {
                // Update stock in the estoque table
                atualizarEstoqueNoBanco(quantidadeRacao);

                // Send a success response
                res.status(201).json({ message: 'Entrada de ração registrada com sucesso!' });
            }
        });
    } catch (error) {
        console.error('Erro ao processar entrada de ração:', error);
        res.status(500).json({ message: 'Erro ao processar entrada de ração.' });
    }
});


async function atualizarEstoqueNoBanco(quantidadeRacao) {
    try {
        // Fetch the current stock from the database
        const estoqueAtual = await obterEstoqueAtual();

        // Update stock by adding the quantity
        const novoEstoque = estoqueAtual + quantidadeRacao;

        // Update the stock in the database
        await atualizarEstoque(novoEstoque);
    } catch (error) {
        console.error('Erro ao atualizar estoque no banco:', error);
    }
}

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

process.on('SIGINT', () => {
    connection.end();
    process.exit();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});
