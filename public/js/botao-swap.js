const botaoSwap = document.querySelector('.botao-swap');

botaoSwap.addEventListener('click', () => {
    const dropdowns = document.querySelectorAll('.moeda-dropdown');
    let botaoDe = dropdowns[0].querySelector('.botao-moeda');
    let botaoPara = dropdowns[1].querySelector('.botao-moeda');
    let tempBotao = '';

    tempBotao = botaoDe.innerHTML;
    botaoDe.innerHTML = botaoPara.innerHTML;
    botaoPara.innerHTML = tempBotao;
});