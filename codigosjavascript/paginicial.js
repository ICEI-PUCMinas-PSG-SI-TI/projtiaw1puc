 const backToTopBtn = document.getElementById('backToTopBtn');
 window.addEventListener('scroll', () => {
        if(window.scrollY > 1){
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
        });
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const typeWriter = document.getElementById('typewriter-text');
const text = 'Sobre a aplicação SIGNALS';

typeWriter.innerHTML = text;
typeWriter.style.setProperty('--characters', text.length);

