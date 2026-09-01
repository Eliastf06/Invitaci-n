document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. Preparación de Textos (Letras en span)
    // ==========================================
    const textElements = document.querySelectorAll('.random-appear:not(.frag-img)');
    textElements.forEach(el => {
        // Guardamos los saltos de línea (br) para no romper el formato
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
    // 2. Preparación de Imágenes Fragmentadas
    // ==========================================
    const fragContainers = document.querySelectorAll('.frag-img');
    fragContainers.forEach(container => {
        const src = container.getAttribute('data-src');
        if (src) {
            const filas = 3;
            const columnas = 5;
            for (let f = 0; f < filas; f++) {
                for (let c = 0; c < columnas; c++) {
                    const pedazo = document.createElement('img');
                    pedazo.src = src;
                    pedazo.classList.add('frag-piece', 'letra'); // Clase .letra para animar
                    
                    const top = (f / filas) * 100;
                    const bottom = 100 - ((f + 1) / filas) * 100;
                    const left = (c / columnas) * 100;
                    const right = 100 - ((c + 1) / columnas) * 100;
                    
                    pedazo.style.clipPath = `inset(${top}% ${right}% ${bottom}% ${left}%)`;
                    container.appendChild(pedazo);
                }
            }
        }
    });

    // ==========================================
    // 3. Scroll Reveal e Intersection Observer
    // ==========================================
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Dispara el efecto aleatorio de las letras/imágenes
                const targets = entry.target.classList.contains('random-appear') 
                                ? [entry.target] 
                                : entry.target.querySelectorAll('.random-appear');
                
                targets.forEach(target => {
                    const letras = Array.from(target.querySelectorAll('.letra'));
                    if(letras.length > 0 && !target.classList.contains('anim-done')) {
                        target.classList.add('anim-done'); // Evita re-animar si se scrollea arriba
                        const indices = Array.from(Array(letras.length).keys()).sort(() => Math.random() - 0.5);
                        indices.forEach((pos, i) => {
                            setTimeout(() => { letras[pos].classList.add('visible'); }, i * 60);
                        });
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(revealCallback, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ==========================================
    // 4. Audio Player Lógica
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
    // 5. Contador Regresivo
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