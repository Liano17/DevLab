/* script.js
   Interações:
   - Menu mobile toggle
   - Smooth scroll
   - Accordion serviços
   - Modal preview para projetos
   - Form validation
   - Pequenas animações acessíveis
*/

document.addEventListener('DOMContentLoaded', () => {
    /* ===== Form validation & submission ===== */
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            const name = form.querySelector('input[name="name"]')?.value?.trim();
            const email = form.querySelector('input[name="email"]')?.value?.trim();
            const message = form.querySelector('textarea[name="message"]')?.value?.trim();

            if (!name || !email || !message) {
                e.preventDefault();
                alert('Por favor, preencha todos os campos obrigatórios (Nome, Email, Mensagem).');
                return;
            }

            // basic email validation
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                e.preventDefault();
                alert('Por favor, insira um email válido.');
                return;
            }
        });
    }

    /* ===== Mobile menu toggle ===== */
    const btnMenu = document.getElementById('btnMenu');
    const nav = document.getElementById('nav');

    function closeMenu() {
        btnMenu.classList.remove('active');
        nav.classList.remove('active');
        btnMenu.setAttribute('aria-expanded', 'false');
    }

    btnMenu.addEventListener('click', () => {
        const expanded = btnMenu.getAttribute('aria-expanded') === 'true';
        btnMenu.setAttribute('aria-expanded', String(!expanded));

        // Alternar classes (em vez de estilos inline)
        btnMenu.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) closeMenu();
    });

    /* ===== Smooth scroll for anchor links ===== */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const headerOffset = 80;
            const rect = target.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetY = rect.top + scrollTop - headerOffset;

            window.scrollTo({ top: targetY, behavior: 'smooth' });

            // Fechar menu mobile se estiver aberto
            if (nav.classList.contains('active')) closeMenu();
        });
    });

    /* ===== Accordion (serviços) ===== */
    const accItems = document.querySelectorAll('.acc-item');
    accItems.forEach(item => {
        const btn = item.querySelector('.acc-toggle');
        btn.addEventListener('click', () => {
            const open = item.classList.contains('active');
            // fechar todos
            accItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.acc-toggle').setAttribute('aria-expanded', 'false');
            });
            // abrir se estava fechado
            if (!open) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ===== Work cards -> modal preview ===== */
    const workCards = document.querySelectorAll('.work-card');
    workCards.forEach(card => {
        card.addEventListener('click', openWorkModal);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openWorkModal.call(card, e);
            }
        });
    });


});

