const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");

const registroPorPagina = 40;

let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
  formulario.addEventListener("submit", validarFormulario);
};

function validarFormulario(e) {
  e.preventDefault();

  const terminoBusqueda = document.querySelector("#termino").value;
  if (terminoBusqueda === "") {
    mostrarAlerta("Agrega un termino de busqueda");
    return;
  }

  consultarAPI();
}

async function consultarAPI() {
  const termino = document.querySelector("#termino").value;

  const key = "25431686-b41904e3d7eb06e78635fbc6a";
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`; //podemos seleccionar la cantidad de elementos que nos entrega la API con el simbolo (&) y el parametro (per_page) y con el simbolo de igualdad (=) le pasamos el numero de elementos estos nos los especifica la documentacion de la api

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    totalPaginas = calcularPaginas(datos.totalHits);
    mostrarImagenes(datos.hits);
  } catch (error) {
    console.log(error);
  }
}

//generador que registra la cantidad de elementos dentro de cada pagina
function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function calcularPaginas(total) {
  return parseInt(Math.ceil(total / registroPorPagina));
}

function mostrarImagenes(imagenes) {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }

  //iterar sobre el arreglo de imagenes y construir el html
  imagenes.forEach((imagen) => {
    const { previewURL, largeImageURL, likes, views } = imagen;

    resultado.innerHTML += `

            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}"/>

                    <div class="p-4">

                        <p class="font-bold">${likes} <span class="font-light">Me Gusta</span></p>
                        <p class="font-bold">${views} <span class="font-light">Vistas</span></p>

                        <a
                            class="block w-full bg-blue-800 hover:bg-blue-500 text-white font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" target="_blanck" rel="noopener noreferrer">
                            Ver Imagen
                        </a>
                    </div>
                </div>
            </div>
        `;
  });

  //limpiar el paginador previo
  while (paginacionDiv.firstChild) {
    paginacionDiv.removeChild(paginacionDiv.firstChild);
  }

  //generamos el nuevo paginador
  imprimirPaginador();
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);

  while (true) {
    const { value, done } = iterador.next();
    if (done) return;

    //caso contrario genera un boton por caga pagina creada por el generador
    const boton = document.createElement("a");
    boton.href = "#";
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add(
      "siguiente",
      "bg-yellow-400",
      "px-4",
      "py-1",
      "mr-2",
      "font-bold",
      "mb-10",
      "uppercase",
      "rounded"
    );

    boton.onclick = () => {
      paginaActual = value;
      consultarAPI();
    };

    paginacionDiv.appendChild(boton);
  }
}

function mostrarAlerta(mensaje) {
  const existe = document.querySelector(".bg-red-100");

  if (!existe) {
    const alerta = document.createElement("p");
    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center"
    );

    alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block" sm: "inline">${mensaje}</span>
        `;

    formulario.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}
