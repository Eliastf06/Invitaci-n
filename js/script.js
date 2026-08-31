document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll(".reveal");
    
    // Filtramos para agarrar solo los textos, excluyendo el contenedor de la imagen
    const textElements = document.querySelectorAll('.random-appear:not(.and-container)');

    // 1. Envolvemos cada letra en un <span>
    textElements.forEach(el => {
        const text = el.innerText;
        el.innerHTML = ""; 
        
        text.split("").forEach(char => {
            if (char === " ") {
                el.innerHTML += " "; 
            } else {
                const span = document.createElement("span");
                span.innerText = char;
                span.classList.add("letra");
                el.appendChild(span);
            }
        });
    });

    // 1.5. Preparamos la imagen del AND dividiéndola en un rompecabezas
    const andContainer = document.getElementById('and-container');
    if (andContainer) {
        const filas = 3;
        const columnas = 5; // 15 pedazos en total
        
        for (let f = 0; f < filas; f++) {
            for (let c = 0; c < columnas; c++) {
                const pedazo = document.createElement('img');
                pedazo.src = 'img/text1.png';
                pedazo.classList.add('and-piece', 'letra'); // Le damos la clase .letra para animarlo
                
                // Calculamos los porcentajes de recorte para cada pedacito
                const top = (f / filas) * 100;
                const bottom = 100 - ((f + 1) / filas) * 100;
                const left = (c / columnas) * 100;
                const right = 100 - ((c + 1) / columnas) * 100;
                
                // Recortamos la imagen usando clip-path
                pedazo.style.clipPath = `inset(${top}% ${right}% ${bottom}% ${left}%)`;
                andContainer.appendChild(pedazo);
            }
        }
    }

    // 2. Ejecutamos la animación de entrada
    reveals.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add("active");
            
            const targets = element.classList.contains('random-appear') 
                            ? [element] 
                            : element.querySelectorAll('.random-appear');
            
            targets.forEach(target => {
                // Agarramos todas las .letra (incluyendo los pedazos de la imagen)
                const letras = Array.from(target.querySelectorAll('.letra'));
                
                const indicesAleatorios = Array.from(Array(letras.length).keys()).sort(() => Math.random() - 0.5);
                
                indicesAleatorios.forEach((posicionAleatoria, i) => {
                    setTimeout(() => {
                        letras[posicionAleatoria].classList.add('visible');
                    }, i * 120);
                });
            });

        }, 600 * (index + 1)); 
    });
});