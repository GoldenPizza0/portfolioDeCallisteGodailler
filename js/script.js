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
 * Handles touch-based card flipping on mobile devices
 */

class MobileCardInteractions {
    constructor() {
        this.isMobile = this.detectMobile();
        this.flippedCards = new Set();
        this.init();
    }

    /**
     * Detect if the device is mobile based on multiple factors
     */
    detectMobile() {
        // Check for touch capability and screen size
        const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768;
        const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        return hasTouchScreen && (isSmallScreen || isMobileUserAgent);
    }

    /**
     * Initialize mobile interactions
     */
    init() {
        if (!this.isMobile) {
            return; // Exit if not on mobile
        }

        this.setupCardListeners();
        this.setupResizeListener();
        
        // Add mobile class to body for additional styling if needed
        document.body.classList.add('mobile-device');
    }

    /**
     * Setup event listeners for card interactions
     */
    setupCardListeners() {
        const cards = document.querySelectorAll('[data-mobile-card]');
        
        cards.forEach(card => {
            // Remove any existing listeners
            card.removeEventListener('click', this.handleCardClick.bind(this));
            card.removeEventListener('touchstart', this.handleTouchStart.bind(this));
            card.removeEventListener('touchend', this.handleTouchEnd.bind(this));
            
            // Add new listeners
            card.addEventListener('click', this.handleCardClick.bind(this));
            card.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            card.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
            
            // Prevent context menu on long press
            card.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
        });
    }

    /**
     * Handle touch start event
     */
    handleTouchStart(event) {
        const card = event.currentTarget;
        card.setAttribute('data-touch-start', Date.now());
    }

    /**
     * Handle touch end event
     */
    handleTouchEnd(event) {
        const card = event.currentTarget;
        const touchStart = card.getAttribute('data-touch-start');
        const touchDuration = Date.now() - parseInt(touchStart);
        
        // Only process if it's a quick tap (less than 500ms)
        if (touchDuration < 500) {
            this.toggleCard(card);
        }
        
        card.removeAttribute('data-touch-start');
    }

    /**
     * Handle card click event
     */
    handleCardClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const card = event.currentTarget;
        this.toggleCard(card);
    }

    /**
     * Toggle card flip state
     */
    toggleCard(card) {
        const cardId = this.getCardId(card);
        
        if (this.flippedCards.has(cardId)) {
            // Card is currently flipped, flip it back
            card.classList.remove('flipped');
            this.flippedCards.delete(cardId);
        } else {
            // Card is not flipped, flip it
            card.classList.add('flipped');
            this.flippedCards.add(cardId);
        }

        // Add haptic feedback if available
        this.addHapticFeedback();
    }

    /**
     * Get unique identifier for a card
     */
    getCardId(card) {
        // Use the alt text of the image as identifier
        const img = card.querySelector('.flip-card-front img');
        return img ? img.getAttribute('alt') : Math.random().toString(36).substr(2, 9);
    }

    /**
     * Add haptic feedback for supported devices
     */
    addHapticFeedback() {
        if ('vibrate' in navigator) {
            navigator.vibrate(50); // Short vibration
        }
    }

    /**
     * Setup resize listener to handle orientation changes
     */
    setupResizeListener() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = this.detectMobile();
                
                // If device type changed, reinitialize
                if (wasMobile !== this.isMobile) {
                    if (this.isMobile) {
                        this.setupCardListeners();
                        document.body.classList.add('mobile-device');
                    } else {
                        this.cleanup();
                        document.body.classList.remove('mobile-device');
                    }
                }
            }, 250);
        });
    }

    /**
     * Clean up mobile interactions
     */
    cleanup() {
        const cards = document.querySelectorAll('[data-mobile-card]');
        
        cards.forEach(card => {
            card.classList.remove('flipped');
            card.removeEventListener('click', this.handleCardClick);
            card.removeEventListener('touchstart', this.handleTouchStart);
            card.removeEventListener('touchend', this.handleTouchEnd);
        });
        
        this.flippedCards.clear();
    }

    /**
     * Reset all cards to their initial state
     */
    resetAllCards() {
        const cards = document.querySelectorAll('[data-mobile-card]');
        
        cards.forEach(card => {
            card.classList.remove('flipped');
        });
        
        this.flippedCards.clear();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all styles are loaded
    setTimeout(() => {
        window.mobileCardInteractions = new MobileCardInteractions();
    }, 100);
});

// Handle page visibility changes to reset cards when page becomes visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.mobileCardInteractions) {
        // Optional: Reset cards when page becomes visible
        // window.mobileCardInteractions.resetAllCards();
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileCardInteractions;
}
