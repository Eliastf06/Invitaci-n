document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll(".reveal");
    
    // Ignoramos la imagen y el nuevo contenedor de texto del "y"
    const textElements = document.querySelectorAll('.random-appear:not(.img-secuencia):not(.and-text-container)');

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

    reveals.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add("active");
            
            const targets = element.classList.contains('random-appear') 
                            ? [element] 
                            : element.querySelectorAll('.random-appear');
            
            targets.forEach(target => {
                const letras = target.classList.contains('letra') 
                               ? [target] 
                               : Array.from(target.querySelectorAll('.letra'));
                
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