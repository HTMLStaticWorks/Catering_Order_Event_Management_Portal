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
});

/* --------------------------------------------------------------------------
   1. NAVBAR & OFF-CANVAS HAMBURGER DRAWER (STRICT 1024px COMPLIANCE)
   -------------------------------------------------------------------------- */
function initNavbarAndDrawer() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta a');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Drawer Toggle
  function toggleDrawer() {
    hamburger?.classList.toggle('active');
    drawer?.classList.toggle('open');
    overlay?.classList.toggle('active');
    document.body.style.overflow = drawer?.classList.contains('open') ? 'hidden' : '';
  }

  hamburger?.addEventListener('click', toggleDrawer);
  overlay?.addEventListener('click', toggleDrawer);

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
