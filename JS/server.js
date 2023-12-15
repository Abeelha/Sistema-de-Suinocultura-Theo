const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3002;

// Configuração de arquivos estáticos
app.use(express.static(path.join(__dirname, '../')));
app.use('/CSS', express.static(path.join(__dirname, '../CSS')));
app.use('/IMGs', express.static(path.join(__dirname, '../IMGs')));
app.use('/JS', express.static(path.join(__dirname, '../JS')));

// Configuração de middleware para processar JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração da conexão com o MySQL
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'admin',
    database: 'suinoculturaTheo',
});

// Conectar ao MySQL
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

// Rota para obter o total de entrada de ração
app.get('/totalEntradaRacao', async (req, res) => {
    try {
        const totalEntradaRacao = await calcularTotalEntradaRacao();
        res.status(200).json({ total: totalEntradaRacao });
    } catch (error) {
        console.error('Erro ao obter total de entrada de ração:', error);
        res.status(500).json({ error: 'Erro ao obter total de entrada de ração.' });
    }
});

// Rota para obter o total de distribuição para Berçário
app.get('/totalDistribuicao/bercario', async (req, res) => {
    try {
        const totalDistribuicaoBercario = await calcularTotalDistribuicao('Bercario');
        res.status(200).json({ total: totalDistribuicaoBercario });
    } catch (error) {
        console.error('Erro ao obter total de distribuição para Berçário:', error);
        res.status(500).json({ error: 'Erro ao obter total de distribuição para Berçário.' });
    }
});

// Rota para obter o total de distribuição para Machos
app.get('/totalDistribuicao/machos', async (req, res) => {
    try {
        const totalDistribuicaoMachos = await calcularTotalDistribuicao('Machos');
        res.status(200).json({ total: totalDistribuicaoMachos });
    } catch (error) {
        console.error('Erro ao obter total de distribuição para Machos:', error);
        res.status(500).json({ error: 'Erro ao obter total de distribuição para Machos.' });
    }
});

// Rota para obter o total de distribuição para Matrizes
app.get('/totalDistribuicao/matrizes', async (req, res) => {
    try {
        const totalDistribuicaoMatrizes = await calcularTotalDistribuicao('Matrizes');
        res.status(200).json({ total: totalDistribuicaoMatrizes });
    } catch (error) {
        console.error('Erro ao obter total de distribuição para Matrizes:', error);
        res.status(500).json({ error: 'Erro ao obter total de distribuição para Matrizes.' });
    }
});

// Função para calcular o total de entrada de ração
async function calcularTotalEntradaRacao() {
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
        console.error('Erro ao calcular total de entrada de ração:', error);
        return 0;
    }
}

