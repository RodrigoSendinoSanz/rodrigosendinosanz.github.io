const toggle = document.querySelector(".toggle")
const topbar = document.querySelector(".topbar")
const main = document.querySelector(".main")
const navegation = document.querySelector(".navegation")
const themeSwitch = document.querySelector(".themeSwitch")
const body = document.querySelector("body")

// Alternar menú
toggle.onclick = () => {
  toggle.classList.toggle("active")
  topbar.classList.toggle("active")
  main.classList.toggle("active")
  navegation.classList.toggle("active")
}

// CORREGIDO: Simplificar el modo oscuro - remover la detección automática
// Cambiar el tema manualmente con el interruptor
themeSwitch.onclick = () => {
  body.classList.toggle("dark")

  // Guardar la preferencia del usuario en localStorage
  if (body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark")
  } else {
    localStorage.setItem("theme", "light")
  }
}

// CORREGIDO: Aplicar la preferencia de tema guardada al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark") {
    body.classList.add("dark")
  } else if (savedTheme === "light") {
    body.classList.remove("dark")
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    // Si no hay preferencia guardada, usar la del sistema
    body.classList.add("dark")
  }

  const menuLinks = document.querySelectorAll(".navegation ul li a")

  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Cerrar menú en móvil
      toggleMenu()

      // Scroll suave mejorado
      const targetId = this.getAttribute("href")
      if (targetId.startsWith("#")) {
        e.preventDefault()
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80 // Ajuste para el header fijo
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }
      }
    })
  })
})

// Cerrar menú al hacer clic en un enlace (MEJORADO)
function toggleMenu() {
  if (window.innerWidth <= 768) {
    navegation.classList.remove("active")
    main.classList.remove("active")
    topbar.classList.remove("active")
    toggle.classList.remove("active")
  }
}

// Cerrar menú al hacer clic fuera de él en móvil
document.addEventListener("click", (e) => {
  if (window.innerWidth <= 768) {
    const isClickInsideNav = navegation.contains(e.target)
    const isClickOnToggle = toggle.contains(e.target)

    if (!isClickInsideNav && !isClickOnToggle && navegation.classList.contains("active")) {
      toggleMenu()
    }
  }
})

// Manejar redimensionamiento de ventana
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    // Resetear clases en desktop
    navegation.classList.remove("active")
    main.classList.remove("active")
    topbar.classList.remove("active")
    toggle.classList.remove("active")
  }
})

// Highlight del menú activo basado en scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]")
  const scrollPos = window.scrollY + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")
    const correspondingLink = document.querySelector(`.navegation ul li a[href="#${sectionId}"]`)

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      // Remover clase activa de todos los enlaces
      document.querySelectorAll(".navegation ul li a").forEach((link) => {
        link.classList.remove("active")
      })
      // Añadir clase activa al enlace correspondiente
      if (correspondingLink) {
        correspondingLink.classList.add("active")
      }
    }
  })
})
