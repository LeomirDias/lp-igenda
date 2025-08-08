// Smooth scroll para navegação interna (funciona em produção na Vercel)
// - Garante fallback quando scrollIntoView não está disponível
// - Evita capturar links externos
// - Reaplica listeners após navegação do history
(function () {
    function smoothScrollTo(targetElement) {
        if (!targetElement) return;
        try {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) {
            // Fallback para navegadores sem suporte completo
            var top = targetElement.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }
    }

    function handleClick(event) {
        var href = this.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        smoothScrollTo(target);
        // Atualiza a hash sem recarregar
        if (history && history.pushState) {
            history.pushState(null, '', href);
        } else {
            location.hash = href;
        }
    }

    function initSmoothScroll() {
        var links = document.querySelectorAll('a.scroll-link[href^="#"]');
        links.forEach(function (link) {
            // Evita duplicar listeners em hot reload
            link.removeEventListener('click', handleClick);
            link.addEventListener('click', handleClick, { passive: false });
        });

        // Se acessou a página já com hash, aplica o scroll suave
        if (location.hash) {
            var targetOnLoad = document.querySelector(location.hash);
            if (targetOnLoad) {
                // Timeout para aguardar layout/render
                setTimeout(function () {
                    smoothScrollTo(targetOnLoad);
                }, 0);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmoothScroll);
    } else {
        initSmoothScroll();
    }
})();


