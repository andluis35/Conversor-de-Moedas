import axios from 'axios';
import express from 'express';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em localhost:${PORT}`);
})