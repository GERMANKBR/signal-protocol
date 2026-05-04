/* ============================================
   $SIGNAL Landing Page — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initScrollAnimations();
  initFAQ();
  initDonutChart();
  initTokenDots();
});

/* --- Particle Background --- */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.5 ? '0,255,136' : '0,212,255';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  const count = Math.min(80, Math.floor((w * h) / 12000));
  for (let i = 0; i < count; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,255,136,${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
}

/* --- Navbar --- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
  const els = document.querySelectorAll('[data-anim]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

/* --- FAQ Accordion --- */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* --- Donut Chart --- */
function initDonutChart() {
  const canvas = document.getElementById('donutChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = 320;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  const data = [
    { pct: 35, color: '#00ff88', label: 'Community' },
    { pct: 20, color: '#00d4ff', label: 'Meme War' },
    { pct: 15, color: '#ff6b9d', label: 'Liquidity' },
    { pct: 10, color: '#ffd93d', label: 'AI Hunter' },
    { pct: 10, color: '#c084fc', label: 'Dev/Ops' },
    { pct: 10, color: '#64748b', label: 'Reserve' },
  ];

  const cx = size / 2, cy = size / 2, outerR = 140, innerR = 90;
  let progress = 0;
  const duration = 1200;
  let startTime = null;
  let drawn = false;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function drawDonut(p) {
    ctx.clearRect(0, 0, size, size);
    let startAngle = -Math.PI / 2;
    const total = data.reduce((s, d) => s + d.pct, 0);
    const gap = 0.03;

    data.forEach(d => {
      const slice = (d.pct / total) * Math.PI * 2 * p;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle + gap / 2, startAngle + slice - gap / 2);
      ctx.arc(cx, cy, innerR, startAngle + slice - gap / 2, startAngle + gap / 2, true);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      // Glow
      ctx.shadowColor = d.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      startAngle += slice;
    });
  }

  function animateChart(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    progress = Math.min(easeOut(elapsed / duration), 1);
    drawDonut(progress);
    if (progress < 1) requestAnimationFrame(animateChart);
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !drawn) {
      drawn = true;
      requestAnimationFrame(animateChart);
      observer.unobserve(canvas);
    }
  }, { threshold: 0.3 });
  observer.observe(canvas);
}

/* --- Token Dots Color --- */
function initTokenDots() {
  document.querySelectorAll('.token-row').forEach(row => {
    const color = row.getAttribute('data-color');
    const dot = row.querySelector('.token-dot');
    if (dot && color) {
      dot.style.backgroundColor = color;
      dot.style.boxShadow = `0 0 8px ${color}40`;
    }
  });
}

