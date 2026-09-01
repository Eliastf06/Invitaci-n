document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. Preparación de Textos (Letras en span)
    // ==========================================
    const textElements = document.querySelectorAll('.random-appear:not(.img-secuencia):not(.and-text-container)');
    
    textElements.forEach(el => {
        const innerHTML = el.innerHTML; 
        if(!innerHTML.includes('<img')) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = innerHTML;
            el.innerHTML = ""; 
            
            Array.from(tempDiv.childNodes).forEach(node => {
                if(node.nodeName === 'BR') {
                    el.appendChild(document.createElement('br'));
                } else if(node.nodeType === 3) {
                    node.textContent.split("").forEach(char => {
                        if (char === " ") {
                            el.appendChild(document.createTextNode(" "));
                        } else {
                            const span = document.createElement("span");
                            span.innerText = char;
                            span.classList.add("letra");
                            el.appendChild(span);
                        }
                    });
                }
            });
        }
    });

    // ==========================================
    // 2. Scroll Reveal con Espera de Fondos
    // ==========================================
    const activateReveal = (target) => {
        target.classList.add('active');
        
        const targets = target.classList.contains('random-appear') 
                        ? [target] 
                        : target.querySelectorAll('.random-appear');
        
        targets.forEach(t => {
            const letras = t.classList.contains('letra') 
                           ? [t] 
                           : Array.from(t.querySelectorAll('.letra'));

            if(letras.length > 0 && !t.classList.contains('anim-done')) {
                t.classList.add('anim-done'); 
                const indices = Array.from(Array(letras.length).keys()).sort(() => Math.random() - 0.5);
                indices.forEach((pos, i) => {
                    setTimeout(() => { letras[pos].classList.add('visible'); }, i * 60);
                });
            }
        });
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;

                if (el.classList.contains('sec-bg')) {
                    if (!el.classList.contains('bg-anim-done')) {
                        el.classList.add('active-bg', 'bg-anim-done');
                        setTimeout(() => {
                            const reveals = el.querySelectorAll('.reveal');
                            reveals.forEach(r => activateReveal(r));
                        }, 1200); 
                    }
                } 
                else {
                    activateReveal(el);
                    const childReveals = el.querySelectorAll('.reveal');
                    childReveals.forEach(r => activateReveal(r));
                }
            }
        });
    };

    const observer = new IntersectionObserver(revealCallback, { threshold: 0.15 });
    
    document.querySelectorAll('.sec-bg, .sec-audio, .sec-countdown, .sec-itinerario').forEach(el => observer.observe(el));

    // ==========================================
    // 3. Audio Player Lógica
    // ==========================================
    const audio = document.getElementById('wedding-audio');
    const playBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('audio-progress');

    if (audio && playBtn) {
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playBtn.innerText = "⏸";
                playBtn.classList.add('playing');
            } else {
                audio.pause();
                playBtn.innerText = "▶";
                playBtn.classList.remove('playing');
            }
        });

        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressBar.value = progress;
            }
        });

        progressBar.addEventListener('input', () => {
            const time = (progressBar.value / 100) * audio.duration;
            audio.currentTime = time;
        });
    }

    // ==========================================
    // 4. Contador Regresivo
    // ==========================================
    const fechaBoda = new Date('2026-10-28T10:00:00').getTime();
    const eDays = document.getElementById('days');
    const eHours = document.getElementById('hours');
    const eMins = document.getElementById('mins');
    const eSecs = document.getElementById('secs');

    if (eDays) {
        setInterval(() => {
            const ahora = new Date().getTime();
            const distancia = fechaBoda - ahora;

            if (distancia > 0) {
                const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
                const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
                const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

                eDays.innerText = dias < 10 ? '0' + dias : dias;
                eHours.innerText = horas < 10 ? '0' + horas : horas;
                eMins.innerText = minutos < 10 ? '0' + minutos : minutos;
                eSecs.innerText = segundos < 10 ? '0' + segundos : segundos;
            }
        }, 1000);
    }
});