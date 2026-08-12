/* ==========================================================================
   ROYAL FEAST EVENTS - MAIN JAVASCRIPT & THREE.JS 3D ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarAndDrawer();
  initThemeAndRtl();
  initThreeJsHero();
  initGsapAnimations();
  initMenuFiltering();
  initGalleryLightbox();
  initTiltCards();
  initAccordions();
  initCounterAnimations();
  initCustomMagneticCursor();
  initSparkleClickParticles();
  initPasswordToggles();
});

/* --------------------------------------------------------------------------
   1. NAVBAR & OFF-CANVAS HAMBURGER DRAWER (STRICT 1024px COMPLIANCE)
   -------------------------------------------------------------------------- */
function initNavbarAndDrawer() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta a, .drawer-tools a');

  // Scroll effect & Back to Top floating button toggle
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    if (backToTopBtn) {
      if (window.scrollY > 100) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  backToTopBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Drawer Toggle
  function toggleDrawer() {
    hamburger?.classList.toggle('active');
    drawer?.classList.toggle('open');
    overlay?.classList.toggle('active');
    document.body.style.overflow = drawer?.classList.contains('open') ? 'hidden' : '';
  }

  const drawerCloseBtns = document.querySelectorAll('.drawer-close-btn');
  hamburger?.addEventListener('click', toggleDrawer);
  overlay?.addEventListener('click', toggleDrawer);
  drawerCloseBtns.forEach(btn => btn.addEventListener('click', toggleDrawer));

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (drawer?.classList.contains('open')) {
        toggleDrawer();
      }
    });
  });

  // Mobile Drawer Dropdown Toggles
  const drawerDropdownToggles = document.querySelectorAll('.drawer-dropdown-toggle');
  drawerDropdownToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.drawer-dropdown');
      parent?.classList.toggle('open');
    });
  });
}

/* --------------------------------------------------------------------------
   1B. THEME & RTL TOGGLE ENGINE
   -------------------------------------------------------------------------- */
function initThemeAndRtl() {
  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');

  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      themeBtns.forEach(b => {
        const icon = b.querySelector('i');
        if (icon) icon.className = isLight ? 'ri-sun-line' : 'ri-moon-line';
      });
    });
  });

  rtlBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', newDir);
    });
  });
}

/* --------------------------------------------------------------------------
   2. THREE.JS 3D LUXURY DINING HERO ENGINE
   -------------------------------------------------------------------------- */
function initThreeJsHero() {
  const container = document.getElementById('hero-3d-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 8);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.2);
  scene.add(ambientLight);

  const goldLight = new THREE.PointLight(0xd4af37, 3, 20);
  goldLight.position.set(5, 5, 5);
  scene.add(goldLight);

  const purpleLight = new THREE.PointLight(0x8b5cf6, 2, 20);
  purpleLight.position.set(-5, -5, 3);
  scene.add(purpleLight);

  // Group for floating 3D dining tray & cutlery
  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  // Main Tray (Cylinder/Torus combination)
  const trayGeo = new THREE.CylinderGeometry(2.8, 3, 0.2, 32);
  const trayMat = new THREE.MeshStandardMaterial({
    color: 0x121216,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0xd4af37,
    emissiveIntensity: 0.05
  });
  const tray = new THREE.Mesh(trayGeo, trayMat);
  tray.rotation.x = 0.5;
  heroGroup.add(tray);

  // Gold Ring Rim
  const ringGeo = new THREE.TorusGeometry(3.05, 0.05, 16, 100);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.1 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = 0.5;
  heroGroup.add(ring);

  // Floating Particles (Steam / Sparkles)
  const particleCount = 70;
  const particlesGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 12;
    positions[i + 1] = (Math.random() - 0.5) * 8;
    positions[i + 2] = (Math.random() - 0.5) * 8;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xf7e7ce,
    size: 0.08,
    transparent: true,
    opacity: 0.75
  });

  const particleSystem = new THREE.Points(particlesGeo, particleMat);
  heroGroup.add(particleSystem);

  // Mouse Parallax Effect
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  // Animation Loop
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    heroGroup.rotation.y = elapsedTime * 0.2 + mouseX;
    heroGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1 + mouseY;

    particleSystem.rotation.y = -elapsedTime * 0.1;

    renderer.render(scene, camera);
  }
  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* --------------------------------------------------------------------------
   3. GSAP & SCROLLTRIGGER REVEALS
   -------------------------------------------------------------------------- */
function initGsapAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Fade Up Elements
  gsap.utils.toArray('.gsap-fade-up').forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. MENU CATEGORY TAB FILTERING
   -------------------------------------------------------------------------- */
