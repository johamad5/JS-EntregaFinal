/* Solicitar nombre para ofrecer servicio mas personalizado. 
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
});*/

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
            <input type="button" class="btn btn-secondary m-0" value="Comprar" onclick="addCart('${codigo}');" />
          </div>
        </div>
      </div>`;
  });

  stockProductoEspecifico.length == 0 &&
    (place.innerHTML = `Lo siento, no tenemos productos disponibles por el momento en esta sección.`);
};

/* Aplicar funciones y mostrar productos en stock */
productStock("h");
productStock("p");
productStock("s");

/* Agregar productos al carrito de compra */
let shoppingCart = [];

async function addCart(productCode) {
  localStorage.cart == undefined &&
    localStorage.setItem("cart", JSON.stringify(shoppingCart));

  let NewCart = JSON.parse(localStorage.getItem("cart"));

  const resp = await fetch("../datos/inStock.json");
  const info = await resp.json();

  productCode = productCode.toUpperCase();
  let solicitedProduct = info.filter(
    (element) => element.codigo == productCode
  );

  let article = NewCart.find((element) => element.codigo == productCode);

  article == undefined ? NewCart.push(...solicitedProduct) : article.unidades++;

  localStorage.setItem("cart", JSON.stringify(NewCart));

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "info",
    title: `Producto agregado al carrito!`,
  });

  reloadCart();
}

function reloadCart() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let cartPlace = document.querySelector(".cartPlace");
  let cartInfo = document.querySelector("#cart div");

  cartInfo.innerHTML = "";
  cartPlace.innerHTML = "";

  cart.forEach((elem) => {
    let { codigo, nombre, cantidad, precio, unidades } = elem;

    cartPlace.innerHTML += ` 
    <div class='cardCart row align-items-center radius'>
      <div class='col-12 col-md-8'>
          <p class='m-0'><b>◈${nombre}</b></p>
          <span class='m-3'>Pack x${cantidad} | $${precio} | Unidades: ${unidades}</span>
      </div>
      <div class='col-12 col-md-4'>
      <br>
        <div class='row'>
          <div class='col d-flex justify-content-evenly'>
            <input type='button' value='-' onclick="decreaseUnits('${codigo}');" class='btn btn-dark btnCardCart ${codigo}Decrease'/>
            <input type='button' value='+' onclick="increaseUnits('${codigo}');" class='btn btn-dark btnCardCart'/>
          </div>
          <div class='col'>
            <input type='button' value='Eliminar' onclick="remove('${codigo}');" class='btn btn-dark btnCardCart'/>
          </div>
        </div>
      </div>
    </div>`;
  });

  let cartButton = document.querySelector(".iconCart");
  cartButton.addEventListener("click", () => {
    Swal.fire({
      title: "<strong>Carrito</strong>",
      html: `${cartPlace.innerHTML}`,
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
      confirmButtonAriaLabel: "Thumbs up, great!",
      cancelButtonAriaLabel: "Thumbs down",

      showClass: {
        popup: "animate__animated animate__fadeInUp",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutDown",
      },
    });
  });
}

function decreaseUnits(codigo) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let product = cart.find((elem) => elem.codigo == codigo);

  product.unidades > 1 && product.unidades--;

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "warning",
    title: `Cantidad disminuida!`,
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  reloadCart();
}

function increaseUnits(codigo) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let product = cart.find((elem) => elem.codigo == codigo);

  product.unidades < 10 && product.unidades++;

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "warning",
    title: `Cantidad aumentada!`,
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  reloadCart();
}

function remove(codigo) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let product = cart.filter((elem) => elem.codigo !== codigo);

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "error",
    title: `Producto eliminado!`,
  });

  localStorage.setItem("cart", JSON.stringify(product));
  reloadCart();
}
