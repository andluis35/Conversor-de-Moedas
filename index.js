import axios from 'axios';
import express from 'express';

const app = express();
const PORT = 3000;
const API_BASE_URL = 'https://economia.awesomeapi.com.br/last';

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

app.get('/', async (req, res) => {
    res.render('index');
});

app.post('/cotacao', async (req, res) => {
    const { de, para } = req.body;
    const url = `${API_BASE_URL}/${de}-${para}`;

    try {
        const response = await axios.get(url);
        const chave = `${de}${para}`;
        const cotacao = response.data[chave];

        if (!cotacao) {
            return res.status(400).json({ erro: 'Par de moedas inválido' });
        }

        res.json(cotacao);
    }
    catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ erro: 'Cotação não encontrada' });
        }
    }
})

app.listen(PORT, () => {
    console.log(`Servidor rodando em localhost:${PORT}`);
})