  // Inicializar EmailJS
  emailjs.init('sGHxLLa2XymtSJ7b5');

  // Manejar el envío del formulario
  document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const serviceID = 'service_sf7itqg'; 
    const templateID = 'template_q7dasgc';

    // Enviar el correo
    emailjs.sendForm(serviceID, templateID, this).then(
      (response) => {
        Swal.fire({
            title: "Correo enviado",
            text: "Se ha enviado el correo",
            icon: "success"
        });
        this.reset(); // Resetear el formulario
      },
      (error) => {
        Swal.fire({
            title: "Error",
            text: "No se ha podido enviar el correo",
            icon: "error"
        });
        console.error('Error:', error);
      }
    );
  });