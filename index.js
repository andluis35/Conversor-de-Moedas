import axios from 'axios';
import express from 'express';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

app.get('/', async (req, res) => {
    res.render('index');
});

app.post('/cotacao', async (req, res) => {
    const { de, para } = req.body;
    const url = `https://economia.awesomeapi.com.br/last/${de}-${para}`;

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
        console.log(error);
        res.status(500).json({ erro: 'Erro ao buscar cotação' });
    }
})

app.listen(PORT, () => {
    console.log(`Servidor rodando em localhost:${PORT}`);
})