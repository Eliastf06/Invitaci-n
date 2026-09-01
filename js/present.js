document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Efecto Scroll Suave
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const observer = new IntersectionObserver(revealCallback, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 2. Lógica para copiar Alias y Sistema Toast
    const copyBtns = document.querySelectorAll('.copy-btn');
    const toastContainer = document.getElementById('toast-container');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const alias = btn.getAttribute('data-alias');
            
            // Copiar al portapapeles
            navigator.clipboard.writeText(alias).then(() => {
                showToast(`Alias copiado: <strong>${alias}</strong>`, 'success');
            }).catch(err => {
                showToast("No se pudo copiar el alias", "error");
            });
        });
    });

    // Función constructora del Toast
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        
        const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
        const iconColor = type === 'success' ? 'var(--toast-success)' : '#e57373';
        
        toast.innerHTML = `
            <i class="fa-solid ${iconClass}" style="color: ${iconColor}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Desaparece con transición suave a los 2.5s
        setTimeout(() => {
            toast.classList.add('toast-closing');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 2500);
    }
});