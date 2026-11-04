/**
 * cursor.js
 * Cute Cyberpunk Glitter Cursor.
 * Renders a glowing pixel star/heart wand with twinkling pastel cyber glitter.
 */

class CuteGlitterCursor {
  constructor() {
    this.container = document.getElementById('cute-cursor-container');
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.curX = this.mouseX;
    this.curY = this.mouseY;
    this.lastSpawnTime = 0;
    this.isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    this.glitterSymbols = ['✦', '✧', '★', '★', '✦', '·', '✧'];
    this.glitterColors = ['#ff3cac', '#38f9ff', '#ffe14d', '#ffffff', '#ff71ce', '#c8b6ff'];

    if (!this.isTouch) {
      this.init();
    }
  }

  init() {
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.spawnGlitter(e.clientX, e.clientY);
    });

    window.addEventListener('mousedown', (e) => {
      this.spawnClickSparkleBurst(e.clientX, e.clientY);
    });

    // Update active color on crew change
    window.addEventListener('crew-changed', (e) => {
      const crewId = e.detail && e.detail.crewId;
      if (window.crewManager) {
        const char = window.crewManager.getActiveCharacter();
        if (char && char.color) {
          document.documentElement.style.setProperty('--char-trail-color', char.color);
        }
      }
    });

    // Render cursor position
    const loop = () => {
      this.curX += (this.mouseX - this.curX) * 0.45;
      this.curY += (this.mouseY - this.curY) * 0.45;

      if (this.container) {
        this.container.style.transform = `translate3d(${this.curX}px, ${this.curY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  spawnGlitter(x, y) {
    const now = performance.now();
    if (now - this.lastSpawnTime < 38) return; // Smooth frequency
    this.lastSpawnTime = now;

    const el = document.createElement('div');
    el.className = 'glitter-particle';

    // Pick random cute symbol & cyber color
    const symbol = this.glitterSymbols[Math.floor(Math.random() * this.glitterSymbols.length)];
    const color = this.glitterColors[Math.floor(Math.random() * this.glitterColors.length)];

    el.textContent = symbol;
    el.style.color = color;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    // Drift physics
    const driftX = (Math.random() * 28 - 14) + 'px';
    const driftY = (Math.random() * 22 + 6) + 'px';
    el.style.setProperty('--drift-x', driftX);
    el.style.setProperty('--drift-y', driftY);

    // Random size
    const size = Math.floor(Math.random() * 6) + 9;
    el.style.fontSize = `${size}px`;

    document.body.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 650);
  }

  spawnClickSparkleBurst(x, y) {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'glitter-particle';
      const symbol = this.glitterSymbols[i % this.glitterSymbols.length];
      const color = this.glitterColors[i % this.glitterColors.length];

      el.textContent = symbol;
      el.style.color = color;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      const angle = (Math.PI * 2 / count) * i;
      const dist = Math.random() * 35 + 20;
      el.style.setProperty('--drift-x', `${Math.cos(angle) * dist}px`);
      el.style.setProperty('--drift-y', `${Math.sin(angle) * dist}px`);

      document.body.appendChild(el);
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 650);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cuteGlitterCursor = new CuteGlitterCursor();
});
