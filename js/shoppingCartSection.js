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
    <div class="cartPlace text-center">
      <input type="submit" value="Realizar comprar" onclick="purchease();" class="btn btn-secondary btn-lg me-3 cartButton">
      <input type="button" value="Vaciar carrito" onclick="deleteCart();" class="btn btn-secondary btn-lg cartButton">
    </div>`;

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

  if (product.unidades > 1) {
    product.unidades--;

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
}

/* Increase units of a product. */
function increaseUnits(codigo) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let product = cart.find((elem) => elem.codigo == codigo);

  if (product.unidades < 10) {
    product.unidades++;

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
}

/* Delete a product. */
function remove(codigo) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let product = cart.filter((elem) => elem.codigo !== codigo);
  let deleteBtn = document.querySelector(".illustrationOrButton");

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

  localStorage.cart == "[]" &&
    (deleteBtn.innerHTML = `
  <h4 class="text-center">Su carrito de compras está vacío</h4>
  <img src="./img/emptyCart.svg" alt="ilustracion cart de compras" class="img-fluid">`);
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
//Tickets
class tickets {
  constructor(id, nombre, telefono, productos) {
    this.id = id;
    this.nombre = nombre;
    this.telefono = telefono;
    this.productos = productos;
  }
}
