/**
 * rain.js
 * Cyberpunk Neon Rain & Water Splash Atmospheric System.
 * Page 1 Requirement: "glow, scanlines, rain, holographic signs, glitch transitions"
 */

class CyberpunkRainSystem {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'rain-weather-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.isEnabled = true;
    this.drops = [];
    this.splashes = [];
    this.maxDrops = 180;

    this.init();
  }

  init() {
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '400';
    document.body.appendChild(this.canvas);

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Populate initial rain drops
    for (let i = 0; i < this.maxDrops; i++) {
      this.drops.push(this.createDrop(true));
    }

    // Toggle button in HUD
    const rainToggleBtn = document.getElementById('btn-toggle-rain');
    if (rainToggleBtn) {
      rainToggleBtn.addEventListener('click', () => {
        this.toggle();
        rainToggleBtn.classList.toggle('active', this.isEnabled);
        rainToggleBtn.textContent = this.isEnabled ? '🌧️ RAIN: ON' : '🌧️ RAIN: OFF';
        if (window.audioMgr) window.audioMgr.playClickSound();
      });
    }

    // Animation Loop
    const loop = () => {
      if (this.isEnabled) {
        this.update();
        this.render();
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  toggle(state) {
    if (typeof state === 'boolean') {
      this.isEnabled = state;
    } else {
      this.isEnabled = !this.isEnabled;
    }
    return this.isEnabled;
  }

  createDrop(randomY = false) {
    return {
      x: Math.random() * (this.canvas.width + 300) - 150,
      y: randomY ? Math.random() * this.canvas.height : -20,
      len: Math.random() * 22 + 16,
      speed: Math.random() * 12 + 16,
      opacity: Math.random() * 0.4 + 0.25,
      slant: -4.5
    };
  }

  createSplash(x, y) {
    this.splashes.push({
      x,
      y,
      radius: 1,
      maxRadius: Math.random() * 8 + 4,
      opacity: 0.6
    });
  }

  update() {
    const h = this.canvas.height;
    const w = this.canvas.width;

    // Update drops
    for (let d of this.drops) {
      d.y += d.speed;
      d.x += d.slant;

      // When hitting bottom or river area
      if (d.y >= h - Math.random() * 120) {
        if (Math.random() < 0.35) {
          this.createSplash(d.x, d.y);
        }
        // Reset drop
        d.x = Math.random() * (w + 300) - 150;
        d.y = -25;
      }
    }

    // Update splashes
    for (let i = this.splashes.length - 1; i >= 0; i--) {
      const s = this.splashes[i];
      s.radius += 0.8;
      s.opacity -= 0.05;
      if (s.opacity <= 0) {
        this.splashes.splice(i, 1);
      }
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw rain streaks
    ctx.lineWidth = 1.4;
    for (let d of this.drops) {
      ctx.strokeStyle = `rgba(185, 235, 255, ${d.opacity})`;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.slant * 1.5, d.y + d.len);
      ctx.stroke();
    }

    // Draw ripples / splashes
    for (let s of this.splashes) {
      ctx.strokeStyle = `rgba(56, 249, 255, ${s.opacity})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, s.radius * 2, s.radius, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.rainSystem = new CyberpunkRainSystem();
});

