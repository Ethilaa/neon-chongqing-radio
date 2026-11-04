/**
 * game-runner.js
 * "Jumping Crack: Rooftop Runner" (Scrapbook Page 3 & 5 Mini-Game).
 * Goal: jump from building to building across rooftop cracks!
 * Controls: Space / W / Up Arrow / Click to Jump & Double-Jump.
 * Win / Lose conditions: Distance milestones, high score, coin collection, fall in gap.
 */

class HighDefRooftopRunner {
  constructor() {
    this.overlay = document.getElementById('arcade-modal-overlay');
    this.lobbyView = document.querySelector('.arcade-lobby-view');
    this.playView = document.querySelector('.arcade-playing-view');
    this.canvas = document.getElementById('arcade-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.gameOverScreen = document.getElementById('arcade-game-over-screen');

    this.isRunning = false;
    this.score = 0;
    this.distance = 0;
    this.coins = 0;
    this.highScore = 0;
    this.speed = 3.2; // Smooth and accessible

    // Player with large visible anime face
    this.player = {
      x: 80,
      y: 190,
      width: 48,
      height: 62,
      vy: 0,
      jumpForce: -12.0,
      gravity: 0.54,
      isGrounded: false,
      jumpsLeft: 2
    };

    this.platforms = [];
    this.pickups = [];
    this.obstacles = [];

    this.charImg = new Image();
    this.updateSprite();
    window.addEventListener('crew-changed', () => {
      this.updateSprite();
      this.updateLobbyPreview();
    });

    this.init();
  }

  updateSprite() {
    const char = window.crewManager ? window.crewManager.getActiveCharacter() : null;
    this.charImg.src = char ? char.sprite : 'assets/sprites/crew-mei.svg';
  }

  updateLobbyPreview() {
    const previewImg = document.getElementById('arcade-preview-img');
    const nameEl = document.getElementById('arcade-preview-name');
    const roleEl = document.getElementById('arcade-preview-role');
    const quoteEl = document.getElementById('arcade-preview-quote');
    const char = window.crewManager ? window.crewManager.getActiveCharacter() : null;

    if (char) {
      if (previewImg) previewImg.src = char.sprite;
      if (nameEl) nameEl.textContent = char.name;
      if (roleEl) roleEl.textContent = char.role;
      if (quoteEl) quoteEl.textContent = char.quote;
    }
  }

  init() {
    if (!this.canvas) return;
    this.canvas.width = 640;
    this.canvas.height = 340;

    // Load High Score from storage
    if (window.gameStorage) {
      this.highScore = window.gameStorage.getHighScore ? window.gameStorage.getHighScore() : 0;
    }

    // Close button
    const closeBtn = document.querySelector('.arcade-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Play button in lobby
    const playBtn = document.getElementById('btn-arcade-start-play');
    if (playBtn) playBtn.addEventListener('click', () => this.startGame());

    // Game Over Retry & Exit
    const retryBtn = document.getElementById('btn-arcade-retry');
    if (retryBtn) retryBtn.addEventListener('click', () => this.startGame());

    const exitBtn = document.getElementById('btn-arcade-exit');
    if (exitBtn) exitBtn.addEventListener('click', () => this.showLobby());

    // Jump controls: Space / W / Up arrow
    window.addEventListener('keydown', (e) => {
      if (!this.isRunning) return;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.jump();
      }
    });

    // Touch / Click jump
    if (this.canvas) {
      this.canvas.addEventListener('mousedown', () => this.jump());
      this.canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.jump();
      });
    }

