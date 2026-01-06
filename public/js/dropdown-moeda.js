document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll(".moeda-dropdown");

    dropdowns.forEach(dropdown => {
        const botao = dropdown.querySelector('.botao-moeda');
        const itens = dropdown.querySelectorAll('.dropdown-item');

        itens.forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();

                const nomeMoeda = item.textContent.trim();
                const type = item.dataset.type;
                const icon = item.dataset.icon;

                let iconHTML = '';

                if (type === 'flag') {
                    iconHTML = `<span class="fi fi-${icon} me-2"></span>`;
                }
                else if (type === 'img') {
                    iconHTML = `<img src="${icon}" class="crypto-icon me-2" alt="">`;
                }
                
                botao.innerHTML = `${iconHTML} ${nomeMoeda}`;
            });
        });
    });
});