function initMenuFiltering() {
  const tabs = document.querySelectorAll('.menu-tabs .tab-btn');
  const items = document.querySelectorAll('.menu-card');

  if (!tabs.length || !items.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      items.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.5s ease forward';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. GALLERY LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  // Create Modal dynamically if needed
  let modal = document.querySelector('.gallery-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-wrapper gallery-modal';
    modal.innerHTML = `
      <div class="modal-body glass-card text-center" style="position:relative; max-width:800px;">
        <button class="modal-close" style="position:absolute; top:16px; right:16px; font-size:1.5rem; color:#fff;">&times;</button>
        <img class="lightbox-img" src="" alt="Gallery Preview" style="width:100%; border-radius:16px; margin-top:20px;">
        <h3 class="lightbox-title font-serif gold-gradient-text" style="margin-top:16px;"></h3>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const lightboxImg = modal.querySelector('.lightbox-img');
  const lightboxTitle = modal.querySelector('.lightbox-title');
  const closeBtn = modal.querySelector('.modal-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title')?.textContent || 'Royal Feast Luxury Showcase';
      if (img) {
        lightboxImg.src = img.src;
        lightboxTitle.textContent = title;
        modal.classList.add('active');
      }
    });
  });

  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

/* --------------------------------------------------------------------------
   6. 3D TILT CARDS EFFECT
   -------------------------------------------------------------------------- */
function initTiltCards() {
  const cards = document.querySelectorAll('.service-card, .menu-card, .tilt-card, .tilt-card-3d, .glow-gold-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(1000px) rotateX(${-y / 20}deg) rotateY(${x / 20}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* Accordion FAQ Toggle */
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');
      
      // Close other accordion items
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. NUMERICAL COUNTER ANIMATIONS
   -------------------------------------------------------------------------- */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter-value');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        let count = 0;
        const speed = target / 50;
        const updateCount = () => {
          count += speed;
          if (count < target) {
            entry.target.innerText = Math.ceil(count);
            setTimeout(updateCount, 25);
          } else {
            entry.target.innerText = target + '+';
          }
        };
        updateCount();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* --------------------------------------------------------------------------
   8. THEME & RTL TOGGLE CONTROLLER
   -------------------------------------------------------------------------- */
function initThemeAndRtl() {
  // Theme Toggle
  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('royal_feast_theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) icon.className = 'ri-sun-line';
    });
  }

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('royal_feast_theme', isLight ? 'light' : 'dark');

      themeBtns.forEach(b => {
        const icon = b.querySelector('i');
        if (icon) {
          icon.className = isLight ? 'ri-sun-line' : 'ri-moon-line';
        }
      });
    });
  });

  // RTL Toggle
  const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
  const savedRtl = localStorage.getItem('royal_feast_rtl');

  if (savedRtl === 'true') {
    document.documentElement.setAttribute('dir', 'rtl');
    rtlBtns.forEach(btn => btn.classList.add('active'));
  }

  rtlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      if (isRtl) {
        document.documentElement.removeAttribute('dir');
        localStorage.setItem('royal_feast_rtl', 'false');
        rtlBtns.forEach(b => b.classList.remove('active'));
      } else {
        document.documentElement.setAttribute('dir', 'rtl');
        localStorage.setItem('royal_feast_rtl', 'true');
        rtlBtns.forEach(b => b.classList.add('active'));
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. CUSTOM MAGNETIC GOLD CURSOR
   -------------------------------------------------------------------------- */
function initCustomMagneticCursor() {
  if (window.innerWidth <= 1024) return;

  document.body.classList.add('has-custom-cursor');

  let cursor = document.querySelector('.custom-cursor');
  let follower = document.querySelector('.custom-cursor-follower');

  if (!cursor) {
    cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
  }

  if (!follower) {
    follower = document.createElement('div');
    follower.className = 'custom-cursor-follower';
    document.body.appendChild(follower);
  }

  let posX = 0, posY = 0;
  let mouseX = 0, mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    posX += (mouseX - posX) * 0.16;
    posY += (mouseY - posY) * 0.16;
    follower.style.left = `${posX}px`;
    follower.style.top = `${posY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Attach hover state to interactive elements
  const hoverElements = 'a, button, .glass-card, input, select, textarea, .tab-btn, .accordion-header';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverElements)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverElements)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}

/* --------------------------------------------------------------------------
   10. GOLDEN SPARKLE BURST ON CLICK
   -------------------------------------------------------------------------- */
function initSparkleClickParticles() {
  document.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('button, .btn-primary, .btn-secondary, a.service-link');
    if (!targetBtn) return;

    for (let i = 0; i < 14; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'sparkle-particle';
      document.body.appendChild(sparkle);

      const x = e.clientX;
      const y = e.clientY;
      const destinationX = (Math.random() - 0.5) * 160;
      const destinationY = (Math.random() - 0.5) * 160;
      const size = Math.random() * 6 + 4;

      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;

      sparkle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${destinationX}px, ${destinationY}px) scale(0)`, opacity: 0 }
      ], {
        duration: 700 + Math.random() * 400,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }).onfinish = () => sparkle.remove();
    }
  });
}

/* --------------------------------------------------------------------------
   14. PASSWORD VISIBILITY TOGGLE (EYE ICON)
   -------------------------------------------------------------------------- */
function initPasswordToggles() {
  const toggleIcons = document.querySelectorAll('.password-toggle-icon');
  toggleIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const wrapper = icon.closest('.password-input-wrapper');
      const input = wrapper ? wrapper.querySelector('input') : null;
      if (!input) return;
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('ri-eye-line');
        icon.classList.add('ri-eye-off-line');
      } else {
        input.type = 'password';
        icon.classList.remove('ri-eye-off-line');
        icon.classList.add('ri-eye-line');
      }
    });
  });
}

