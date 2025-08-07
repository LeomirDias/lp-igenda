// src/scripts/scroll.js

// Função para inicializar o scroll suave
function initSmoothScroll() {
    console.log('Inicializando scroll suave...');

    // Seleciona todos os links com a classe 'scroll-link'
    const scrollLinks = document.querySelectorAll('a.scroll-link');
    console.log(`Encontrados ${scrollLinks.length} links de scroll`);

    scrollLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const href = link.getAttribute('href');
            console.log(`Clicou no link: ${href}`);

            // Verifica se o href começa com #
            if (!href || !href.startsWith('#')) {
                console.warn(`Href inválido: ${href}`);
                return;
            }

            const target = document.querySelector(href);
            if (!target) {
                console.warn(`Elemento não encontrado: ${href}`);
                return;
            }

            console.log(`Fazendo scroll para: ${href}`);
            // Scroll suave customizado
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });
    });
}

// Aguarda o DOM estar completamente carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
    // Se o DOM já está carregado, executa imediatamente
    initSmoothScroll();
}
