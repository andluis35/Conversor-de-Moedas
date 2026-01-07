document.addEventListener('DOMContentLoaded', () => {
    let moedaDe = null;
    let moedaPara = null;
    const dropdowns = document.querySelectorAll('.moeda-dropdown');

    dropdowns.forEach(dropdown => {
        const itens = dropdown.querySelectorAll('.dropdown-item');

        itens.forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();

                const sigla = item.dataset.currency;

                if (dropdown.closest('.de')) {
                    moedaDe = sigla;
                    console.log(`Moeda DE: ${moedaDe}`);
                }

                if (dropdown.closest('.para')) {
                    moedaPara = sigla;
                    console.log(`Moeda PARA: ${moedaPara}`);
                }

                if (moedaDe && moedaPara) {
                    buscarCotacao(moedaDe, moedaPara);
                }

            })
        })
    })
});

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
        document.querySelector('.taxa-conversao').innerText = data.bid;
        document.querySelector('.variacao').innerText = data.varBid;
    }
    catch (error) {
        console.log(error);
    }
    
}