document.addEventListener('DOMContentLoaded', function () { //mezclamos las cartas solo cuando la página carga por primera vez, o cuando se recarga
  mezclarBaraja(cartasSimpson);
  let j = 0;
  function animacionGirarCartas() {
    if (j < cartas.length) { //mientras el indice este en el rango
      cartas[j].classList.add("girar"); //añadimos la clase que contiene la animacion a la carta
      j++; //incrementamos el indice
    } else { //cuando se hayan girado todas las cartas
      clearInterval(intervalo);
      eliminarClaseDeTodosLosElementos("girar"); //una vez giradas las eliminamos
    }
  };
  const intervalo = setInterval(animacionGirarCartas, 100);
});

document.getElementById("rosquilla").addEventListener('click', function(){
  cambiarAMordida();
  document.getElementById('morder-rosquilla').play();
  setTimeout(function(){
    reiniciarJuego();
  }, 1500);
})

const cartas = document.querySelectorAll('.carta'); //hacemos un query selector de aquella clases que contenta la clase carta, almacenandola en la variable cartas
let i = 0; //indice para ir accediendo a los elementos del array
let cartaAux = null; //variable que almacena la carta de la iteracción anterior
let parejasEncontradas = 0; //número de parejas encontradas
let numeroIntentos = 0; //número de intentos realizados para completar el juego
let inicio = 0; //variables nesesarias para calcular la puntuación
let fin = 0;
let tiempoDeJuego = 0;

cartas.forEach(carta => { //ahora para cada clase carta contenida en cartas
  carta.addEventListener('click', function() { //le añadimos un evenListener
    if(inicio === 0){ //si es la primera vez que se entra, le damos el valor a la variable incio del momento en que se entra, esto se hace para que a lo largo de la iteracion dicho valor no vaya cambiando
      inicio = Date.now();
    }
    if (!carta.classList.contains("clicada") && !carta.classList.contains("encontrada")) { //si la carta aún no ha sido clicada ni se ha encontrado con su pareja
      //esta parte del codigo almacena en la variable alt de img la direccion de la imagen, esto se hacer para que se guarde que imagen le corresponde a cada clase, si no, la dirección de la imagen iría cambiado a lo largo de la iteracción del programa y no queremos eso
      if(carta.alt === ""){ //si no se ha almacenado nada todavía en la variable alt, le asignamos la dirección de su imágen
        carta.alt = cartasSimpson[i];
        i++;
      }
      carta.src = carta.alt; //le pasamos al src su dirección, ya almacenada
      carta.classList.add("clicada"); //le añadimos la clase clicada 
      carta.classList.add("girada");//le añadimos la clase girada
      document.getElementById('efecto-carta').play(); //le añadimos el efecto de sonido

      if (cartaAux !== null) {
        if (!verificarPareja(carta, cartaAux)) {
            desabilitarIteraccion(cartas); //desabilitamos la iteracción para forzar al usuario a esperar que las cartas estén colocadas de nuevo
            document.getElementById('risa-nelson').play();
            numeroIntentos++;
          setTimeout(() => {
            habilitarIteraccion(cartas); //la habilitamos cuando ya estén colocada
            resetarImagenes();
            eliminarClase("clicada");
            eliminarClase("girada");
          }, 1700);
        } else {
          carta.classList.add("encontrada");
          cartaAux.classList.add("encontrada");
          parejasEncontradas++;
          numeroIntentos++;
          if(parejasEncontradas === 6){ // parejas encontradas es igual a 6 quiere decir que el programa ha terminado
            document.getElementsByClassName("juego")[0].style.display = "none";
            document.getElementById("mano-rosquilla").style.display = "none";
            document.getElementById('cuadro-juego-completado').style.display = "flex";
            document.getElementById('mensaje-desarrollador').style.display = "flex";
            fin = Date.now(); //fin
            tiempoDeJuego = calcularTiempoDeJuego(inicio, fin);
            document.getElementById('numero-intentos').innerHTML = "Intentos, " + numeroIntentos + ".";
            document.getElementById('tiempo-jugado').innerHTML = "Tiempo, " + Math.round(tiempoDeJuego) + "s.";
            document.getElementById('puntuacion').innerHTML = "Puntuación total " +  Math.round(calcularPuntuacion(tiempoDeJuego, numeroIntentos)) + "."; //calculamos la puntuación pasandole el tiempo que al usuario le tomo pasar el juego, y el numero de intentos
            document.getElementById('simpsons-intro').play();
          }
        }
        cartaAux = null;
      } else {
        cartaAux = carta;
      }
    }
  });
});


function calcularPuntuacion(tiempoDeJuego, numeroIntentos){
    console.log(tiempoDeJuego + " " + numeroIntentos);
    return (6 * tiempoDeJuego * numeroIntentos); //puntuacion = numero de aciertos * tiempo de juego * numero de intentos
}

function calcularTiempoDeJuego(inicio, fin){ //funcion que caclcula el tiempo que el usuario ha utilizado para resolver el juego
    return ((fin-inicio)/1000); //retornamos el tiempo pasandolo a segundos
}

function desabilitarIteraccion(cartas){
    cartas.forEach(carta =>{
        carta.classList.add("desabilitar-iteraccion");
    })
}

function habilitarIteraccion(cartas){
    cartas.forEach(carta =>{
        carta.classList.remove("desabilitar-iteraccion");
    })
}

function eliminarClase(nombreClase) { // eliminamos la clase nombreClase solo de las cartas
    let cartas = document.querySelectorAll("." + nombreClase);
    cartas.forEach(carta => {
        if(!carta.classList.contains("encontrada")){
            carta.classList.remove(nombreClase);
        }
    });
}

function eliminarClaseDeTodosLosElementos(nombreClase) {
  console.log("si");
  let cartas = document.querySelectorAll("." + nombreClase);
  cartas.forEach(carta => {
    if(carta.classList.contains(nombreClase)){
      carta.classList.remove(nombreClase);
    }
    
  });
}

function verificarPareja(carta, cartaAux) { //verificamos las parejas en base al nombre que tienen
  return carta.src === cartaAux.src;
}

function mezclarBaraja(cartasSimpson) {
  for (let i = cartasSimpson.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cartasSimpson[i], cartasSimpson[j]] = [cartasSimpson[j], cartasSimpson[i]];
  }
  
}

function reiniciarJuego(){
  location.reload();
  
}
