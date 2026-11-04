/**
 * game-jumper.js
 * Rooftop Jumper Mini-Game.
 * Features leaping between buildings with double jump ability and neon bounce pads.
 */

class RooftopJumperGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isRunning = false;
    this.score = 0;
    this.jumpsLeft = 2; // Double jump!

    this.player = {
      x: 70,
      y: 140,
      width: 26,
      height: 36,
      vy: 0,
      isGrounded: false
    };

    this.platforms = [];
    this.coins = [];
    this.speed = 3.5;

    this.charImg = new Image();
    this.updateSprite();
    window.addEventListener('crew-changed', () => this.updateSprite());
  }

  updateSprite() {
    const char = window.crewManager ? window.crewManager.getActiveCharacter() : null;
    this.charImg.src = char ? char.sprite : 'assets/sprites/crew-mei.svg';
  }

  start() {
    this.canvas.width = 440;
    this.canvas.height = 240;
    this.score = 0;
    this.isRunning = true;
    this.speed = 3.8;

    this.player.x = 70;
    this.player.y = 120;
    this.player.vy = 0;
    this.jumpsLeft = 2;

    this.platforms = [
      { x: 20, y: 190, width: 140, height: 50, hasPad: false },
      { x: 200, y: 160, width: 100, height: 80, hasPad: true },
      { x: 340, y: 130, width: 110, height: 110, hasPad: false },
      { x: 490, y: 170, width: 120, height: 70, hasPad: false }
    ];

    this.coins = [
      { x: 240, y: 120, collected: false },
      { x: 380, y: 90, collected: false }
    ];

    this.hideGameOver();
  }

  jump() {
    if (!this.isRunning) return;
    if (this.jumpsLeft > 0) {
      this.player.vy = this.jumpsLeft === 2 ? -10.5 : -9;
      this.jumpsLeft--;
      this.player.isGrounded = false;
      if (window.audioMgr) window.audioMgr.playJumpSound();
    }
  }

  update() {
    if (!this.isRunning) return;

    this.score += 1;
    this.speed = 3.5 + Math.min(3, this.score * 0.0015);

    this.player.vy += 0.55; // gravity
    this.player.y += this.player.vy;
    this.player.isGrounded = false;

    // Platform collision
    for (let p of this.platforms) {
      if (
        this.player.x + this.player.width > p.x &&
        this.player.x < p.x + p.width &&
        this.player.y + this.player.height >= p.y &&
        this.player.y + this.player.height <= p.y + 14 &&
        this.player.vy >= 0
      ) {
        this.player.y = p.y - this.player.height;
        this.player.vy = 0;
        this.player.isGrounded = true;
        this.jumpsLeft = 2; // Reset double jump on land

        // Bounce pad triggers super leap!
        if (p.hasPad) {
          this.player.vy = -14;
          this.player.isGrounded = false;
          if (window.audioMgr) window.audioMgr.playCoinSound();
        }
        break;
      }
    }

    // Scroll platforms
    for (let p of this.platforms) {
      p.x -= this.speed;
    }

    const last = this.platforms[this.platforms.length - 1];
    if (last.x + last.width < this.canvas.width + 120) {
      const gap = Math.random() * 80 + 50;
      const width = Math.random() * 90 + 90;
      const y = Math.max(110, Math.min(200, 150 + (Math.random() * 80 - 40)));
      const hasPad = Math.random() > 0.65;
      const newX = last.x + last.width + gap;

      this.platforms.push({ x: newX, y, width, height: 80, hasPad });

      if (Math.random() > 0.4) {
        this.coins.push({ x: newX + width / 2, y: y - 30, collected: false });
      }
    }

    this.platforms = this.platforms.filter(p => p.x + p.width > -50);

    // Coins
    for (let c of this.coins) {
      c.x -= this.speed;
      if (!c.collected &&
          this.player.x + this.player.width > c.x &&
          this.player.x < c.x + 16 &&
          this.player.y + this.player.height > c.y &&
          this.player.y < c.y + 16) {
        c.collected = true;
        if (window.gameStorage) window.gameStorage.addCoins(1);
        if (window.audioMgr) window.audioMgr.playCoinSound();
      }
    }
    this.coins = this.coins.filter(c => c.x > -20);

    // Fall in gap
    if (this.player.y > this.canvas.height) {
      this.gameOver();
      return;
    }

    const scoreEl = document.getElementById('game-hud-score');
    if (scoreEl) scoreEl.textContent = this.score;
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#080315';
    ctx.fillRect(0, 0, w, h);

    // Platforms
    for (let p of this.platforms) {
      ctx.fillStyle = '#170b30';
      ctx.fillRect(p.x, p.y, p.width, p.height);

      ctx.strokeStyle = '#ffe14d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.width, p.y);
      ctx.stroke();

      if (p.hasPad) {
        ctx.fillStyle = '#ff3cac';
        ctx.fillRect(p.x + p.width / 2 - 12, p.y - 4, 24, 4);
      }
    }

    // Coins
    for (let c of this.coins) {
      if (c.collected) continue;
      ctx.fillStyle = '#38f9ff';
      ctx.beginPath();
      ctx.arc(c.x + 8, c.y + 8, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Player
    if (this.charImg.complete && this.charImg.naturalWidth !== 0) {
      ctx.drawImage(this.charImg, this.player.x - 6, this.player.y - 4, 38, 42);
    } else {
      ctx.fillStyle = '#ffe14d';
      ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    }
  }

  gameOver() {
    this.isRunning = false;
    if (window.audioMgr) window.audioMgr.playGameOverSound();
    if (window.gameStorage) window.gameStorage.saveHighScore('jumper', this.score);

    const overlay = document.getElementById('game-over-modal');
    const finalScore = document.getElementById('go-final-score');
    const bestScore = document.getElementById('go-best-score');
    if (finalScore) finalScore.textContent = this.score;
    if (bestScore) {
      const best = window.gameStorage ? window.gameStorage.state.highScores.jumper : this.score;
      bestScore.textContent = Math.max(best, this.score);
    }
    if (overlay) overlay.classList.add('show');
  }

  hideGameOver() {
    const overlay = document.getElementById('game-over-modal');
    if (overlay) overlay.classList.remove('show');
  }
}

