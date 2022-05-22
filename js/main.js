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

/* Add HTML intro. */
let intro = document.getElementById("intro");
intro.innerHTML = `<p> Este emprendimiento que surgió de la amistad y la pasión por la cocina.</p> <p> No tenemos la receta mágica para la felicidad eterna pero <b>si tenemos la receta que une lo saludable con el buen sabor </b>! <br> Ahora ya nada puede impedir que prepares una <b>deliciosa y nutritiva comida</b> en cuestión de minutos. </p> <p class="m-0"> Es tan fácil como quitar tu producto NutriDeli del freezzer o heladera y cocinarlo los minutos que sean necesarios. </p>`;

/* Add HTML and assign classes. */
let notice = document.getElementById("notice");
fetch("../datos/inStock.json")
  .then((resp) => resp.json())
  .then((info) => {
    let number = info.length;
    notice.innerHTML = `<p class="text-center">Dentro de nuestras 3 variedades, tenemos ${number} productos diferentes para ofrecerte. </p> 
    <div id="conStock"></div>`;
  });

/* Show - hide product lists. */
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

/* Filter products and display them in the corresponding section. */
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

/* Apply functions and show products in stock */
productStock("h");
productStock("p");
productStock("s");

/* Add products to shopping cart. */
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

/* Reload shopping cart. */
function reloadCart() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let cartPlace = document.querySelector(".cartPlace");
  let cartInfo = document.querySelector(".illustrationOrButton");

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

  cartInfo.innerHTML = `
  <form>
    <div class="cartPlace text-center">
      <input type="submit" value="Realizar comprar" onclick="purchease();" class="btn btn-secondary btn-lg me-3 cartButton">
      <input type="button" value="Vaciar carrito" onclick="deleteCart();" class="btn btn-secondary btn-lg cartButton">
    </div>
  </form>`;

  let cartButton = document.querySelector(".iconCart");
  cartButton.addEventListener("click", () => {
    Swal.fire({
      title: "<strong>Carrito</strong>",
      html: `${cartPlace.innerHTML}`,
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: '<i class="fa fa-thumbs-up"></i> Cerrar',
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

/* Reduce units of a product. */
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

/* Increase units of a product. */
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

/* Delete a product. */
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

/* Checkout. */
function purchease() {
  let formTicket = document.querySelector(".createTicket");
  formTicket.style.display = "block";
}

let allTickets = [];
function confirmTicket() {
  localStorage.tickets == undefined &&
    localStorage.setItem("tickets", JSON.stringify(allTickets));

  let formTicket = document.querySelector(".ticketForm");
  let form = document.querySelector(".createTicket");
  let customerName = document.querySelector("#customerName");
  let customerPhone = document.querySelector("#customerPhone");
  let cart = JSON.parse(localStorage.getItem("cart"));
  let newTickets = JSON.parse(localStorage.getItem("tickets"));
  let deleteBtn = document.querySelector(".illustrationOrButton");
  let clearnCart = document.querySelector(".cartPlace");

  customerName.value,
    customerPhone.value != "" &&
      newTickets.push(
        new tickets(
          newTickets.length + 1,
          customerName.value,
          customerPhone.value,
          cart
        )
      );

  formTicket.addEventListener("submit", (e) => {
    e.preventDefault();

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Gracias por tu compra!",
      showConfirmButton: false,
      timer: 3000,
    });

    document.querySelector(".ticketForm").reset();
    form.style.display = "none";

    localStorage.removeItem("cart"),
      (clearnCart.innerHTML = ``),
      (deleteBtn.innerHTML = `
          <h4 class="text-center">Su carrito de compras está vacío</h4>
          <img src="./img/emptyCart.svg" alt="ilustracion cart de compras" class="img-fluid">`);
  });

  localStorage.setItem("tickets", JSON.stringify(newTickets));
}

function cancelTicket() {
  let form = document.querySelector(".createTicket");
  form.style.display = "none";
}

/* Delete shopping cart. */
function deleteCart() {
  let deleteBtn = document.querySelector(".illustrationOrButton");
  let clearnCart = document.querySelector(".cartPlace");

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-outline-success",
      cancelButton: "btn btn-outline-secondary me-3",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Vaciar carrito?",
      text: "Su carrito de compras quedará vacío.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Vaciar",
      cancelButtonText: "X",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          "Listo!",
          "Su carrito esta vacío",
          "success",
          localStorage.removeItem("cart"),
          (clearnCart.innerHTML = ``),
          (deleteBtn.innerHTML = `
          <h4 class="text-center">Su carrito de compras está vacío</h4>
          <img src="./img/emptyCart.svg" alt="ilustracion cart de compras" class="img-fluid">`)
        );
      }
    });
}

