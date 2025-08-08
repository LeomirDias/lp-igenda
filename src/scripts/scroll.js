// src/scripts/scroll.js
// Este arquivo permanece por compatibilidade, mas recomenda-se usar /scroll.js via public
(function redirectToPublic() {
    if (typeof window === 'undefined') return;
    // Se já existe o global do smooth, não faz nada
    if (window.__smoothScrollInitialized) return;
    // Injeta o script público se por algum motivo este arquivo foi importado
    var existing = document.querySelector('script[data-injected-scroll="1"]');
    if (existing) return;
    var s = document.createElement('script');
    s.src = '/scroll.js';
    s.defer = true;
    s.setAttribute('data-injected-scroll', '1');
    document.head.appendChild(s);
})();