/* Additional UI helpers: js-class, back-to-top button, project modal and CTAs */
document.addEventListener('DOMContentLoaded', () => {
    // mark that JS is available
    document.documentElement.classList.add('js');

    // reveal elements that use .no-js-fade for progressive enhancement
    document.querySelectorAll('.no-js-fade').forEach(el => el.classList.add('show'));

    // Back to top button (create once)
    const back = document.createElement('button');
    back.className = 'btn-backtop';
    back.setAttribute('aria-label', 'Voltar ao topo');
    back.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5l-7 7h4v7h6v-7h4l-7-7z" fill="currentColor"/></svg>';
    document.body.appendChild(back);

    function toggleBack() {
        if (window.scrollY > 320) back.classList.add('show');
        else back.classList.remove('show');
    }
    toggleBack();
    window.addEventListener('scroll', toggleBack, { passive: true });
    back.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        back.blur();
    });

    // Add CTAs inside work-cards (progressive enhancement)
    document.querySelectorAll('.work-card').forEach(card => {
        // ensure card is focusable
        if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');

        const cta = document.createElement('button');
        cta.className = 'work-cta btn btn-primary';
        cta.type = 'button';
        cta.setAttribute('aria-label', 'Ver projeto');
        cta.textContent = 'Ver Projeto';
        cta.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            openWorkModal.call(card, e);
        });
        // Also handle touch on the CTA button
        cta.addEventListener('touchend', (e) => {
            e.stopPropagation();
            e.preventDefault();
            openWorkModal.call(card, e);
        });
        card.appendChild(cta);
    });

    // Gallery lightbox modal for project previews (with navigation + keyboard + descriptions)
    let modalEl = null;

    (function setupGalleryLightbox() {
        const gallery = Array.from(document.querySelectorAll('.work-card'));
        let current = 0;
        let lastFocusedElement = null;  // track which card opened modal for focus restore

        function createModal() {
            modalEl = document.createElement('div');
            modalEl.className = 'work-modal';
            modalEl.innerHTML = `
              <div class="work-modal-panel" role="dialog" aria-modal="true" aria-label="Galeria de projectos">
                <button class="work-modal-close" aria-label="Fechar (ESC)">✕</button>
                
                <div class="work-modal-viewer">
                  <div class="work-modal-container">
                    <img class="work-modal-img" alt="preview" src="" />
                    <div class="work-modal-overlay">
                      <button class="work-modal-zoom-in" aria-label="Aproximar">+</button>
                      <button class="work-modal-zoom-out" aria-label="Afastar">−</button>
                      <button class="work-modal-zoom-reset" aria-label="Resetar zoom">⊙</button>
                      <button class="work-modal-fullscreen" aria-label="Tela cheia">⛶</button>
                    </div>
                    <div class="work-modal-spinner" aria-hidden="true">
                      <div class="spinner-ring"></div>
                    </div>
                  </div>
                  
                  <div class="work-modal-thumbs">
                    <div class="work-modal-thumbs-track"></div>
                  </div>
                </div>

                <div class="work-modal-controls">
                  <button class="work-modal-prev" aria-label="Anterior (←)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <div class="work-modal-info">
                    <h3 class="work-modal-title"></h3>
                    <p class="work-modal-desc"></p>
                    <div class="work-modal-counter"></div>
                  </div>
                  <button class="work-modal-next" aria-label="Próximo (→)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>`;
            document.body.appendChild(modalEl);

            // handlers
            modalEl.querySelector('.work-modal-close').addEventListener('click', hideModal);
            modalEl.querySelector('.work-modal-prev').addEventListener('click', showPrev);
            modalEl.querySelector('.work-modal-next').addEventListener('click', showNext);
            modalEl.querySelector('.work-modal-zoom-in').addEventListener('click', () => zoomIn());
            modalEl.querySelector('.work-modal-zoom-out').addEventListener('click', () => zoomOut());
            modalEl.querySelector('.work-modal-zoom-reset').addEventListener('click', () => zoomReset());
            modalEl.querySelector('.work-modal-fullscreen').addEventListener('click', toggleFullscreen);
            modalEl.addEventListener('click', (ev) => { if (ev.target === modalEl) hideModal(); });
            document.addEventListener('keydown', keyHandler);
        }

        // Zoom states
        let zoomLevel = 1;
        let panX = 0, panY = 0;

        function zoomIn() {
            zoomLevel = Math.min(zoomLevel + 0.2, 3);
            updateImageTransform();
        }

        function zoomOut() {
            zoomLevel = Math.max(zoomLevel - 0.2, 1);
            updateImageTransform();
        }

        function zoomReset() {
            zoomLevel = 1;
            panX = 0;
            panY = 0;
            updateImageTransform();
        }

        function updateImageTransform() {
            const imgEl = modalEl.querySelector('.work-modal-img');
            if (imgEl) imgEl.style.transform = `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
        }

        function toggleFullscreen() {
            const panel = modalEl.querySelector('.work-modal-panel');
            if (document.fullscreenElement) document.exitFullscreen();
            else if (panel.requestFullscreen) panel.requestFullscreen();
        }


        function keyHandler(e) {
            if (!modalEl || !modalEl.classList.contains('show')) return;
            if (e.key === 'Escape') { e.preventDefault(); hideModal(); return; }
            if (e.key === 'ArrowLeft') { e.preventDefault(); showPrev(); return; }
            if (e.key === 'ArrowRight') { e.preventDefault(); showNext(); return; }

            // Tab trap: keep focus inside modal
            if (e.key === 'Tab') {
                const focusables = Array.from(modalEl.querySelectorAll('[tabindex], button, a, input, textarea, select'));
                if (!focusables.length) return;
                const activeEl = document.activeElement;
                const focusIndex = focusables.indexOf(activeEl);

                if (e.shiftKey) {
                    // Shift+Tab: go to previous
                    if (focusIndex <= 0) {
                        e.preventDefault();
                        focusables[focusables.length - 1].focus();
                    }
                } else {
                    // Tab: go to next
                    if (focusIndex >= focusables.length - 1) {
                        e.preventDefault();
                        focusables[0].focus();
                    }
                }
            }
        }

        function showModalAt(index) {
            current = (index + gallery.length) % gallery.length;
            if (!modalEl) createModal();

            const item = gallery[current];
            const imgSrc = item.dataset.fullsrc || item.querySelector('img')?.src || '';
            const thumbSrc = item.querySelector('img')?.src || '';
            const title = item.dataset.title || item.querySelector('h3')?.innerText || '';
            const desc = item.dataset.desc || '';

            const imgEl = modalEl.querySelector('.work-modal-img');
            const titleEl = modalEl.querySelector('.work-modal-title');
            const descEl = modalEl.querySelector('.work-modal-desc');
            const counterEl = modalEl.querySelector('.work-modal-counter');
            const spinner = modalEl.querySelector('.work-modal-spinner');
            const thumbsTrack = modalEl.querySelector('.work-modal-thumbs-track');

            // Reset zoom
            zoomReset();

            // show spinner while loading
            spinner.style.display = 'block';
            imgEl.style.opacity = '0';
            imgEl.src = imgSrc;

            // Generate thumbnail strip
            if (thumbsTrack) {
                thumbsTrack.innerHTML = '';
                gallery.forEach((card, idx) => {
                    const thumb = document.createElement('button');
                    thumb.className = 'work-modal-thumb' + (idx === current ? ' active' : '');
                    thumb.setAttribute('aria-label', `Ver projecto ${idx + 1}`);
                    const src = card.querySelector('img')?.src || '';
                    thumb.style.backgroundImage = `url('${src}')`;
                    thumb.addEventListener('click', () => showModalAt(idx));
                    thumbsTrack.appendChild(thumb);
                });
            }

            // preload next/prev to speed navigation
            preloadImage(gallery[(current + 1) % gallery.length].dataset.fullsrc || gallery[(current + 1) % gallery.length].querySelector('img')?.src);
            preloadImage(gallery[(current - 1 + gallery.length) % gallery.length].dataset.fullsrc || gallery[(current - 1 + gallery.length) % gallery.length].querySelector('img')?.src);

            imgEl.onload = () => {
                spinner.style.display = 'none';
                imgEl.style.opacity = '1';
            };

            imgEl.onerror = () => {
                console.error('Failed to load image:', imgSrc);
                spinner.style.display = 'none';
                imgEl.style.opacity = '0.5';
                imgEl.alt = 'Falha ao carregar imagem';
            };

            titleEl.textContent = title;
            descEl.textContent = desc;
            counterEl.textContent = (current + 1) + ' / ' + gallery.length;

            modalEl.classList.add('show');
            // hide main content from assistive tech
            document.querySelector('main')?.setAttribute('aria-hidden', 'true');
            // focus close for accessibility
            modalEl.querySelector('.work-modal-close').focus();
        }

        function hideModal() {
            if (!modalEl) return;
            modalEl.classList.remove('show');
            document.querySelector('main')?.removeAttribute('aria-hidden');
            // restore focus to the card that opened the modal
            if (lastFocusedElement && lastFocusedElement.focus) lastFocusedElement.focus();
        }

        function showNext() { showModalAt(current + 1); }
        function showPrev() { showModalAt(current - 1); }

        function preloadImage(src) {
            if (!src) return;
            const img = new Image();
            img.src = src;
            img.onload = () => console.debug('Preloaded:', src);
            img.onerror = () => console.warn('Failed to preload:', src);
        }

        // expose a global function used by older handlers
        window.openWorkModal = function (e) {
            const card = this || e.currentTarget;
            lastFocusedElement = card;  // save for focus restore
            const idx = gallery.indexOf(card);
            if (idx === -1) return;
            showModalAt(idx);
        };

        // allow click + keyboard enter on cards to open
        gallery.forEach((card, idx) => {
            card.addEventListener('click', openWorkModal);
            card.addEventListener('touchend', (e) => {
                e.preventDefault();
                openWorkModal.call(card, e);
            });
            card.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); showModalAt(idx); } });
        });

        // Preload all gallery images on page load for smoother navigation
        gallery.forEach(card => {
            const src = card.dataset.fullsrc || card.querySelector('img')?.src;
            if (src) preloadImage(src);
        });

    })();

});



// Efeito de escrever
document.addEventListener('DOMContentLoaded', function () {

    // --- 1. LISTAS DE FRASES (primeiro bloco original) ---

    // Frases para o console.log
    const consolePhrasesA = [
        'console.log("Liano Marcelo")'
    ];

    // Frases para o H1. IMPORTANTE: Inclua as tags HTML necessárias (<br>, <span>) 
    // em CADA frase para manter o seu layout intacto.
    const rolePhrases = [
        'Web Developer <br>&<span><br>IT Support</span>',
        'Graphic Designer<br>&<span><br>UI/UX Designer</span>',
        'Creative Coder <br>&<span><br>UI/UX Analyst</span>',
        'Help Desk <br>&<span><br>Literary translator</span>'
    ];

    // --- 2. CONFIGURAÇÕES DE TEMPO E CURSOR (primeiro bloco) ---
    const typingSpeedA = 60;
    const deletingSpeedA = 40;
    const pauseTimeA = 1800;
    const cursorCharA = '<span class="typing-cursor" style="display:inline-block;width:6px;margin-left:2px;vertical-align:middle;">&#9608;</span>';  // cursor com width fixo

    // ----------------------------------------------------
    // FUNÇÃO REUTILIZÁVEL: Cria o efeito de loop infinito (primeiro bloco)
    // ----------------------------------------------------
    function initTypingLoopA(elementId, phrases) {
        const targetElement = document.getElementById(elementId);
        let phraseIndex = 0;
        let charIndex = 0;
        let isTyping = true;

        // Remove qualquer conteúdo inicial para começar o efeito do zero
        targetElement.innerHTML = '';

        function loop() {
            const currentPhrase = phrases[phraseIndex];

            if (isTyping) {
                // MODO ESCREVER
                if (charIndex < currentPhrase.length) {
                    // Monta o novo texto (caracteres escritos + cursor)
                    const newText = currentPhrase.substring(0, charIndex + 1);
                    targetElement.innerHTML = newText + cursorCharA;
                    charIndex++;
                    setTimeout(loop, typingSpeedA);
                } else {
                    // Terminou de escrever - Remove o cursor e pausa
                    targetElement.innerHTML = currentPhrase;
                    isTyping = false;
                    setTimeout(loop, pauseTimeA);
                }
            } else {
                // MODO APAGAR
                if (charIndex > 0) {
                    // Monta o novo texto (caracteres restantes + cursor)
                    const newText = currentPhrase.substring(0, charIndex - 1);
                    targetElement.innerHTML = newText + cursorCharA;
                    charIndex--;
                    setTimeout(loop, deletingSpeedA);
                } else {
                    // Terminou de apagar
                    targetElement.innerHTML = ''; // Limpa
                    isTyping = true;
                    // Move para a próxima frase
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(loop, pauseTimeA);
                }
            }
        }

        // Inicia o processo de loop
        loop();
    }

    // --- 3. INICIALIZAÇÃO DOS DOIS EFEITOS (primeiro bloco) ---
    // (vou reservar espaço para estes IDs: 'console-anim-target' e 'hero-title-anim' antes de iniciar)

    // ------------------------------------------------------------
    // ---- SEGUNDO BLOCO ORIGINAL (mantendo exatamente como tinhas)
    // ------------------------------------------------------------

    // Frases para o console.log (segundo bloco)
    const consolePhrasesB = [
        'console.log("Liano Marcelo")',
        'console.log("Web Developer")',
        'console.log("IT Support")'
    ];

    // Frases para os H1s (segundo bloco)
    const titlePhrases = [
        'Liano <span>Marcelo</span>'
    ];

    // --- 2. CONFIGURAÇÕES GLOBAIS (segundo bloco) ---
    const typingSpeedB = 60;  // Velocidade de digitação
    const deletingSpeedB = 40; // Velocidade de apagar
    const pauseTimeB = 1800;   // Tempo de pausa no final da escrita/apagamento
    const cursorCharB = '<span class="typing-cursor" style="display:inline-block;width:6px;margin-left:2px;vertical-align:middle;">&#9608;</span>';  // cursor com width fixo

    // ----------------------------------------------------
    // FUNÇÃO REUTILIZÁVEL (segundo bloco) — mesma lógica
    // ----------------------------------------------------
    function initTypingLoopB(elementId, phrases) {
        const targetElement = document.getElementById(elementId);
        if (!targetElement) {
            console.warn(`Elemento com ID "${elementId}" não encontrado. A animação não será iniciada.`);
            return;
        }

        let phraseIndex = 0;
        let charIndex = 0;
        let isTyping = true;

        // Limpa o conteúdo inicial do elemento
        targetElement.innerHTML = '';

        function loop() {
            const currentPhrase = phrases[phraseIndex];

            if (isTyping) {
                // MODO ESCREVER
                if (charIndex < currentPhrase.length) {
                    const newText = currentPhrase.substring(0, charIndex + 1);
                    targetElement.innerHTML = newText + cursorCharB;
                    charIndex++;
                    setTimeout(loop, typingSpeedB);
                } else {
                    // Terminou de escrever - Remove o cursor
                    targetElement.innerHTML = currentPhrase;
                    isTyping = false;
                    setTimeout(loop, pauseTimeB);
                }
            } else {
                // MODO APAGAR
                if (charIndex > 0) {
                    const newText = currentPhrase.substring(0, charIndex - 1);
                    targetElement.innerHTML = newText + cursorCharB;
                    charIndex--;
                    setTimeout(loop, deletingSpeedB);
                } else {
                    // Terminou de apagar
                    targetElement.innerHTML = ''; // Limpa
                    isTyping = true;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(loop, pauseTimeB);
                }
            }
        }

        // Inicia o processo de loop
        loop();
    }

    // ------------------------------------------------------------
    // FUNÇÃO ADICIONADA: RESERVA ESPAÇO AUTOMATICAMENTE (corrigida para não desalinhar)
    // ------------------------------------------------------------
    function reserveSpace(elementId, phrases, sampleElementForStyle) {
        const el = document.getElementById(elementId);
        if (!el) return;

        // Criar um div invisível (não span!) para medir com HTML tags
        const measure = document.createElement("div");
        measure.style.visibility = "hidden";
        measure.style.position = "absolute";
        measure.style.left = "-9999px";
        measure.style.top = "-9999px";
        measure.style.whiteSpace = "pre-wrap";  // Preserve <br> and spaces
        measure.style.wordBreak = "break-word";

        // Copia TODOS os estilos relevantes do elemento alvo
        const styleSource = sampleElementForStyle ? document.getElementById(sampleElementForStyle) : el;
        if (styleSource) {
            const computed = getComputedStyle(styleSource);
            // Copy all text-related properties
            measure.style.font = computed.font;
            measure.style.fontSize = computed.fontSize;
            measure.style.fontFamily = computed.fontFamily;
            measure.style.fontWeight = computed.fontWeight;
            measure.style.lineHeight = computed.lineHeight;
            measure.style.letterSpacing = computed.letterSpacing;
            measure.style.wordSpacing = computed.wordSpacing;
            measure.style.textAlign = computed.textAlign;
            measure.style.padding = computed.padding;
            measure.style.margin = "0";  // Remove margins to get true size
        }
        document.body.appendChild(measure);

        let maxWidth = 0;
        let maxHeight = 0;

        phrases.forEach(phrase => {
            measure.innerHTML = phrase;
            const rect = measure.getBoundingClientRect();
            if (rect.width > maxWidth) maxWidth = rect.width;
            if (rect.height > maxHeight) maxHeight = rect.height;
        });

        document.body.removeChild(measure);

        // Aplica tamanho fixo ao elemento alvo com buffer maior para cursor
        el.style.display = "inline-block";
        el.style.width = Math.ceil(maxWidth) + 6 + "px";  // 6px buffer for cursor
        el.style.height = Math.ceil(maxHeight) + 4 + "px";
        el.style.overflow = "hidden";
        el.style.verticalAlign = "top";  // Prevent vertical shift
    }

    // ------------------------------------------------------------
    // APLICAÇÃO: reserva o espaço para TODOS os IDs que aparecem nos teus blocos
    // (não alterei nenhum nome/ID; apenas acrescentei estas chamadas)
    // ------------------------------------------------------------

    // IDs do primeiro bloco
    reserveSpace('console-anim-target', consolePhrasesA, 'console-anim-target');
    reserveSpace('hero-title-anim', rolePhrases, 'hero-title-anim');

    // IDs do segundo bloco
    reserveSpace('anim-console', consolePhrasesB, 'anim-console');
    reserveSpace('anim-title-left', titlePhrases, 'anim-title-left');
    reserveSpace('anim-title-right', titlePhrases, 'anim-title-right');

    // ------------------------------------------------------------
    // INICIA AS ANIMAÇÕES (mantendo a ordem e tempos que tinhas)
    // ------------------------------------------------------------

    // Primeiro bloco - mantém os timings e IDs originais
    initTypingLoopA('console-anim-target', consolePhrasesA);

    setTimeout(() => {
        initTypingLoopA('hero-title-anim', rolePhrases);
    }, 500);

    /* ===== Preview Modal (Professional UX) ===== */
    (function setupPreviewModal() {
        let currentPreview = null;
        let previouslyFocused = null;

        function createPreviewModal() {
            const modal = document.createElement('div');
            modal.className = 'preview-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.innerHTML = `
                <div class="preview-modal-overlay"></div>
                <div class="preview-modal-content" role="document">
                    <button class="preview-modal-close" aria-label="Fechar (ESC)">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <div class="preview-modal-image">
                        <img src="" alt="" class="preview-modal-img" />
                    </div>
                    <div class="preview-modal-info">
                        <h2 class="preview-modal-title"></h2>
                        <p class="preview-modal-desc"></p>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Handlers
            const closeBtn = modal.querySelector('.preview-modal-close');
            const overlay = modal.querySelector('.preview-modal-overlay');

            closeBtn.addEventListener('click', closePreview);
            overlay.addEventListener('click', closePreview);
            document.addEventListener('keydown', handleModalKeydown);

            return modal;
        }

        function handleModalKeydown(e) {
            if (!currentPreview) return;
            if (e.key === 'Escape') closePreview();
        }

        function openPreview(btn) {
            previouslyFocused = document.activeElement;
            const card = btn.closest('.preview-card');
            if (!card) return;

            const src = card.dataset.fullsrc || card.querySelector('img')?.src || '';
            const title = card.dataset.title || card.querySelector('h3')?.innerText || '';
            const desc = card.dataset.desc || '';

            if (!currentPreview) currentPreview = createPreviewModal();

            const img = currentPreview.querySelector('.preview-modal-img');
            const titleEl = currentPreview.querySelector('.preview-modal-title');
            const descEl = currentPreview.querySelector('.preview-modal-desc');

            img.src = src;
            img.alt = title;
            titleEl.textContent = title;
            descEl.textContent = desc;

            // Trigger animation
            setTimeout(() => currentPreview.classList.add('active'), 10);
            currentPreview.querySelector('.preview-modal-close').focus();

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }

        function closePreview() {
            if (!currentPreview) return;
            currentPreview.classList.remove('active');
            setTimeout(() => {
                if (currentPreview) {
                    currentPreview.remove();
                    currentPreview = null;
                    document.body.style.overflow = '';
                    previouslyFocused?.focus();
                }
            }, 300);
        }

        // Attach handlers to all buttons
        document.querySelectorAll('.preview-open').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openPreview(btn);
            });
        });
    })();

    // Segundo bloco - mantém os timings e IDs originais
    initTypingLoopB('anim-console', consolePhrasesB);

    setTimeout(() => {
        initTypingLoopB('anim-title-left', titlePhrases);
    }, 500);

    setTimeout(() => {
        initTypingLoopB('anim-title-right', titlePhrases);
    }, 1000);

});

