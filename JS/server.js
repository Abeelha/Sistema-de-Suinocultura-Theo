const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = 3002;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'SuinoCulturaTheo',
    password: 'admin123',
    port: 5432,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ... (restante do código)

app.post('/entradaracao', async (req, res) => {
    try {
        const { nomeRacao, quantidadeRacao, validadeRacao } = req.body;
        const quantidade = parseInt(quantidadeRacao);

        const result = await pool.query('INSERT INTO entradaracao (nomeRacao, quantidadeRacao, validadeRacao) VALUES ($1, $2, $3) RETURNING id', [nomeRacao, quantidade, validadeRacao]);
        await pool.query('INSERT INTO estoque (quantidade) VALUES ($1)', [quantidade]);

        res.status(201).json({ message: 'Entrada de ração registrada com sucesso!', id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao processar entrada de ração.' });
    }
});

app.post('/distribuicao', async (req, res) => {
    try {
        const { tabela, quantidade } = req.body;

        await pool.query('INSERT INTO estoque (quantidade) VALUES ($1)', [quantidade]);
        const result = await pool.query(`INSERT INTO distribuicao${tabela.toLowerCase()} (quantidade) VALUES ($1) RETURNING id`, [quantidade]);

        res.status(201).json({ message: `Distribuição para ${tabela} registrada com sucesso!`, id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Erro ao processar distribuição para ${tabela}.` });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
