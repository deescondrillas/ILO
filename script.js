// ===== Navigation Functionality =====
document.addEventListener('DOMContentLoaded', () => {
  const navTabs = document.querySelectorAll('.nav-tab');
  const pages = document.querySelectorAll('.page');

  // Handle navigation tab clicks
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPage = tab.dataset.page;

      // Update active tab
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show target page
      pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === targetPage) {
          page.classList.add('active');
        }
      });

      // Smooth scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  // ===== Keyboard Navigation =====
  navTabs.forEach((tab, index) => {
    tab.addEventListener('keydown', (e) => {
      let newIndex;

      if (e.key === 'ArrowRight') {
        newIndex = (index + 1) % navTabs.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (index - 1 + navTabs.length) % navTabs.length;
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tab.click();
        return;
      } else {
        return;
      }

      navTabs[newIndex].focus();
    });
  });

  // ===== Check PDF Support =====
  const pdfEmbed = document.querySelector('.pdf-embed');
  const pdfFallback = document.querySelector('.pdf-fallback');

  if (pdfEmbed && pdfFallback) {
    // Simple check - if on mobile or certain browsers, show fallback
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      pdfFallback.style.display = 'block';
    }

    // Handle iframe load error
    pdfEmbed.addEventListener('error', () => {
      pdfFallback.style.display = 'block';
    });
  }

  // ===== Intersection Observer for Animations =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe video cards for staggered animation
  const videoCards = document.querySelectorAll('.video-card');
  videoCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  // Observe material items
  const materialItems = document.querySelectorAll('.material-item');
  materialItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`;
    observer.observe(item);
  });

  // ===== URL Hash Navigation =====
  const handleHashNavigation = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const targetTab = document.querySelector(`[data-page="${hash}"]`);
      if (targetTab) {
        targetTab.click();
      }
    }
  };

  // Handle initial hash
  handleHashNavigation();

  // Handle hash changes
  window.addEventListener('hashchange', handleHashNavigation);

  // Update hash on navigation
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const page = tab.dataset.page;
      history.pushState(null, '', `#${page}`);
    });
  });

  // ===== Hero Image Parallax Effect =====
  const heroContainer = document.querySelector('.hero-image-container');
  const heroImage = document.querySelector('.hero-image');

  if (heroContainer && heroImage) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rect = heroContainer.getBoundingClientRect();

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const parallax = scrolled * 0.3;
        heroImage.style.transform = `translateY(${parallax}px) scale(1.1)`;
      }
    });
  }

  // ===== Add ripple effect to buttons =====
  const buttons = document.querySelectorAll('.btn, .nav-tab');

  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  console.log('Juntos Logramos Metas - Website initialized successfully');
});