// Função para calcular o total de distribuição para uma categoria específica
async function calcularTotalDistribuicao(categoria) {
    try {
        const query = `SELECT SUM(quantidade) AS total FROM distribuicao${categoria.toLowerCase()}`;
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
        console.error(`Erro ao calcular total de distribuição para ${categoria}:`, error);
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

// Função para atualizar o estoque
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

// Rota para atualizar o estoque manualmente
app.post('/atualizarEstoqueManual', async (req, res) => {
    try {
        // Supondo uma atualização bem-sucedida
        res.status(200).json({ success: true, message: 'Estoque atualizado manualmente.' });
    } catch (error) {
        console.error('Erro ao atualizar estoque manualmente:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar estoque manualmente.' });
    }
});

// Função para realizar a distribuição
async function realizarDistribuicao(categoria, quantidade) {
    try {
        // Verificar se há estoque suficiente
        const estoqueAtual = await obterEstoqueAtual();
        if (quantidade > estoqueAtual) {
            throw new Error(`Quantidade insuficiente em estoque para ${categoria}.`);
        }

        // Atualizar estoque subtraindo a quantidade
        const novoEstoque = estoqueAtual - quantidade;
        await atualizarEstoque(novoEstoque);

        // Salvar a distribuição na tabela correspondente
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

// Rota para distribuir para Matrizes
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

// Rota para distribuir para Machos
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

// Rota para distribuir para Berçário
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

// Rota para registrar entrada de ração
app.post('/entradaracao', async (req, res) => {
    try {
        // Extrair dados do corpo da requisição
        const { quantidadeRacao } = req.body;

        // Inserir dados na tabela entradaracao
        const insertQuery = 'INSERT INTO entradaracao (quantidadeRacao, data) VALUES (?, CURRENT_TIMESTAMP)';
        connection.query(insertQuery, [quantidadeRacao], (error, results) => {
            if (error) {
                console.error('Erro ao inserir entrada de ração:', error);
                res.status(500).json({ message: 'Erro ao processar entrada de ração.' });
            } else {
                // Atualizar estoque na tabela estoque
                atualizarEstoqueNoBanco(quantidadeRacao);

                // Enviar uma resposta de sucesso
                res.status(201).json({ message: 'Entrada de ração registrada com sucesso!' });
            }
        });
    } catch (error) {
        console.error('Erro ao processar entrada de ração:', error);
        res.status(500).json({ message: 'Erro ao processar entrada de ração.' });
    }
});

// Função para atualizar o estoque no banco de dados
async function atualizarEstoqueNoBanco(quantidadeRacao) {
    try {
        // Obter o estoque atual do banco de dados
        const estoqueAtual = await obterEstoqueAtual();

        // Converter o estoque atual e a quantidade para inteiros
        const estoqueAtualInt = parseInt(estoqueAtual, 10);
        const quantidadeRacaoInt = parseInt(quantidadeRacao, 10);

        // Verificar se a conversão foi bem-sucedida
        if (isNaN(estoqueAtualInt) || isNaN(quantidadeRacaoInt)) {
            throw new Error('Erro ao converter valores para números inteiros.');
        }

        // Atualizar estoque adicionando a quantidade
        const novoEstoque = estoqueAtualInt + quantidadeRacaoInt;

        // Atualizar o estoque no banco de dados
        await atualizarEstoque(novoEstoque);
    } catch (error) {
        console.error('Erro ao atualizar estoque no banco:', error);
    }
}

// Rota para obter o estoque atual
app.get('/estoque', async (req, res) => {
    try {
        const estoqueAtual = await obterEstoqueAtual();
        res.status(200).json({ quantidade: estoqueAtual });
    } catch (error) {
        console.error('Erro ao obter estoque:', error);
        res.status(500).json({ error: 'Erro ao obter estoque.' });
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
// Rota para gerar o relatório diário
app.get('/relatorio_diario', async (req, res) => {
    try {
        // Obter a data atual
        const currentDate = new Date().toISOString().split('T')[0];

        // Consultar dados de entradaracao para hoje
        const entradaracaoQuery = 'SELECT SUM(quantidadeRacao) AS totalEntrada FROM entradaracao WHERE DATE(data) = ?';
        const entradaracaoResults = await queryDatabase(entradaracaoQuery, [currentDate]);
        const totalEntradaRacao = entradaracaoResults[0].totalEntrada || 0;

        // Consultar dados de distribuicao para hoje
        const distribuicaoQuery = 'SELECT categoria, SUM(quantidade) AS totalDistribuicao FROM distribuicao WHERE DATE(data) = ? GROUP BY categoria';
        const distribuicaoResults = await queryDatabase(distribuicaoQuery, [currentDate]);
        const relatorioDiario = {
            totalEntradaRacao,
            distribuicao: distribuicaoResults,
        };

        // Enviar o relatório diário como JSON
        res.json(relatorioDiario);
    } catch (error) {
        console.error('Erro ao gerar relatório diário:', error);
        res.status(500).json({ message: 'Erro ao gerar relatório diário.' });
    }
});

// Função para realizar uma consulta no banco de dados e retornar uma Promise
function queryDatabase(query, values) {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// Tratamento de encerramento da aplicação
process.on('SIGINT', () => {
    connection.end();
    process.exit();
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});