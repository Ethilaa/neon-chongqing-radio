/**
 * game-flyer.js
 * Sky Flyer Mini-Game.
 * Fly through the night Chongqing skyline dodging neon billboards and police drones.
 */

class SkyFlyerGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isRunning = false;
    this.score = 0;

    this.player = {
      x: 60,
      y: 100,
      width: 30,
      height: 32,
      vy: 0,
      thrust: -5.5
    };

    this.obstacles = [];
    this.coins = [];
    this.speed = 3.6;

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

    this.player.x = 60;
    this.player.y = 100;
    this.player.vy = 0;

    this.obstacles = [
      { x: 300, y: 0, width: 45, height: 80, type: 'tower' },
      { x: 300, y: 150, width: 45, height: 90, type: 'billboard' }
    ];

    this.coins = [
      { x: 300, y: 110, collected: false }
    ];

    this.hideGameOver();
  }

  jump() {
    if (!this.isRunning) return;
    this.player.vy = this.player.thrust;
    if (window.audioMgr) window.audioMgr.playJumpSound();
  }

  update() {
    if (!this.isRunning) return;

    this.score += 1;
    this.player.vy += 0.32; // gentle flight gravity
    this.player.y += this.player.vy;

    // Scroll obstacles
    for (let o of this.obstacles) {
      o.x -= this.speed;
      // Collision
      if (
        this.player.x + this.player.width - 4 > o.x &&
        this.player.x + 4 < o.x + o.width &&
        this.player.y + this.player.height - 4 > o.y &&
        this.player.y + 4 < o.y + o.height
      ) {
        this.gameOver();
        return;
      }
    }

    // Spawn new obstacles (top and bottom pillars with gap)
    const last = this.obstacles[this.obstacles.length - 1];
    if (last.x < this.canvas.width + 50) {
      const gapY = Math.random() * 90 + 50;
      const gapHeight = 85;
      const newX = last.x + 160;

      this.obstacles.push({ x: newX, y: 0, width: 45, height: gapY, type: 'tower' });
      this.obstacles.push({ x: newX, y: gapY + gapHeight, width: 45, height: this.canvas.height - (gapY + gapHeight), type: 'billboard' });

      this.coins.push({ x: newX + 20, y: gapY + gapHeight / 2 - 8, collected: false });
    }

    this.obstacles = this.obstacles.filter(o => o.x + o.width > -30);

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

    // Bounds check
    if (this.player.y < 0 || this.player.y + this.player.height > this.canvas.height) {
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
    ctx.fillStyle = '#060210';
    ctx.fillRect(0, 0, w, h);

    // Render obstacles
    for (let o of this.obstacles) {
      ctx.fillStyle = '#180a33';
      ctx.fillRect(o.x, o.y, o.width, o.height);

      ctx.strokeStyle = '#38f9ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(o.x, o.y, o.width, o.height);

      // Neon sign on obstacle
      ctx.fillStyle = '#ff3cac';
      ctx.fillRect(o.x + 8, o.y + o.height / 2 - 10, o.width - 16, 20);
    }

    // Coins
    for (let c of this.coins) {
      if (c.collected) continue;
      ctx.fillStyle = '#ffe14d';
      ctx.beginPath();
      ctx.arc(c.x + 8, c.y + 8, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Player with thruster glow
    ctx.fillStyle = '#38f9ff';
    ctx.fillRect(this.player.x - 6, this.player.y + 16, 6, 4);

    if (this.charImg.complete && this.charImg.naturalWidth !== 0) {
      ctx.drawImage(this.charImg, this.player.x - 4, this.player.y - 4, 38, 40);
    } else {
      ctx.fillStyle = '#38f9ff';
      ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    }
  }

  gameOver() {
    this.isRunning = false;
    if (window.audioMgr) window.audioMgr.playGameOverSound();
    if (window.gameStorage) window.gameStorage.saveHighScore('flyer', this.score);

    const overlay = document.getElementById('game-over-modal');
    const finalScore = document.getElementById('go-final-score');
    const bestScore = document.getElementById('go-best-score');
    if (finalScore) finalScore.textContent = this.score;
    if (bestScore) {
      const best = window.gameStorage ? window.gameStorage.state.highScores.flyer : this.score;
      bestScore.textContent = Math.max(best, this.score);
    }
    if (overlay) overlay.classList.add('show');
  }

  hideGameOver() {
    const overlay = document.getElementById('game-over-modal');
    if (overlay) overlay.classList.remove('show');
  }
}

// --------------------------------------------------------------------------
// Master Mini-Game Manager (Coordinates Runner, Jumper, Flyer)
// --------------------------------------------------------------------------
class MiniGameCoordinator {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.lobbyView = document.querySelector('.arcade-lobby-screen');
    this.activeView = document.querySelector('.game-active-viewport');

    this.games = {
      runner: new RooftopRunnerGame(this.canvas),
      jumper: new RooftopJumperGame(this.canvas),
      flyer: new SkyFlyerGame(this.canvas)
    };

    this.currentGame = null;
    this.isPlaying = false;

    this.init();
  }

  init() {
    // Select game cards in lobby
    const cards = document.querySelectorAll('.game-select-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const gameId = card.dataset.game;
        if (gameId) this.launchGame(gameId);
      });
    });

    // Game Over Retry & Exit
    const retryBtn = document.getElementById('btn-go-retry');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        if (this.currentGame) {
          this.currentGame.start();
        }
      });
    }

    const exitBtn = document.getElementById('btn-go-exit');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        this.exitToLobby();
      });
    }

    // In-game Exit Button
    const hudExit = document.getElementById('btn-game-hud-exit');
    if (hudExit) {
      hudExit.addEventListener('click', () => {
        this.exitToLobby();
      });
    }

    // Game loop
    const loop = () => {
      if (this.isPlaying && this.currentGame && this.currentGame.isRunning) {
        this.currentGame.update();
        this.currentGame.render();
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  launchGame(gameId) {
    if (!this.games[gameId]) return;
    this.currentGame = this.games[gameId];
    this.isPlaying = true;

    if (this.lobbyView) this.lobbyView.style.display = 'none';
    if (this.activeView) this.activeView.classList.add('active');

    if (window.audioMgr) window.audioMgr.playClickSound();
    this.currentGame.start();
  }

  exitToLobby() {
    if (this.currentGame) {
      this.currentGame.stop();
      this.currentGame.hideGameOver();
    }
    this.isPlaying = false;
    this.currentGame = null;

    if (this.activeView) this.activeView.classList.remove('active');
    if (this.lobbyView) this.lobbyView.style.display = 'flex';

    if (window.audioMgr) window.audioMgr.playClickSound();
  }

  handleActionA() {
    if (this.isPlaying && this.currentGame) {
      this.currentGame.jump();
    }
  }

  handleDirection(dir) {
    if (dir === 'up') {
      this.handleActionA();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.miniGameManager = new MiniGameCoordinator();
});

