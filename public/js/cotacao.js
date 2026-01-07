const valorInput = document.getElementById('valor-a-converter');
const valorOutput = document.getElementById('valor-convertido');
const botaoSwap = document.querySelector('.botao-swap');
let moedaDe = null;
let moedaPara = null;

document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.moeda-dropdown');

    dropdowns.forEach(dropdown => {
        const itens = dropdown.querySelectorAll('.dropdown-item');

        itens.forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();

                const sigla = item.dataset.currency;

                if (dropdown.closest('.de')) {
                    moedaDe = sigla;
                }

                if (dropdown.closest('.para')) {
                    moedaPara = sigla;
                }

                atualizarCotacao();
                atualizarConversao();
            })
        })
    })

    valorInput.addEventListener('input', () => {
        atualizarConversao();
    });

    botaoSwap.addEventListener('click', () => {
        if (!moedaDe || !moedaPara) {
            return;
        }
        [moedaDe, moedaPara] = [moedaPara, moedaDe];

        atualizarCotacao();
        atualizarConversao();
    })
});

function atualizarConversao() {
    const valor = parseFloat(valorInput.value);

    if (!valorInput.value || isNaN(valor)) {
        valorOutput.value = '';
        return;
    }

    if (!moedaDe || !moedaPara) {
        return;
    }

    const taxa = parseFloat(document.querySelector('.taxa-conversao').innerText);

    if (!taxa) {
        return;
    }

    const valorConvertido = valor * taxa;

    valorOutput.value = valorConvertido.toFixed(2);
}

function atualizarCotacao() {
    if (moedaDe && moedaPara) {
        buscarCotacao(moedaDe, moedaPara);
    }
}

async function buscarCotacao(de, para) {

    try {
        const res = await fetch('/cotacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ de, para })
        });

        const data = await res.json();
        document.querySelector('.taxa-conversao').innerText = `${data.bid} ℹ️`;
        document.querySelector('.variacao').innerText = `${data.varBid} ℹ️`;

        atualizarConversao();
        definirRecomendacao(data);
    }
    catch (error) {
        console.log(error);
    }
    
}

function definirRecomendacao(data) {
    const contextoEconomico = document.querySelector('.recomendacao');
    const variacao = parseFloat(data.pctChange).toFixed(2);
    if (data.pctChange < 0) {
        contextoEconomico.innerText = `✅ ${data.code} caiu ${variacao}%. Converter hoje está mais barato ℹ️`;
    }
    else if (data.pctChange > 0) {
        contextoEconomico.innerText = `❌ ${data.code} subiu ${variacao}%. Converter hoje está mais caro ℹ️`;
    }
    else {
        contextoEconomico.innerText = `➖ ${data.code} manteve-se estável. Conversão sem impacto relevante ℹ️`;
    }
}