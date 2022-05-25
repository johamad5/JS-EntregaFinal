/* Request name to offer more personalized service. */
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
