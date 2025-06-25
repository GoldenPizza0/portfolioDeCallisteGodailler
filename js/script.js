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
/**
 * Mobile interactions for skill cards
 * Simple touch-based card flipping for mobile devices
 */

class MobileCardInteractions {
    constructor() {
        this.flippedCards = new Set();
        this.init();
    }

    /**
     * Detect if device is mobile/touch
     */
    isMobile() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    /**
     * Initialize interactions
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupCards());
        } else {
            this.setupCards();
        }
    }

    /**
     * Setup card interactions
     */
    setupCards() {
        const cards = document.querySelectorAll('.flip-card[data-mobile-card]');
        
        cards.forEach(card => {
            // Only add mobile interactions if it's a touch device
            if (this.isMobile()) {
                this.setupMobileCard(card);
            }
        });
    }

    /**
     * Setup mobile-specific card behavior
     */
    setupMobileCard(card) {
        // Remove any existing listeners
        card.removeEventListener('click', card._mobileClickHandler);
        
        // Create and store the click handler
        card._mobileClickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleCard(card);
        };
        
        // Add click listener
        card.addEventListener('click', card._mobileClickHandler);
        
        // Prevent context menu
        card.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Add mobile styling
        card.style.cursor = 'pointer';
        card.style.touchAction = 'manipulation';
        card.style.userSelect = 'none';
        card.style.webkitUserSelect = 'none';
    }

    /**
     * Toggle card flip state
     */
    toggleCard(card) {
        const cardId = this.getCardId(card);
        
        if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');
            this.flippedCards.delete(cardId);
        } else {
            card.classList.add('flipped');
            this.flippedCards.add(cardId);
        }
        
        // Add haptic feedback if available
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }

    /**
     * Get unique ID for card
     */
    getCardId(card) {
        const img = card.querySelector('.flip-card-front img');
        return img ? img.getAttribute('alt') || 'card-' + Math.random().toString(36).substr(2, 9) : 'unknown';
    }
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.mobileCardInteractions = new MobileCardInteractions();
});