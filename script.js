document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     NAV — scroll state
     ===================================================== */
  const nav = document.querySelector('.nav');
  if (nav) {
    const checkScroll = () => nav.classList.toggle('scrolled', window.scrollY > 44);
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* =====================================================
     HERO — scroll-driven parallax + fog veil
     ===================================================== */
  const heroVideo = document.querySelector('.hero-video');
  const heroVeil  = document.querySelector('.hero-fog-veil');
  const hero      = document.querySelector('.hero');

  if (hero && heroVideo && heroVeil) {
    let lastScrollY = 0;
    let ticking = false;

    const updateHero = () => {
      const maxScroll = hero.offsetHeight * 0.65;
      const progress  = Math.min(lastScrollY / maxScroll, 1);
      // Slow parallax scale + drift
      const scale   = 1 + progress * 0.05;
      const driftY  = progress * 3;
      heroVideo.style.transform = `scale(${scale}) translateY(${driftY}%)`;
      // Fog veil: from 0 → 0.88 as user scrolls through hero
      heroVeil.style.opacity = (progress * 0.9).toFixed(3);
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(updateHero);
        ticking = true;
      }
    }, { passive: true });
  }

  /* =====================================================
     SCROLL REVEAL — general .reveal elements
     ===================================================== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = Number(entry.target.dataset.revealDelay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* =====================================================
     VIDEO CARDS — staggered scroll reveal via CSS custom prop
     ===================================================== */
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || '0';
        entry.target.style.setProperty('--reveal-delay', `${delay}ms`);
        entry.target.classList.add('visible');
        videoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll('.video-card').forEach((card, i) => {
    card.dataset.revealDelay = i * 70;
    videoObserver.observe(card);
  });

  /* =====================================================
     MAGNETIC PARALLAX — value cards (full 3D tilt)
     ===================================================== */
  document.querySelectorAll('.value-card').forEach(card => {
    let raf = null;

    const onMove = (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) / (rect.width  / 2); // -1 → 1
        const dy   = (e.clientY - cy) / (rect.height / 2); // -1 → 1
        card.style.transform = `
          perspective(600px)
          translate(${dx * 7}px, ${dy * 5}px)
          rotateX(${-dy * 6}deg)
          rotateY(${dx * 6}deg)
          scale(1.04)
        `;
      });
    };

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      card.style.transform = '';
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });

  /* =====================================================
     MAGNETIC PARALLAX — flip cards (translate only, not tilt —
     the flip animation handles perspective already)
     ===================================================== */
  document.querySelectorAll('.flip-card').forEach(card => {
    let raf = null;

    const onMove = (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) / (rect.width  / 2);
        const dy   = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `translate(${dx * 6}px, ${dy * 4}px)`;
      });
    };

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      card.style.transform = '';
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });

  /* =====================================================
     FLIP CARDS — touch toggle (no hover on mobile)
     ===================================================== */
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      // Only toggle on touch devices
      if (window.matchMedia('(hover: none)').matches) {
        card.classList.toggle('flipped');
      }
    });
  });

  /* =====================================================
     RIPPLE — buttons
     ===================================================== */
  const rippleKeyframes = document.createElement('style');
  rippleKeyframes.textContent =
    '@keyframes ripple-expand { to { transform: scale(4.5); opacity: 0; } }';
  document.head.appendChild(rippleKeyframes);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top:  ${e.clientY - rect.top  - size / 2}px;
      background: rgba(255,255,255,0.16);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-expand 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
      pointer-events: none;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  /* =====================================================
     PDF FALLBACK
     ===================================================== */
  const pdfEmbed    = document.querySelector('.pdf-embed');
  const pdfFallback = document.querySelector('.pdf-fallback');
  if (pdfEmbed && pdfFallback) {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      pdfFallback.classList.add('visible');
    }
    pdfEmbed.addEventListener('error', () => pdfFallback.classList.add('visible'));
  }

  /* =====================================================
     STAGGER GLOW DELAYS on glass cards
     (so cards don't all orbit in sync)
     ===================================================== */
  document.querySelectorAll('.glass-card, .flip-face').forEach((el, i) => {
    el.style.setProperty('--glow-delay', `${(i * 1.3) % 7}s`);
    el.style.setProperty('--glow-dur',   `${7 + (i % 3) * 1.5}s`);
  });

});
