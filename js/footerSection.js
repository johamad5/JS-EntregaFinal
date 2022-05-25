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
