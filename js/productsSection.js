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