// object definition
// Suggestions
class suggestions {
  constructor(id, mensaje, correo) {
    this.id = id;
    this.mensaje = mensaje;
    this.correo = correo;
  }
}

//Queries
class queries {
  constructor(id, correo, telefono, mensaje) {
    this.id = id;
    this.correo = correo;
    this.telefono = telefono;
    this.mensaje = mensaje;
  }
}

//Tickets
class tickets {
  constructor(id, nombre, telefono, productos) {
    this.id = id;
    this.nombre = nombre;
    this.telefono = telefono;
    this.productos = productos;
  }
}

/* Display form depending on button pressed. */
let formSection = document.querySelector(".formSection");
let btnS = document.querySelector(".btnS");
let btnC = document.querySelector(".btnC");

btnS.addEventListener("click", sug);
btnC.addEventListener("click", cont);

// Suggestion form.
function sug() {
  formSection.innerHTML = `
  <form id="form1">
    <h2 class="text-center footerTitle">Sugerencias</h2>

    <div class="mb-3">
      <label for="mail1" class="form-label">Correo</label>
      <input required type="email" class="form-control" id="mail1" placeholder="name@example.com" required>
    </div>

    <div class="mb-3">
      <label for="suggestion" class="form-label">Sugerencia</label>
      <textarea required class="form-control text" id="suggestion" rows="3" placeholder="Escribe una sugerencia" required></textarea>
    </div>

  <input type="submit" value="Enviar" onclick="addSuggestion();" class="sugerencias btn formsButton">
</form>
  `;
}

// Contact form.
function cont() {
  formSection.innerHTML = `
  <form id="form2">
    <h2 id="contact" class="footerTitle text-center">Contacto</h2>
      
    <div class="mb-3">
      <label for="mail2" class="form-label">Correo</label>
      <input required type="email" class="form-control" id="mail2" placeholder="name@example.com" required>
    </div>
      
    <div class="mb-3">
      <label for="phone" class="form-label">Telefono de contacto</label>
      <input required type="text" class="form-control" id="phone" placeholder="099 123 456" required>
    </div>
      
    <div class="mb-3">
      <label for="message" class="form-label">Mensaje</label>
      <textarea required class="form-control text" id="message" rows="3" placeholder="Escribe aquí tu duda o consulta..." required></textarea>
    </div>

    <input type="submit" value="Enviar" onclick="addQuery();" class="contacto btn formsButton">
    </form>
    `;
}

/* Save query */
let allQueries = [];

function addQuery() {
  localStorage.queries == undefined &&
    localStorage.setItem("queries", JSON.stringify(allQueries));

  let inputMail2 = document.querySelector("#mail2");
  let inputPhone = document.querySelector("#phone");
  let inputMessage = document.querySelector("#message");
  let form = document.querySelector("#form2");
  let newQuery = JSON.parse(localStorage.getItem("queries"));

  inputMail2.value,
    inputPhone.value,
    inputMessage.value != "" &&
      newQuery.push(
        new queries(
          newQuery.length + 1,
          inputMail2.value,
          inputPhone.value,
          inputMessage.value
        )
      );

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Gracias por tu consulta, te contestaremos lo antes posible.",
      showConfirmButton: false,
      timer: 3000,
    });

    document.querySelector("#form2").reset();
  });

  localStorage.setItem("queries", JSON.stringify(newQuery));
}

/* Save suggestion */
let allSuggestion = [];

function addSuggestion() {
  localStorage.suggestions == undefined &&
    localStorage.setItem("suggestions", JSON.stringify(allSuggestion));

  let inputMail = document.getElementById("mail1");
  let inputSug = document.getElementById("suggestion");
  let form = document.querySelector("#form1");
  let NewSuggestion = JSON.parse(localStorage.getItem("suggestions"));

  inputMail.value,
    inputSug.value != "" &&
      NewSuggestion.push(
        new suggestions(
          NewSuggestion.length + 1,
          inputSug.value,
          inputMail.value
        )
      );

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Gracias por tu sugerencia, la tendremos en cuenta!",
      showConfirmButton: false,
      timer: 2000,
    });

    document.querySelector("#form1").reset();
  });

  localStorage.setItem("suggestions", JSON.stringify(NewSuggestion));
}
