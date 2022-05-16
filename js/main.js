/* Solicitar nombre para ofrecer servicio mas personalizado. */
Swal.fire({
  input: "text",
  title: "Bienvenido a Nutrideli!",
  inputLabel: "Cuentanos como te llamas o ingresa un nombre aleatorio:",
  inputPlaceholder: "Ingresa tu nombre aqui...",
  inputValidator: (value) => {
    if (!value) {
      return "Tienes que escribir tu nombre";
    } else {
      let welcome = document.querySelector(".welcomeText");
      welcome.innerHTML = `Hola <span>${value}</span>, este es el mundo <span>NutriDeli</span>`;
    }
  },

  width: 600,
  padding: "3em",
  color: "#716add",
  background: "../img/BgInicio.jpg",
  backdrop: `#343a40f3
`,

  showClass: {
    popup: "animate__animated animate__fadeInDown",
  },
  hideClass: {
    popup: "animate__animated animate__fadeOutUp",
  },
});

/* Agregandon intro HTML */
let intro = document.getElementById("intro");
intro.innerHTML = `<p> Este emprendimiento que surgió de la amistad y la pasión por la cocina.</p> <p> No tenemos la receta mágica para la felicidad eterna pero <b>si tenemos la receta que une lo saludable con el buen sabor </b>! <br> Ahora ya nada puede impedir que prepares una <b>deliciosa y nutritiva comida</b> en cuestión de minutos. </p> <p class="m-0"> Es tan fácil como quitar tu producto NutriDeli del freezzer o heladera y cocinarlo los minutos que sean necesarios. </p>`;

/* Agregar HTML y asignando clases */
let notice = document.getElementById("notice");
fetch("../datos/inStock.json")
  .then((resp) => resp.json())
  .then((info) => {
    let number = info.length;
    notice.innerHTML = `<p class="text-center">Dentro de nuestras 3 variedades, tenemos ${number} productos diferentes para ofrecerte. </p> 
    <div id="conStock"></div>`;
  });

/* Desplegar / ocultar listas de productos*/
let burgerButton = document.querySelector(".burgers");
let pastaButton = document.querySelector(".pasta");
let sauceButton = document.querySelector(".sauces");
let sectionH = document.querySelector(".burgerContainer");
let sectionP = document.querySelector(".pastaContainer");
let sectionS = document.querySelector(".sauceContainer");

burgerButton.addEventListener("click", showHideH);
pastaButton.addEventListener("click", showHideP);
sauceButton.addEventListener("click", showHideS);

function showHideP() {
  pastaButton.value !== "Ocultar disponibles"
    ? (sectionP.classList.toggle("show"),
      (pastaButton.value = "Ocultar disponibles"))
    : (sectionP.classList.toggle("show"),
      (pastaButton.value = "Mostrar disponibles"));
}

function showHideH() {
  burgerButton.value !== "Ocultar disponibles"
    ? (sectionH.classList.toggle("show"),
      (burgerButton.value = "Ocultar disponibles"))
    : (sectionH.classList.toggle("show"),
      (burgerButton.value = "Mostrar disponibles"));
}

function showHideS() {
  sauceButton.value !== "Ocultar disponibles"
    ? (sectionS.classList.toggle("show"),
      (sauceButton.value = "Ocultar disponibles"))
    : (sectionS.classList.toggle("show"),
      (sauceButton.value = "Mostrar disponibles"));
}

/* Filtrar productos y mostrarlos en la sección correspondiente */
const productStock = async (valor) => {
  let letter = valor.toUpperCase();
  let place = document.querySelector(`.${letter}`);

  const resp = await fetch("../datos/inStock.json");
  const info = await resp.json();

  let stockProductoEspecifico = info.filter((elem) =>
    elem.codigo.includes(`${letter}`)
  );

  stockProductoEspecifico.forEach((product) => {
    let { codigo, nombre, cantidad, precio } = product;

    place.innerHTML += `
    <div class="col-12 col-sm-5 col-md-3 card m-2">
        <img src="./img/productImg.png" class="img-fluid" alt="photo product">
          <div class="card-body subtitulo p-0">
            <p class="text-center"> ◈ ${nombre}</p>
          </div>
        <div class='row align-items-center'>
          <ul class="col-5 p-0 list-group list-group-flush align-items-center">
            <li class="list-group-item p-0">  Packs x${cantidad}</li>
            <li class="list-group-item p-0"> $ ${precio}</li>
          </ul>
          <div class="col-7 card-body text-center">
            <input type="button" class="btn btn-secondary m-0" value="Comprar" onclick="agregarCarrito('${codigo}');" />
          </div>
        </div>
      </div>`;
  });

  stockProductoEspecifico.length == 0 &&
    (place.innerHTML = `Lo siento, no tenemos productos disponibles por el momento en esta sección.`);
};

//Aplicar funciones y mostrar productos en stock
productStock("h");
productStock("p");
productStock("s");