    // Animation Loop
    const loop = () => {
      if (this.isRunning) {
        this.update();
        this.render();
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  open() {
    if (this.overlay) {
      this.overlay.classList.add('open');
      this.showLobby();
      this.updateLobbyPreview();
      if (window.audioMgr) window.audioMgr.playClickSound();
    }
  }

  close() {
    if (this.overlay) {
      this.overlay.classList.remove('open');
      this.stop();
      if (window.audioMgr) window.audioMgr.playClickSound();
    }
  }

  showLobby() {
    this.stop();
    if (this.playView) this.playView.classList.remove('active');
    if (this.lobbyView) this.lobbyView.style.display = 'flex';
    if (this.gameOverScreen) this.gameOverScreen.classList.remove('show');
  }

  startGame() {
    this.score = 0;
    this.distance = 0;
    this.coins = 0;
    this.speed = 3.2;
    this.isRunning = true;

    this.player.x = 80;
    this.player.y = 160;
    this.player.vy = 0;
    this.player.jumpsLeft = 2;

    // Architectural Rooftop Platforms with building cracks/gaps to jump over!
    this.platforms = [
      { x: 0, y: 260, width: 340, height: 90 },
      { x: 420, y: 245, width: 280, height: 105 },
      { x: 770, y: 230, width: 300, height: 120 }
    ];

    this.pickups = [
      { x: 220, y: 200, collected: false },
      { x: 270, y: 190, collected: false },
      { x: 540, y: 180, collected: false },
      { x: 590, y: 180, collected: false }
    ];

    this.obstacles = [
      { x: 640, y: 215, width: 28, height: 30, type: 'drone' }
    ];

    if (this.lobbyView) this.lobbyView.style.display = 'none';
    if (this.playView) this.playView.classList.add('active');
    if (this.gameOverScreen) this.gameOverScreen.classList.remove('show');

    this.updateHUD();
    if (window.audioMgr) window.audioMgr.playClickSound();
  }

  stop() {
    this.isRunning = false;
  }

  jump() {
    if (this.player.jumpsLeft > 0) {
      this.player.vy = this.player.jumpsLeft === 2 ? this.player.jumpForce : this.player.jumpForce * 0.9;
      this.player.jumpsLeft--;
      this.player.isGrounded = false;
      if (window.audioMgr) window.audioMgr.playJumpSound();
    }
  }

  update() {
    this.score += 2;
    this.distance = Math.floor(this.score / 8);
    this.speed = 3.2 + Math.min(2.5, this.score * 0.0006);

    // Gravity
    this.player.vy += this.player.gravity;
    this.player.y += this.player.vy;
    this.player.isGrounded = false;

    // Platform collision
    for (let p of this.platforms) {
      if (
        this.player.x + this.player.width > p.x &&
        this.player.x < p.x + p.width &&
        this.player.y + this.player.height >= p.y &&
        this.player.y + this.player.height <= p.y + 18 &&
        this.player.vy >= 0
      ) {
        this.player.y = p.y - this.player.height;
        this.player.vy = 0;
        this.player.isGrounded = true;
        this.player.jumpsLeft = 2; // Restore double jump
        break;
      }
    }

    // Scroll platforms
    for (let p of this.platforms) p.x -= this.speed;

    const last = this.platforms[this.platforms.length - 1];
    if (last.x + last.width < this.canvas.width + 120) {
      // Crack/Gap between buildings to leap across (Page 3: Jumping Crack!)
      const gap = Math.random() * 75 + 60;
      const width = Math.random() * 160 + 210;
      const y = Math.max(180, Math.min(270, last.y + (Math.random() * 50 - 25)));
      const newX = last.x + last.width + gap;

      this.platforms.push({ x: newX, y, width, height: 110 });

      // Spawn coins
      if (Math.random() > 0.25) {
        this.pickups.push({ x: newX + 50, y: y - 45, collected: false });
        this.pickups.push({ x: newX + 95, y: y - 55, collected: false });
        this.pickups.push({ x: newX + 140, y: y - 45, collected: false });
      }

      // Spawn patrol drone
      if (Math.random() > 0.45) {
        this.obstacles.push({
          x: newX + width * 0.65,
          y: y - 30,
          width: 28,
          height: 30,
          type: 'drone'
        });
      }
    }

    this.platforms = this.platforms.filter(p => p.x + p.width > -50);

    // Coin collection
    for (let c of this.pickups) {
      c.x -= this.speed;
      if (!c.collected &&
          this.player.x + this.player.width > c.x &&
          this.player.x < c.x + 20 &&
          this.player.y + this.player.height > c.y &&
          this.player.y < c.y + 20) {
        c.collected = true;
        this.coins++;
        this.score += 50;
        if (window.gameStorage) window.gameStorage.addCoins(1);
        if (window.audioMgr) window.audioMgr.playCoinSound();
      }
    }
    this.pickups = this.pickups.filter(c => c.x > -30);

    // Obstacle collision
    for (let o of this.obstacles) {
      o.x -= this.speed;
      if (
        this.player.x + this.player.width - 8 > o.x &&
        this.player.x + 8 < o.x + o.width &&
        this.player.y + this.player.height - 6 > o.y &&
        this.player.y + 6 < o.y + o.height
      ) {
        this.gameOver();
        return;
      }
    }
    this.obstacles = this.obstacles.filter(o => o.x > -50);

    // Fall in crack between buildings (Lose condition)
    if (this.player.y > this.canvas.height) {
      this.gameOver();
      return;
    }

    this.updateHUD();
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background night gradient
    ctx.fillStyle = '#080315';
    ctx.fillRect(0, 0, w, h);

    // Distant cyber towers
    ctx.fillStyle = '#130728';
    for (let i = 0; i < 8; i++) {
      const bx = (i * 105 - (this.score * 0.35) % 105);
      ctx.fillRect(bx, 110 + (i % 3) * 20, 80, 230);
      ctx.fillStyle = '#38f9ff';
      ctx.fillRect(bx + 16, 130, 4, 4);
      ctx.fillStyle = '#ff3cac';
      ctx.fillRect(bx + 40, 150, 4, 4);
      ctx.fillStyle = '#130728';
    }

    // Platforms (Solid Rooftops with Neon Edges and Cracks)
    for (let p of this.platforms) {
      ctx.fillStyle = '#1a0b38';
      ctx.fillRect(p.x, p.y, p.width, p.height);

      ctx.strokeStyle = '#38f9ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.width, p.y);
      ctx.stroke();

      // Platform grid accent
      ctx.fillStyle = '#291252';
      ctx.fillRect(p.x + 12, p.y + 12, p.width - 24, 4);
    }

    // Collectible Neon Coins (Large & Sparkling)
    for (let c of this.pickups) {
      if (c.collected) continue;
      ctx.fillStyle = '#ffe14d';
      ctx.beginPath();
      ctx.arc(c.x + 10, c.y + 10, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(c.x + 8, c.y + 7, 3, 3);
    }

    // Obstacles (Patrol Drones)
    for (let o of this.obstacles) {
      ctx.fillStyle = '#ff3cac';
      ctx.fillRect(o.x, o.y + 6, o.width, o.height - 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(o.x + 10, o.y + 12, 8, 8);
      // Propeller line
      ctx.strokeStyle = '#38f9ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(o.x - 6, o.y + 4);
      ctx.lineTo(o.x + o.width + 6, o.y + 4);
      ctx.stroke();
    }

    // PLAYER: LARGE SPRITE (60x75px) WITH CLEARLY VISIBLE CUTE ANIME FACE!
    if (this.charImg.complete && this.charImg.naturalWidth !== 0) {
      ctx.drawImage(this.charImg, this.player.x - 6, this.player.y - 7, 60, 75);
    } else {
      ctx.fillStyle = '#ff3cac';
      ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    }
  }

  updateHUD() {
    const scoreEl = document.getElementById('arcade-hud-score');
    const coinEl = document.getElementById('arcade-hud-coins');
    const distEl = document.getElementById('arcade-hud-dist');
    if (scoreEl) scoreEl.textContent = this.score;
    if (coinEl) coinEl.textContent = this.coins;
    if (distEl) distEl.textContent = `${this.distance}m`;
  }

  gameOver() {
    this.isRunning = false;
    if (window.audioMgr) window.audioMgr.playGameOverSound();

    if (this.score > this.highScore) {
      this.highScore = this.score;
      if (window.gameStorage && window.gameStorage.saveHighScore) {
        window.gameStorage.saveHighScore(this.highScore);
      }
    }

    const finalScore = document.getElementById('arcade-go-score-val');
    const finalDist = document.getElementById('arcade-go-dist-val');
    if (finalScore) finalScore.textContent = this.score;
    if (finalDist) finalDist.textContent = `${this.distance}m`;

    if (this.gameOverScreen) this.gameOverScreen.classList.add('show');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.arcadeModal = new HighDefRooftopRunner();
});