// --- RECALCULAR TAMANHOS NO MOBILE / RESIZE / ROTAÇÃO ---
function recalcAllReservedSpaces() {
    reserveSpace('console-anim-target', consolePhrasesA, 'console-anim-target');
    reserveSpace('hero-title-anim', rolePhrases, 'hero-title-anim');

    reserveSpace('anim-console', consolePhrasesB, 'anim-console');
    reserveSpace('anim-title-left', titlePhrases, 'anim-title-left');
    reserveSpace('anim-title-right', titlePhrases, 'anim-title-right');
}

// Recalcular após pequeno delay para garantir CSS carregado
setTimeout(recalcAllReservedSpaces, 100);

// Mobile resize / rotação do ecrã
window.addEventListener('resize', () => {
    recalcAllReservedSpaces();
});

// ScrollReveal loader + initialization
function initScrollReveal() {
    try {
        if (typeof ScrollReveal === 'undefined') return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return; // skip heavy animations for users that prefer reduced motion

        const isSmall = window.innerWidth < 700;

        const sr = ScrollReveal({
            distance: isSmall ? '12px' : '28px',
            duration: isSmall ? 580 : 900,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            opacity: 0,
            scale: 1,
            reset: true,
            viewFactor: 0.12,
        });

        function revealGroup(el, opts = {}, interval = 80) {
            const children = el.querySelectorAll(':scope > li, :scope .work-card, :scope .card-mini, :scope .skills span, :scope .acc-item, :scope .hero-stats li');
            if (children.length) sr.reveal(children, Object.assign({ interval }, opts));
            else sr.reveal(el, opts);
        }

        document.querySelectorAll('[data-anim]').forEach(el => {
            const key = (el.dataset.anim || '').trim();
            const base = {
                origin: 'bottom',
                distance: isSmall ? '12px' : '24px',
                duration: isSmall ? 520 : 780,
                delay: 0,
                opacity: 0,
                scale: 1,
                viewFactor: 0.12,
                rotate: { x: 0, y: 0, z: 0 },
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            };
            let opts = Object.assign({}, base);

            switch (key) {
                case 'slide-up':
                    opts.origin = 'bottom';
                    opts.distance = isSmall ? '16px' : '32px';
                    break;
                case 'slide-left':
                    opts.origin = 'left';
                    opts.distance = isSmall ? '16px' : '32px';
                    opts.rotate = { z: -8 };
                    break;
                case 'slide-right':
                    opts.origin = 'right';
                    opts.distance = isSmall ? '16px' : '32px';
                    opts.rotate = { z: 8 };
                    break;
                case 'zoom-in':
                    opts.scale = 0.85;
                    opts.distance = '2px';
                    opts.duration = isSmall ? 600 : 850;
                    break;
                case 'fade-in':
                    opts.distance = '0px';
                    opts.easing = 'ease-out';
                    break;
                case 'fade-in-delay':
                    opts.distance = '0px';
                    opts.delay = 90;
                    opts.easing = 'ease-out';
                    break;
                case 'fade-in-delay-2':
                    opts.distance = '0px';
                    opts.delay = 180;
                    opts.easing = 'ease-out';
                    break;
                case 'float-rotate':
                    opts.origin = 'top';
                    opts.distance = isSmall ? '12px' : '18px';
                    opts.rotate = { z: 360 };
                    opts.duration = isSmall ? 700 : 1000;
                    opts.easing = 'ease-out';
                    break;
                case 'stagger-up':
                    opts.distance = isSmall ? '14px' : '28px';
                    opts.scale = 0.95;
                    return revealGroup(el, opts, isSmall ? 70 : 100);
                case 'stagger-fade':
                    opts.distance = '0px';
                    opts.scale = 0.98;
                    return revealGroup(el, opts, isSmall ? 70 : 100);
                case 'flip-in':
                    opts.origin = 'bottom';
                    opts.distance = isSmall ? '16px' : '24px';
                    opts.rotate = { x: 45 };
                    opts.duration = isSmall ? 700 : 900;
                    opts.scale = 0.9;
                    break;
                case 'pop-in':
                    opts.origin = 'bottom';
                    opts.distance = isSmall ? '10px' : '14px';
                    opts.scale = 0.8;
                    opts.duration = isSmall ? 550 : 750;
                    break;
                case 'rise':
                    opts.origin = 'bottom';
                    opts.distance = isSmall ? '18px' : '36px';
                    opts.scale = 0.98;
                    opts.rotate = { z: -2 };
                    break;
                case 'rise-delay':
                    opts.origin = 'bottom';
                    opts.distance = isSmall ? '18px' : '36px';
                    opts.delay = 120;
                    opts.scale = 0.97;
                    break;
                case 'rise-delay-2':
                    opts.origin = 'bottom';
                    opts.distance = isSmall ? '18px' : '36px';
                    opts.delay = 220;
                    opts.scale = 0.96;
                    break;
                case 'rise-delay-3':
                    opts.origin = 'bottom';
                    opts.distance = isSmall ? '18px' : '36px';
                    opts.delay = 320;
                    opts.scale = 0.95;
                    break;
                case 'card-zoom':
                    opts.scale = 0.85;
                    opts.distance = isSmall ? '8px' : '12px';
                    opts.duration = isSmall ? 600 : 850;
                    break;
                case 'card-slide':
                    opts.origin = 'right';
                    opts.distance = isSmall ? '20px' : '32px';
                    opts.rotate = { y: 15 };
                    opts.scale = 0.95;
                    break;
                default: break;
            }

            sr.reveal(el, opts);
        });

        // re-evaluate on resize for responsive tuning
        let rrTO = null;
        window.addEventListener('resize', () => {
            clearTimeout(rrTO);
            rrTO = setTimeout(() => { if (window.innerWidth < 700 && !isSmall) location.reload(); }, 250);
        });
    } catch (err) {
        console.warn('ScrollReveal init error:', err);
    }
}

function ensureScrollRevealAndInit() {
    if (typeof ScrollReveal !== 'undefined') {
        initScrollReveal();
        return;
    }

    // Dynamically load ScrollReveal and init when ready
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/scrollreveal';
    s.async = true;
    s.onload = () => {
        try { initScrollReveal(); }
        catch (e) { console.warn('Failed to init ScrollReveal after load', e); }
    };
    s.onerror = () => console.warn('Failed to load ScrollReveal from CDN');
    document.head.appendChild(s);
}

document.addEventListener('DOMContentLoaded', ensureScrollRevealAndInit);
