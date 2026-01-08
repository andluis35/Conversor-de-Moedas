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
        
        const dropdowns = document.querySelectorAll('.moeda-dropdown');
        let botaoDe = dropdowns[0].querySelector('.botao-moeda');
        let botaoPara = dropdowns[1].querySelector('.botao-moeda');

        [botaoDe.innerHTML, botaoPara.innerHTML] = [botaoPara.innerHTML, botaoDe.innerHTML];

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

    const taxa = parseFloat(document.querySelector('.valor-taxa').innerText);

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
        
        if (!res.ok) {
            mostrarErroCotacao();
            return;
        }
        
        const data = await res.json();
        const valorVariacao = parseFloat(data.varBid);
        let emojiVariacao = '➖';

        if (valorVariacao < 0) {
            emojiVariacao = '📉';
        }
        else if (valorVariacao > 0) {
            emojiVariacao = '📈';
        }


        document.querySelector('.taxa-conversao').innerHTML =
        `Taxa de Conversão
        <span class="info" data-bs-placement="bottom" title="Indica quanto vale 1 unidade da moeda escolhida em relação à outra. É essa taxa que usamos para calcular o valor convertido.">
            <i class="bi bi-info-circle"></i>
        </span>
        <br />
        <span class="valor-taxa">${data.bid}</span>`;

        document.querySelector('.variacao').innerHTML =
        `Variação atualizada
        <span class="info" data-bs-placement="bottom" title="Mostra quanto o preço subiu ou caiu (em VALOR) em relação à cotação anterior.">
            <i class="bi bi-info-circle"></i>
        </span>
        <br />
        ${emojiVariacao} ${data.varBid}`;

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

    if (variacao < 0) {
        contextoEconomico.innerHTML =
            `✅ ${data.code} caiu ${variacao}%.
            Converter hoje está mais barato!
            <span class="info" data-bs-placement="bottom" title="A queda indica redução no valor da moeda.">
                <i class="bi bi-info-circle"></i>
            </span>`;
    }
    else if (variacao > 0) {
        contextoEconomico.innerHTML =
            `❌ ${data.code} subiu ${variacao}%.
            Converter hoje está mais caro!
            <span class="info" data-bs-placement="bottom" title="Quando a moeda sobe, é necessário mais dinheiro para adquiri-la.">
                <i class="bi bi-info-circle"></i>
            </span>`;
    }
    else {
        contextoEconomico.innerHTML =
            `➖ ${data.code} manteve-se estável.
            Conversão sem impacto relevante!
            <span class="info" data-bs-placement="bottom" title="A variação foi mínima em relação ao dia anterior.">
                <i class="bi bi-info-circle"></i>
            </span>`;
    }
}

function mostrarErroCotacao() {
    document.querySelector('.taxa-conversao').innerHTML = `⚠️ Cotação indisponível`;
    document.querySelector('.variacao').innerHTML = `—`;
    document.querySelector('.recomendacao').innerHTML = `Essa conversão não está disponível no momento.`;
    document.getElementById('valor-convertido').value = '';

    document.getElementById('modalErroMensagem').innerText =
        'Não há cotação disponível para essa combinação de moedas.';

    const modal = new bootstrap.Modal(
        document.getElementById('modalErroCotacao')
    );
    modal.show();
}