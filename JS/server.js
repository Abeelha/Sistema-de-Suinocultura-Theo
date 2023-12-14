const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;
const path = require('path');

// Configuração do Mongoose
// mongoose.connect("mongodb://localhost:27017/SuinoCulturaTheo");
mongoose.connect("mongodb://localhost:27017/SuinoCulturaTheo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Modelos de dados
const entradaracao = mongoose.model('entradaracao', {
    quantidade: Number,
    data: { type: Date, default: Date.now },
});

const DistribuicaoMatrizes = mongoose.model('DistribuicaoMatrizes', {
    quantidade: Number,
    data: { type: Date, default: Date.now },
});

const DistribuicaoBercario = mongoose.model('DistribuicaoBercario', {
    quantidade: Number,
    data: { type: Date, default: Date.now },
});

const DistribuicaoMachos = mongoose.model('DistribuicaoMachos', {
    quantidade: Number,
    data: { type: Date, default: Date.now },
});

const Estoque = mongoose.model('Estoque', {
    quantidade: Number,
});

// Configuração do body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Pegar CSS e IMGs
app.use('/css', express.static(path.join(__dirname, '../CSS')));
app.use('/imgs', express.static(path.join(__dirname, '../IMGs')));

//Pegar JS
app.use(express.static(path.join(__dirname, 'JS')));


// Página de entrada de ração
app.get('/entradaracao', (req, res) => {
    res.sendFile(path.join(__dirname, '../entrada_racao.html'));
});

// Rota para processar entrada de ração
app.post('/entradaracao', async (req, res) => {
    try {
        const { quantidade } = req.body;

        // Salvar entrada no banco de dados
        const entradaracao = new entradaracao({ quantidade });
        await entradaracao.save();

        res.status(201).json({ message: 'Entrada de ração registrada com sucesso!' });
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
        const distribuicaoMatrizes = new DistribuicaoMatrizes({ quantidade });
        await distribuicaoMatrizes.save();

        res.status(201).json({ message: 'Distribuição para matrizes registrada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao processar distribuição para matrizes.' });
    }
});

// Rota para obter estoque atual
app.get('/estoque', async (req, res) => {
    try {
        const estoque = await Estoque.findOne();
        res.status(200).json({ quantidade: estoque ? estoque.quantidade : 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao obter estoque.' });
    }
});

// Função para atualizar o estoque
async function atualizarEstoque(tipo, quantidade) {
    try {
        // Obter o estoque atual
        const estoque = await Estoque.findOne();

        // Atualizar o estoque com base no tipo (Matrizes, Berçário, Machos, etc.)
        // Aqui você precisa adaptar a lógica conforme sua implementação

        // Salvar o estoque atualizado no banco de dados
        if (estoque) {
            estoque.quantidade -= quantidade;
            await estoque.save();
        }
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
    }
}

// Página de relatório diário
app.get('/relatorioDiario', async (req, res) => {
    try {
        // Calcular total de ração fornecida
        const totalRacaoFornecida = await calcularTotalRacaoFornecida();

        // Obter estoque atual
        const estoqueAtual = await obterEstoqueAtual();

        // Enviar resposta com os dados do relatório diário
        res.status(200).json({ totalRacaoFornecida, estoqueAtual });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao gerar relatório diário.' });
    }
});

// Função para calcular o total de ração fornecida
async function calcularTotalRacaoFornecida() {
    try {
        const entradas = await entradaracao.find();
        return entradas.reduce((total, entrada) => total + entrada.quantidade, 0);
    } catch (error) {
        console.error('Erro ao calcular total de ração fornecida:', error);
        return 0;
    }
}

// Função para obter o estoque atual
async function obterEstoqueAtual() {
    try {
        const estoque = await Estoque.findOne();
        return estoque ? estoque.quantidade : 0;
    } catch (error) {
        console.error('Erro ao obter estoque atual:', error);
        return 0;
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
