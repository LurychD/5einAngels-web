//Main Canvas test
const canvas = document.getElementById('maincanvas');
    const ctx = canvas.getContext('2d');

    // Imágenes de la carta (frontal y trasera)
    const frontImage = new Image();
    const backImage = new Image();
  //CARGA LAS IMAGENES AQUI
    frontImage.src = './images/angel1/AngelCard_1.jpg';
    backImage.src = './images/envmap.jpg';

    let animationInProgress = false;
    let flipProgress = 0; // Va de 0 a 1
    let showingFront = true; // Indica qué lado de la carta se muestra

    // Dibujar la carta con una escala horizontal
    function drawCard() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calcular la escala en función del progreso de la animación
      const scale = Math.cos(flipProgress * Math.PI); // De 1 a -1

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(scale, 1);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Elegir qué imagen mostrar según el progreso
      if (scale > 0) {
        ctx.drawImage(showingFront ? frontImage : backImage, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.drawImage(showingFront ? backImage : frontImage, 0, 0, canvas.width, canvas.height);
      }

      ctx.restore();
    }

    // Animar la rotación de la carta
    function animateFlip() {
      if (!animationInProgress) return;
      flipProgress += 0.03; // Ajusta la velocidad de la animación

      if (flipProgress >= 1) {
        flipProgress = 0;
        animationInProgress = false;
        showingFront = !showingFront; // Cambiar el lado que se muestra
      } else {
        requestAnimationFrame(animateFlip);
      }

      drawCard();
    }

    // Manejar el clic para iniciar la animación
    canvas.addEventListener('click', () => {
      if (!animationInProgress) {
        animationInProgress = true;
        animateFlip();
      }
    });

    // Agregar efectos al pasar el mouse
    canvas.addEventListener('mouseover', () => {
      canvas.style.transform = 'scale(1.1)'; // Aumentar tamaño
      canvas.style.transition = 'transform 0.3s ease'; // Transición suave
    });

    canvas.addEventListener('mouseout', () => {
      canvas.style.transform = 'scale(1)'; // Volver al tamaño normal
    });

    // Asegurarse de que las imágenes se carguen antes de dibujar
frontImage.onload = () => {
  backImage.onload = () => {
    drawCard(); // Dibujar la carta inicial (frontal) solo cuando ambas imágenes se carguen
  };
};