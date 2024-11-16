document.addEventListener('DOMContentLoaded', function() {
  const imgElement = document.getElementById('responsive-image');

  // Escuchar el evento 'load' para saber cuándo se carga la imagen
  imgElement.addEventListener('load', function() {
      // Imprimir el src que ha sido cargado
      console.log('Imagen cargada:', imgElement.src);

      // Imprimir el srcset y qué imagen está siendo usada
      console.log('srcset:', imgElement.srcset);
  });
});
  

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