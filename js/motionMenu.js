let toggle = document.querySelector(".toggle");
let topbar = document.querySelector(".topbar");
let main = document.querySelector(".main");
let navegation = document.querySelector(".navegation");
let themeSwitch = document.querySelector(".themeSwitch");
let body = document.querySelector("body");

// Alternar menú
toggle.onclick = function () {
  toggle.classList.toggle("active");
  topbar.classList.toggle("active");
  main.classList.toggle("active");
  navegation.classList.toggle("active");
};


// Comprobar la preferencia del sistema operativo al cargar la página
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  body.classList.add("dark");
}

// Cambiar el tema manualmente con el interruptor
themeSwitch.onclick = function () {
  body.classList.toggle("dark");
};

// Cerrar menú al hacer clic en un enlace
function toggleMenu() {
  navegation.classList.remove("active");
  main.classList.remove("active");
  toggle.classList.remove("active");
}
