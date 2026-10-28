/**
 * background.js - Refined Ambient Canvas
 * Subtle floating particles with gentle connecting lines & soft color shifts.
 * Inspired by Linear/Vercel — performance-conscious, non-intrusive.
 */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;

  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Smooth mouse tracking
  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    radius: 200
  };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.targetX = -1000;
    mouse.targetY = -1000;
  }, { passive: true });

  // --- GRID DOTS ---
  const gridSpacing = 52;

  // --- FLOATING PARTICLES ---
  const PARTICLE_COUNT = 35; // Subtle, not crowded
  const CONNECTION_DIST = 140;
  const particles = [];

  // Color palette for particles — muted, consistent with design
  const particleColors = [
    { r: 79, g: 141, b: 247 },   // brand blue
    { r: 124, g: 127, b: 245 },  // indigo
    { r: 167, g: 139, b: 250 },  // violet
    { r: 34, g: 211, b: 238 },   // cyan
    { r: 148, g: 163, b: 200 },  // slate
  ];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * (width || window.innerWidth);
      this.y = Math.random() * (height || window.innerHeight);
      this.size = Math.random() * 1.4 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.speedY = (Math.random() - 0.5) * 0.15;
      this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
      this.baseAlpha = Math.random() * 0.12 + 0.04;
      this.alpha = this.baseAlpha;
      this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update(time) {
      this.x += this.speedX;
      this.y += this.speedY;

      // Gentle pulse
      this.alpha = this.baseAlpha + Math.sin(time * 0.001 + this.pulseOffset) * 0.03;

      // Wrap around edges with padding
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;

      // Mouse proximity push — gentle repulsion
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (1 - dist / mouse.radius) * 0.4;
        this.x -= dx * force * 0.02;
        this.y -= dy * force * 0.02;
        // Brighten near cursor
        this.alpha = Math.min(this.alpha + force * 0.12, 0.3);
      }
    }

    draw() {
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // Main render loop
  let time = 0;
  function render(timestamp) {
    time = timestamp || 0;

    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    ctx.clearRect(0, 0, width, height);

    // --- Draw grid dots ---
    const cols = Math.ceil(width / gridSpacing) + 1;
    const rows = Math.ceil(height / gridSpacing) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * gridSpacing;
        const y = r * gridSpacing;

        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let alpha = 0.04;
        let radius = 0.8;

        if (dist < mouse.radius) {
          const proximity = 1 - dist / mouse.radius;
          alpha += proximity * 0.25;
          radius += proximity * 1;
        }

        // Subtle blue tint to grid dots near cursor
        if (dist < mouse.radius * 0.6) {
          const blueMix = 1 - dist / (mouse.radius * 0.6);
          const rr = Math.floor(148 + (79 - 148) * blueMix);
          const gg = Math.floor(163 + (141 - 163) * blueMix);
          const bb = Math.floor(200 + (247 - 200) * blueMix);
          ctx.fillStyle = `rgba(${rr}, ${gg}, ${bb}, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(148, 163, 200, ${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // --- Draw particles & connections ---
    // Update all particles first
    particles.forEach(p => p.update(time));

    // Draw connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const lineAlpha = (1 - dist / CONNECTION_DIST) * 0.06;
          ctx.strokeStyle = `rgba(79, 141, 247, ${lineAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw all particles
    particles.forEach(p => p.draw());

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  render();

  // Pause when tab hidden to save GPU/battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else if (!prefersReducedMotion) {
      render();
    }
  });
})();
