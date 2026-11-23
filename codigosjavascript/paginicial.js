 document.addEventListener('DOMContentLoaded', () => {
  const backToTopBtn = document.getElementById('backToTopBtn');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
const typeWriter = document.getElementById('typewriter-text');
const text = 'Sobre a aplicação SIGNALS';
typeWriter.innerHTML = text;
typeWriter.style.setProperty('--characters', text.length);