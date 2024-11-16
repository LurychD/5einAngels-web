//Lazysizes optimizacion. Verificacion de funcionamiento
  //Inicializacion
    document.addEventListener("DOMContentLoaded", function() {
      if (typeof LazyLoad !== 'undefined') {
          console.log("LazyLoad script has loaded successfully!");
      } else {
          console.error("LazyLoad script did not load.");
      }
    });
  //Esta cargando la imagen? Imprimir a consola
  document.addEventListener('lazybeforeunveil', function(e)
  {
  console.log('Imagen que está por cargarse:', e.target);
  });  
  document.addEventListener('lazyloaded', function(e)
      {
      console.log('Imagen cargada:', e.target);
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