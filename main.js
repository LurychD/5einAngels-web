//Animación de la carta
const card = document.querySelector('.card');
let flipped = false;

card.addEventListener('click', () => {
    flipped = !flipped;
    if (flipped) {
        card.classList.add('flipped');
    } else {
        card.classList.remove('flipped');
    }
});