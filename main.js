// Variables globales
let currentAudio = null;
let currentCard = null;

// Obtener todas las tarjetas
const cards = document.querySelectorAll('.serie-card');

cards.forEach(card => {
    const cardInner = card.querySelector('.card-inner');
    const playBtn = card.querySelector('.play-btn');
    const closeBtn = card.querySelector('.close-btn');
    const audioUrl = card.dataset.audio;
    let audio = null;

    // Función para expandir tarjeta
    function expandCard() {
        // Si esta tarjeta ya está expandida, no hacer nada
        if (card.classList.contains('expanded')) {
            return;
        }

        // Cerrar cualquier otra tarjeta expandida
        cards.forEach(c => {
            if (c !== card && c.classList.contains('expanded')) {
                collapseCard(c);
            }
        });

        // Expandir la tarjeta actual
        card.classList.add('expanded');
        currentCard = card;

        // Crear y reproducir el audio automáticamente
        audio = new Audio(audioUrl);
        currentAudio = audio;
        
        // Reproducir con un pequeño delay para sincronizar con la animación
        setTimeout(() => {
            audio.play().catch(error => {
                console.log('Error al reproducir audio:', error);
            });
            playBtn.classList.add('playing');
        }, 200);

        // Cuando el audio termina
        audio.addEventListener('ended', () => {
            playBtn.classList.remove('playing');
            audio.currentTime = 0;
        });

        // Scroll suave a la tarjeta expandida
        setTimeout(() => {
            card.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    }

    // Función para colapsar tarjeta
    function collapseCard(targetCard = card) {
        targetCard.classList.remove('expanded');
        
        // Detener y limpiar el audio
        if (currentAudio && currentCard === targetCard) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
            audio = null;
            
            const targetPlayBtn = targetCard.querySelector('.play-btn');
            if (targetPlayBtn) {
                targetPlayBtn.classList.remove('playing');
            }
        }

        if (targetCard === card) {
            currentCard = null;
        }
    }

    // Click en la tarjeta (solo en el área de la imagen cuando está colapsada)
    cardInner.addEventListener('click', (e) => {
        // Evitar expandir si se hace click en botones
        if (e.target.closest('.play-btn') || 
            e.target.closest('.close-btn') || 
            e.target.closest('.watch-btn')) {
            return;
        }

        // Si la tarjeta NO está expandida, expandirla
        if (!card.classList.contains('expanded')) {
            // Solo expandir si el click es en la parte de la imagen
            if (e.target.closest('.card-left') || 
                e.target.closest('.card-header')) {
                expandCard();
            }
        }
    });

    // Botón de cerrar
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        collapseCard();
    });

    // Botón de play/pause (solo funciona cuando está expandida)
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        // Solo funciona si la tarjeta está expandida
        if (!card.classList.contains('expanded')) {
            return;
        }

        if (!audio) {
            audio = new Audio(audioUrl);
            currentAudio = audio;

            audio.addEventListener('ended', () => {
                playBtn.classList.remove('playing');
                audio.currentTime = 0;
            });
        }

        // Toggle play/pause
        if (playBtn.classList.contains('playing')) {
            audio.pause();
            playBtn.classList.remove('playing');
        } else {
            // Pausar cualquier otro audio que esté sonando
            if (currentAudio && currentAudio !== audio) {
                currentAudio.pause();
                if (currentCard) {
                    const otherPlayBtn = currentCard.querySelector('.play-btn');
                    if (otherPlayBtn) {
                        otherPlayBtn.classList.remove('playing');
                    }
                }
            }

            audio.play().catch(error => {
                console.log('Error al reproducir audio:', error);
            });
            playBtn.classList.add('playing');
            currentAudio = audio;
            currentCard = card;
        }
    });
});

// Cerrar tarjeta al presionar ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const expandedCard = document.querySelector('.serie-card.expanded');
        if (expandedCard) {
            expandedCard.classList.remove('expanded');
            
            // Detener audio si está reproduciéndose
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentAudio = null;
                
                const playBtn = expandedCard.querySelector('.play-btn');
                if (playBtn) {
                    playBtn.classList.remove('playing');
                }
            }
            
            currentCard = null;
        }
    }
});

// Prevenir que los enlaces "Ver Ahora" cierren la tarjeta
document.querySelectorAll('.watch-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});