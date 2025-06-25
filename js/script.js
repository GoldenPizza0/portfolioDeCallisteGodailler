// function sendMail() {
//     const name = document.getElementById("name").value.trim();
//     const email = document.getElementById("email").value.trim();
//     const message = document.getElementById("message").value.trim();

//     const subject = encodeURIComponent("Nouveau message de contact");
//     const body = encodeURIComponent(
//         `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
//     );

//     const mailtoLink = `mailto:godacalliste@gmail.com?subject=${subject}&body=${body}`;
//     window.location.href = mailtoLink;

//     return false;
// }

// const backToTopButton = document.getElementById('backToTop');

// window.addEventListener('scroll', () => {
//   if (window.scrollY > 200) {
//     backToTopButton.classList.add('show');
//   } else {
//     backToTopButton.classList.remove('show');
//   }
// });

// backToTopButton.addEventListener('click', () => {
//   window.scrollTo({
//     top: 0,
//     behavior: 'smooth'
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  // Fonction d'envoi de mail via mailto
  function sendMail() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const subject = encodeURIComponent("Nouveau message de contact");
    const body = encodeURIComponent(
      `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    const mailtoLink = `mailto:godacalliste@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    return false; // empêche la soumission du formulaire classique
  }

  // Expose sendMail dans le scope global pour que le formulaire puisse l'appeler
  window.sendMail = sendMail;

  // Gestion du bouton "backToTop"
  const backToTopButton = document.getElementById('backToTop');

  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });

    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});