// Configuração do Pixel Facebook
export const FB_PIXEL_CONFIG = {
    // ID do Pixel
    PIXEL_ID: "1097411068422376",

    // Eventos padrão do Facebook
    STANDARD_EVENTS: {
        PAGE_VIEW: "PageView",
        LEAD: "Lead",
        INITIATE_CHECKOUT: "InitiateCheckout",
        ADD_TO_CART: "AddToCart",
        PURCHASE: "Purchase",
        VIEW_CONTENT: "ViewContent",
        SEARCH: "Search",
        CONTACT: "Contact"
    },

    // Eventos personalizados
    CUSTOM_EVENTS: {
        PLANO_MENSAL: "PlanoMensalClicado",
        PLANO_TRIMESTRAL: "PlanoTrimestralClicado",
        PLANO_SEMESTRAL: "PlanoSemestralClicado",
        VISUALIZACAO_PLANOS: "VisualizacaoDePlanosClicado",
        SCROLL_25: "Scroll25",
        SCROLL_50: "Scroll50",
        SCROLL_75: "Scroll75",
        TIME_ON_PAGE: "TimeOnPage"
    },

    // Parâmetros padrão para eventos
    DEFAULT_PARAMS: {
        content_name: "iGenda Landing Page",
        content_category: "Software de Agendamento",
        content_type: "product",
        currency: "BRL",
        value: 19.90
    },

    // Configurações de debug
    DEBUG: {
        ENABLED: true,
        LOG_EVENTS: true,
        LOG_ERRORS: true,
        VERBOSE: false
    }
};

// Função para verificar se o pixel está carregado
export function isPixelLoaded() {
    return window.fbq && window.fbq.loaded;
}

// Função para aguardar o pixel carregar
export function waitForPixel(timeout = 5000) {
    return new Promise((resolve) => {
        if (isPixelLoaded()) {
            resolve();
            return;
        }

        const checkInterval = setInterval(() => {
            if (isPixelLoaded()) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);

        setTimeout(() => {
            clearInterval(checkInterval);
            resolve();
        }, timeout);
    });
}

// Função para enviar eventos de forma segura
export function sendPixelEvent(eventName, parameters = {}) {
    if (!isPixelLoaded()) {
        if (FB_PIXEL_CONFIG.DEBUG.LOG_ERRORS) {
            console.warn("⚠️ Pixel FB não carregado ainda para evento:", eventName);
        }
        return false;
    }

    try {
        // Mesclar parâmetros padrão com os fornecidos
        const finalParams = { ...FB_PIXEL_CONFIG.DEFAULT_PARAMS, ...parameters };

        // Enviar evento
        window.fbq("track", eventName, finalParams);

        if (FB_PIXEL_CONFIG.DEBUG.LOG_EVENTS) {
            console.log("✅ Evento FB enviado:", eventName, finalParams);
        }

        return true;
    } catch (error) {
        if (FB_PIXEL_CONFIG.DEBUG.LOG_ERRORS) {
            console.error("❌ Erro ao enviar evento FB:", eventName, error);
        }
        return false;
    }
}

// Função para debug do pixel
export function debugPixel() {
    console.log("🔍 === DEBUG PIXEL FACEBOOK ===");
    console.log("Pixel ID:", FB_PIXEL_CONFIG.PIXEL_ID);
    console.log("fbq disponível:", !!window.fbq);
    console.log("fbq.loaded:", window.fbq?.loaded);
    console.log("fbq.version:", window.fbq?.version);
    console.log("fbq.queue:", window.fbq?.queue);

    // Verificar se o script foi carregado
    const script = document.querySelector('script[src*="fbevents.js"]');
    console.log("Script FB carregado:", !!script);

    // Verificar elementos com data-fb-event
    const eventElements = document.querySelectorAll("[data-fb-event]");
    console.log("Elementos com data-fb-event:", eventElements.length);
    eventElements.forEach((el, index) => {
        console.log(`  ${index + 1}:`, el.tagName, el.getAttribute("data-fb-event"), el.textContent?.trim());
    });

    console.log("=====================================");
}

// Função para inicializar rastreamento automático
export function initPixelTracking() {
    // Aguardar o pixel estar pronto
    waitForPixel().then(() => {
        if (FB_PIXEL_CONFIG.DEBUG.ENABLED) {
            debugPixel();
        }

        // Rastrear visualização da página
        sendPixelEvent(FB_PIXEL_CONFIG.STANDARD_EVENTS.PAGE_VIEW);

        // Configurar rastreamento de eventos personalizados
        document.querySelectorAll("button, a[data-fb-event]").forEach((el) => {
            el.addEventListener("click", (e) => {
                const eventName = el.getAttribute("data-fb-event");
                const eventType = el.tagName === "A" ? "link_click" : "button_click";

                // Enviar evento personalizado
                sendPixelEvent("CustomEvent", {
                    event_name: eventName,
                    event_type: eventType,
                    element_text: el.textContent?.trim() || "",
                    url: el.href || window.location.href
                });

                // Enviar evento padrão do Facebook
                sendPixelEvent(FB_PIXEL_CONFIG.STANDARD_EVENTS.LEAD);

                // Rastrear conversão se for um botão de plano
                if (eventName && eventName.includes("Plano")) {
                    sendPixelEvent(FB_PIXEL_CONFIG.STANDARD_EVENTS.INITIATE_CHECKOUT, {
                        content_name: eventName,
                        value: FB_PIXEL_CONFIG.DEFAULT_PARAMS.value,
                        currency: FB_PIXEL_CONFIG.DEFAULT_PARAMS.currency
                    });
                }
            });
        });

        // Rastrear tempo na página
        let startTime = Date.now();
        window.addEventListener("beforeunload", () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            sendPixelEvent(FB_PIXEL_CONFIG.CUSTOM_EVENTS.TIME_ON_PAGE, { value: timeOnPage });
        });

        // Rastrear scroll
        let maxScroll = 0;
        window.addEventListener("scroll", () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll >= 25 && maxScroll < 50) {
                    sendPixelEvent(FB_PIXEL_CONFIG.CUSTOM_EVENTS.SCROLL_25);
                } else if (maxScroll >= 50 && maxScroll < 75) {
                    sendPixelEvent(FB_PIXEL_CONFIG.CUSTOM_EVENTS.SCROLL_50);
                } else if (maxScroll >= 75) {
                    sendPixelEvent(FB_PIXEL_CONFIG.CUSTOM_EVENTS.SCROLL_75);
                }
            }
        });

        if (FB_PIXEL_CONFIG.DEBUG.LOG_EVENTS) {
            console.log("🚀 Pixel FB configurado e funcionando!");
        }
    });
}
