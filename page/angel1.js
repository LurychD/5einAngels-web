import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/****************************************************************************** */
//Metricas de RENDIMIENTO}
//Memoria total
if (performance.memory) {
  console.log('Uso de memoria:', {
      memoriaUsada: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      memoriaTotal: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      memoriaLimite: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
  });
} else {
  console.log('La API de memoria no está soportada en este navegador.');
}
//CPU
const start = performance.now();

// Código cuya duración quieres medir
for (let i = 0; i < 1000000; i++) {
    Math.sqrt(i);
}

const duration = performance.now() - start;
console.log('Tiempo de ejecución:', duration.toFixed(2) + ' ms');

//Observador de rendimiento
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
      console.log(entry.name, entry.duration);
  });
});

//uso de la GPU
observer.observe({ entryTypes: ['measure', 'function'] });

const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        console.log('Vendor de la GPU:', vendor);
        console.log('Renderer de la GPU:', renderer);
    } else {
        console.log('No se pudo obtener información de la GPU.');
    }
} else {
    console.log('WebGL no está soportado en este navegador.');
}

/****************************************************************************** */

//Escena del Angel nro 1

//Espacio de color y antialiasing
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

//Añadir al canvas
document.getElementById('angel1-canvas').appendChild(renderer.domElement);
//Tamaño del visor
renderer.setSize(window.innerWidth/2, window.innerHeight);
//renderer.setClearColor("#13181b");
renderer.setPixelRatio(window.devicePixelRatio);
//color de prueba
renderer.setClearColor("#000000");


//Sombras
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

//Camara
const camera = new THREE.PerspectiveCamera(30, window.innerWidth/2 / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 180);

//Controles de orbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 12;
controls.maxDistance = 20;
controls.minPolarAngle = 1;
controls.maxPolarAngle = 1.9;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 0, 0);
controls.update();

//Base geometrica
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
//scene.add(groundMesh);

//Iluminacion
const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.9, 1);
spotLight.position.set(10, 30, 40);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

//Iluminacion ambiente
const light = new THREE.AmbientLight( 0x404045, 0.9); // soft white light
scene.add( light );

// Carga de TEXTURAS
const textureLoader = new THREE.TextureLoader();
  //Modelo baseCard
  const CardColor = textureLoader.load('/models/tex/paper_color.jpg');
  const CardNormal = textureLoader.load('/models/tex/paper_nrm.jpg');
  const CardRoughness = textureLoader.load('/models/tex/paper_nrm.jpg');
  //const metalnessBlock = textureLoader.load('/models/angel1/metalness.jpg')
  //const aoTextureBlock = textureLoader.load('/models/angel1/angel1Ambient_Occlusion.jpg')
  //const lightmapTextureBlock = textureLoader.load('/models/angel1/angel1lightmap.jpg')
  //const displacementMapBlock = new THREE.TextureLoader().load('/models/angel1/angel1_displacement.png');

  //Modelo Design (Donde van los diseños front y back)
  const AngelColor = textureLoader.load('/models/angel1/AngelCard_1.jpg');
  //const AngelNormal = textureLoader.load('/models/paper_nrm.jpg');
  //const AngelRoughness = textureLoader.load('/models/paper_nrm.jpg');

textureLoader.load('/models/envmap.jpg', function (envmap) 
{
    envmap.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envmap; // Configurar como mapa de entorno

  // Cargar el modelo carta
  const loader = new GLTFLoader().setPath('/models/');
  loader.load('baseCard.gltf', (gltf) => {
    console.log('Cagando modelo! Si así como estas leyendo');
    const mesh = gltf.scene;
    // Recorrer los objetos del modelo y aplicar el envMap
    mesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Aplicar las texturas al mesh
            if (child.material && child.material.isMeshStandardMaterial) {
              if (child.name === 'BaseCard') {
                // Asigna la textura difusa
                  child.material.map = CardColor;  
                  // Asigna la textura normal
                  child.material.normalMap = CardNormal;
                  // Asigna la textura de rugosidad
                  child.material.roughnessMap = CardRoughness;
                  // Aplica Textura de Ambient Occlusion
                  //child.material.aomap = aoTextureBlock; 
                  // Aplica lightmap
                  //child.material.lightmap = lightmapTextureBlock; child.material.lightmapintensity = 0.2; 
                  // Asigna la textura de metalness
                  //child.material.metalnessMap = metalnessBlock; // Aquí especificas el metalnessMap
                  // Ajusta el valor de metalness si es necesario (0 = sin influencia, 1 = intensidad total)
                  //child.material.metalness = 0.1;
  
                  // Ajusta el valor aquí (0 = sin influencia, 1 = intensidad total)
                  child.material.envMap = envmap; child.material.envMapIntensity = 0.01;
  
                  child.castShadow = true;
                  child.receiveShadow = true;

            }  

          } if (child.name === 'Designs') {
                  // Asigna la textura difusa
                  child.material.map = AngelColor; 
                  //Voltear la textura
                  child.material.map.wrapT = THREE.RepeatWrapping;
                  child.material.map.repeat.x = 1; // Esto voltea la textura en el eje X
                  child.material.map.repeat.y = -1;
                  child.material.map.wrapS = THREE.RepeatWrapping;
                  child.material.map.repeat.x = -1;
                  //mover la textura (x, y)
                  //child.material.map.offset.set(0.8, 0);
                  // Asigna la textura normal
                  //child.material.normalMap = normalTextureBlock;
                  // Asigna la textura de rugosidad
                  //child.material.roughnessMap = roughnessTextureBlock;
                  // Aplica Textura de Ambient Occlusion
                  //child.material.aomap = aoTextureBlock; 
                  // Aplica lightmap
                  //child.material.lightmap = lightmapTextureBlock; child.material.lightmapintensity = 0.2; 
                  // Asigna la textura de metalness
                  //child.material.metalnessMap = metalnessBlock; // Aquí especificas el metalnessMap
                  // Ajusta el valor de metalness si es necesario (0 = sin influencia, 1 = intensidad total)
                  //child.material.metalness = 0.1;
  
                  // Ajusta el valor aquí (0 = sin influencia, 1 = intensidad total)
                  child.material.envMap = envmap; child.material.envMapIntensity = 0.01;
                  child.material.needsUpdate = true;
                
              }
    
            // Actualiza el material
            child.material.needsUpdate = true;

            //Imprimir objetos en consola
            mesh.traverse((child) => {
              if (child.isMesh && child.material) {
                console.log(child.name);  // Imprime el nombre de cada objeto
                console.log(child.material);  // Imprime el nombre de cada material
                                }
                                    });

          }}
        
      );
    // Añadir el modelo a la escena
    mesh.position.set(0, 0, -1);
    mesh.rotation.set(0, 0, 0);
    scene.add(mesh);

  });
});


(xhr) => {
  // Mostrar el progreso de la carga
  const progressContainer = document.getElementById('progress-container');
  progressContainer.style.display = 'block'; // Mostrar el contenedor de progreso
  console.log(`Cargando ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  // Manejo de errores
  console.error('Error cargando el modelo:', error);
};

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();