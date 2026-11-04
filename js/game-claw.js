/**
 * game-claw.js
 * Authentic Neon Cyberpunk Claw Machine ("夹娃娃" Arcade Crane Game).
 * Exact feature from Scrapbook Page 4 Mini-Game Design Ideas!
 */

class NeonClawMachine {
  constructor() {
    this.overlay = document.getElementById('claw-modal-overlay');
    this.canvas = document.getElementById('claw-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.statusEl = document.getElementById('claw-status-msg');
    this.prizesWonEl = document.getElementById('claw-prizes-count');
    this.coinsEl = document.getElementById('claw-coins-count');

    this.isOpen = false;
    this.coins = 5;
    this.prizesWon = [];

    // Crane claw physics
    this.claw = {
      x: 180,
      y: 40,
      minX: 60,
      maxX: 460,
      minY: 40,
      maxY: 240,
      state: 'idle', // 'idle' | 'moving' | 'dropping' | 'grabbing' | 'lifting' | 'returning' | 'releasing'
      speed: 3.5,
      dropSpeed: 4.0,
      grabWidth: 36,
      currentGrabbed: null
    };

    // Prizes available on the prize floor
    this.prizes = [
      { id: 'neko', name: 'Cyber Neko Plush', icon: '🐱', color: '#ff3cac', x: 90, y: 250, size: 28 },
      { id: 'kuromi', name: 'Neon Kuromi Bunny', icon: '🐰', color: '#c8b6ff', x: 160, y: 250, size: 28 },
      { id: 'star', name: 'Pixel Gold Star', icon: '⭐', color: '#ffe14d', x: 230, y: 250, size: 28 },
      { id: 'droid', name: 'Mini Tachikoma Bot', icon: '🤖', color: '#38f9ff', x: 300, y: 250, size: 28 },
      { id: 'heart', name: 'Holo Crystal Heart', icon: '💖', color: '#ff71ce', x: 370, y: 250, size: 28 },
      { id: 'fox', name: 'Cyber Kitsune', icon: '🦊', color: '#ff8800', x: 440, y: 250, size: 28 }
    ];

    this.keys = { left: false, right: false };

    this.init();
  }

  init() {
    if (!this.canvas) return;
    this.canvas.width = 520;
    this.canvas.height = 320;

    // Close button
    const closeBtn = document.querySelector('.claw-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Hardware buttons in modal
    const btnLeft = document.getElementById('claw-btn-left');
    const btnRight = document.getElementById('claw-btn-right');
    const btnDrop = document.getElementById('claw-btn-drop');

    if (btnLeft) {
      btnLeft.addEventListener('mousedown', () => this.keys.left = true);
      btnLeft.addEventListener('mouseup', () => this.keys.left = false);
      btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); this.keys.left = true; });
      btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); this.keys.left = false; });
    }

    if (btnRight) {
      btnRight.addEventListener('mousedown', () => this.keys.right = true);
      btnRight.addEventListener('mouseup', () => this.keys.right = false);
      btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); this.keys.right = true; });
      btnRight.addEventListener('touchend', (e) => { e.preventDefault(); this.keys.right = false; });
    }

    if (btnDrop) {
      btnDrop.addEventListener('click', () => this.triggerDrop());
    }

    // Keyboard bindings
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.triggerDrop();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
    });

    // Animation Loop
    const loop = () => {
      if (this.isOpen) {
        this.update();
        this.render();
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  open() {
    if (this.overlay) {
      this.isOpen = true;
      this.overlay.classList.add('open');
      this.setStatus('✦ USE [◀ / ▶] TO AIM, [DROP] TO GRAB PRIZE! ✦');
      this.updateHUD();
      if (window.audioMgr) window.audioMgr.playClickSound();
    }
  }

  close() {
    if (this.overlay) {
      this.isOpen = false;
      this.overlay.classList.remove('open');
      if (window.audioMgr) window.audioMgr.playClickSound();
    }
  }

  triggerDrop() {
    if (this.claw.state === 'idle') {
      this.claw.state = 'dropping';
      this.setStatus('✦ CLAW DROPPING... GRIP TIGHT! ✦');
      if (window.audioMgr) window.audioMgr.playClickSound();
    }
  }

  setStatus(msg, color) {
    if (this.statusEl) {
      this.statusEl.textContent = msg;
      if (color) this.statusEl.style.color = color;
      else this.statusEl.style.color = 'var(--neon-yellow)';
    }
  }

  updateHUD() {
    if (this.prizesWonEl) this.prizesWonEl.textContent = this.prizesWon.length;
    if (this.coinsEl) this.coinsEl.textContent = this.coins;
  }

  update() {
    // Left/Right control when idle
    if (this.claw.state === 'idle') {
      if (this.keys.left) {
        this.claw.x = Math.max(this.claw.minX, this.claw.x - this.claw.speed);
      }
      if (this.keys.right) {
        this.claw.x = Math.min(this.claw.maxX, this.claw.x + this.claw.speed);
      }
    }

    // Dropping down
    if (this.claw.state === 'dropping') {
      this.claw.y += this.claw.dropSpeed;
      if (this.claw.y >= this.claw.maxY) {
        this.claw.y = this.claw.maxY;
        this.claw.state = 'grabbing';

        // Check if claw caught a prize
        let hit = null;
        for (let p of this.prizes) {
          if (Math.abs(this.claw.x - p.x) < 26) {
            hit = p;
            break;
          }
        }

        setTimeout(() => {
          if (hit) {
            this.claw.currentGrabbed = hit;
            this.setStatus(`✦ GRABBED ${hit.name.toUpperCase()}! LIFTING... ✦`, 'var(--neon-cyan)');
          } else {
            this.setStatus('✦ MISSED! LIFTING CLAW... ✦', 'var(--text-dim)');
          }
          this.claw.state = 'lifting';
        }, 350);
      }
    }

    // Lifting up
    if (this.claw.state === 'lifting') {
      this.claw.y -= this.claw.dropSpeed * 0.85;
      if (this.claw.currentGrabbed) {
        this.claw.currentGrabbed.x = this.claw.x;
        this.claw.currentGrabbed.y = this.claw.y + 24;
      }

      if (this.claw.y <= this.claw.minY) {
        this.claw.y = this.claw.minY;
        this.claw.state = 'returning';
      }
    }

    // Returning to chute on left (x = 60)
    if (this.claw.state === 'returning') {
      this.claw.x -= this.claw.speed * 0.9;
      if (this.claw.currentGrabbed) {
        this.claw.currentGrabbed.x = this.claw.x;
        this.claw.currentGrabbed.y = this.claw.y + 24;
      }

      if (this.claw.x <= this.claw.minX) {
        this.claw.x = this.claw.minX;
        this.claw.state = 'releasing';

        // Release over chute!
        setTimeout(() => {
          if (this.claw.currentGrabbed) {
            const won = this.claw.currentGrabbed;
            this.prizesWon.push(won);
            // Respawn prize on floor
            won.x = Math.floor(Math.random() * 320) + 120;
            won.y = 250;
            this.claw.currentGrabbed = null;

            this.setStatus(`🎉 CONGRATS! YOU WON: ${won.name.toUpperCase()}!`, 'var(--neon-green)');
            if (window.audioMgr) window.audioMgr.playCoinSound();
            if (window.gameStorage) window.gameStorage.addCoins(5);
          } else {
            this.setStatus('✦ NOTHING GRABBED THIS TIME. TRY AGAIN! ✦');
          }

          this.updateHUD();
          this.claw.state = 'idle';
        }, 500);
      }
    }
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Dark Arcade Background
    ctx.fillStyle = '#06020f';
    ctx.fillRect(0, 0, w, h);

    // Neon Grid Backdrop
    ctx.strokeStyle = 'rgba(123, 92, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Top Mechanical Crane Rail
    ctx.fillStyle = '#1c0f38';
    ctx.fillRect(20, 20, w - 40, 16);
    ctx.strokeStyle = '#38f9ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, w - 40, 16);

    // Left Prize Chute Box
    ctx.fillStyle = '#0d0520';
    ctx.fillRect(20, 160, 65, 120);
    ctx.strokeStyle = '#ff3cac';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 160, 65, 120);

    ctx.fillStyle = '#ff3cac';
    ctx.font = '9px "Press Start 2P"';
    ctx.fillText('WIN', 32, 225);

    // Bottom Prize Floor
    ctx.fillStyle = '#170932';
    ctx.fillRect(0, 260, w, 60);
    ctx.strokeStyle = '#ffe14d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 260);
    ctx.lineTo(w, 260);
    ctx.stroke();

    // Render Prizes on floor
    for (let p of this.prizes) {
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.icon, p.x, p.y + 4);

      // Glow halo
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y - 4, 18, 0, Math.PI * 2);
      ctx.globalAlpha = 0.25;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Crane Cable & Claw Mechanism
    const cx = this.claw.x;
    const cy = this.claw.y;

    // Carriage on rail
    ctx.fillStyle = '#38f9ff';
    ctx.fillRect(cx - 14, 20, 28, 16);

    // Cable line
    ctx.strokeStyle = '#a5b0cb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, 36);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    // Mechanical Claw Hub
    ctx.fillStyle = '#ff3cac';
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();

    // Claw Left & Right Prongs
    const spread = (this.claw.state === 'grabbing' || this.claw.currentGrabbed) ? 14 : 26;
    ctx.strokeStyle = '#ffe14d';
    ctx.lineWidth = 3.5;

    // Left Prong
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy + 4);
    ctx.lineTo(cx - spread, cy + 20);
    ctx.lineTo(cx - spread + 8, cy + 28);
    ctx.stroke();

    // Right Prong
    ctx.beginPath();
    ctx.moveTo(cx + 6, cy + 4);
    ctx.lineTo(cx + spread, cy + 20);
    ctx.lineTo(cx + spread - 8, cy + 28);
    ctx.stroke();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.clawMachine = new NeonClawMachine();
});

