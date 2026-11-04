/**
 * explore.js
 * Side-scrolling Chongqing free exploration mode with walk, jump, glide,
 * interactive neon shops, NPC dialogs, and hidden items.
 */

class ChongqingExploreMode {
  constructor() {
    this.canvas = document.getElementById('explore-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.dialogBox = document.getElementById('explore-dialog-box');
    this.dialogText = document.getElementById('explore-dialog-text');
    this.shopModal = document.getElementById('explore-shop-modal');

    this.isActive = false;
    this.cameraX = 0;

    // Player
    this.player = {
      x: 80,
      y: 160,
      vx: 0,
      vy: 0,
      width: 28,
      height: 38,
      isGrounded: false,
      isGliding: false,
      facing: 'right'
    };

    // Keys state
    this.keys = { left: false, right: false, jump: false };

    // Shops on Chongqing street
    this.shops = [
      {
        id: 'hotpot',
        name: '重慶老火鍋 2077',
        x: 220,
        y: 140,
        width: 80,
        height: 60,
        color: '#ff3cac',
        npc: 'Chef Old Zhang: "Welcome to Chongqing! Try our cyber-spicy hotpot, guarantees 100% neural overclock!"',
        reward: 15
      },
      {
        id: 'arcade',
        name: '霓虹電玩 NO.08',
        x: 520,
        y: 130,
        width: 85,
        height: 70,
        color: '#38f9ff',
        npc: 'Retro Gamer: "Looking for high scores? The Rooftop Runner game is where true couriers test their reflexes!"',
        reward: 10
      },
      {
        id: 'deck',
        name: '賽博晶片 REPAIR',
        x: 840,
        y: 130,
        width: 90,
        height: 70,
        color: '#ffe14d',
        npc: 'Iki\'s Contact: "The police drones have been patrolling the upper bridges. Be careful jumping between rooftops!"',
        reward: 20
      }
    ];

    // Hidden items / coins
    this.pickups = [
      { x: 380, y: 110, collected: false, type: 'coin' },
      { x: 420, y: 90, collected: false, type: 'coin' },
      { x: 720, y: 80, collected: false, type: 'coin' },
      { x: 990, y: 140, collected: false, type: 'secret_chip' }
    ];

    // Character sprite
    this.charImg = new Image();
    this.updateSprite();
    window.addEventListener('crew-changed', () => this.updateSprite());

    this.init();
  }

  updateSprite() {
    const char = window.crewManager ? window.crewManager.getActiveCharacter() : null;
    this.charImg.src = char ? char.sprite : 'assets/sprites/crew-mei.svg';
  }

  init() {
    if (!this.canvas) return;
    this.canvas.width = 440;
    this.canvas.height = 240;

    // Controls listeners
    window.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.handleJump();
        this.keys.jump = true;
      }
      if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        this.checkInteract();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.keys.jump = false;
        this.player.isGliding = false;
      }
    });

    // Close dialog button
    const closeDialog = document.getElementById('btn-close-explore-dialog');
    if (closeDialog) {
      closeDialog.addEventListener('click', () => {
        if (this.dialogBox) this.dialogBox.style.display = 'none';
      });
    }

    const closeShop = document.getElementById('btn-close-explore-shop');
    if (closeShop) {
      closeShop.addEventListener('click', () => {
        if (this.shopModal) this.shopModal.style.display = 'none';
      });
    }

    // Loop
    const loop = () => {
      if (this.isActive) {
        this.update();
        this.render();
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  start() {
    this.isActive = true;
    if (this.canvas) {
      this.canvas.width = 440;
      this.canvas.height = 240;
    }
  }

  stop() {
    this.isActive = false;
  }

  handleJump() {
    if (this.player.isGrounded) {
      this.player.vy = -10.5;
      this.player.isGrounded = false;
      if (window.audioMgr) window.audioMgr.playJumpSound();
    } else if (this.player.vy > 0) {
      // Hold jump in air to glide!
      this.player.isGliding = true;
    }
  }

  handleDirection(dir) {
    if (dir === 'left') {
      this.player.vx = -4;
      this.player.facing = 'left';
    } else if (dir === 'right') {
      this.player.vx = 4;
      this.player.facing = 'right';
    } else if (dir === 'up') {
      this.handleJump();
    } else if (dir === 'down') {
      this.checkInteract();
    }
  }

  checkInteract() {
    // Check nearby shop
    for (let s of this.shops) {
      if (Math.abs((this.player.x + this.player.width / 2) - (s.x + s.width / 2)) < 50) {
        this.enterShop(s);
        return;
      }
    }
  }

  enterShop(shop) {
    if (window.audioMgr) window.audioMgr.playCoinSound();
    if (shop.reward && window.gameStorage) {
      window.gameStorage.addCoins(shop.reward);
      shop.reward = 0; // Claim once per visit
    }

    const titleEl = document.getElementById('shop-modal-title');
    const npcEl = document.getElementById('shop-modal-npc');

    if (titleEl) titleEl.textContent = shop.name;
    if (npcEl) npcEl.textContent = shop.npc;

    if (this.shopModal) {
      this.shopModal.style.display = 'flex';
    }
  }

  update() {
    // Horizontal movement
    if (this.keys.left) {
      this.player.vx = -4;
      this.player.facing = 'left';
    } else if (this.keys.right) {
      this.player.vx = 4;
      this.player.facing = 'right';
    } else {
      this.player.vx *= 0.7;
    }

    this.player.x += this.player.vx;
    this.player.x = Math.max(20, Math.min(1100, this.player.x));

    // Vertical movement & Gliding
    const gravity = this.player.isGliding ? 0.15 : 0.55;
    this.player.vy += gravity;
    if (this.player.isGliding && this.player.vy > 1.8) {
      this.player.vy = 1.8; // Terminal glide velocity
    }

    this.player.y += this.player.vy;

    // Ground level
    const groundY = 195 - this.player.height;
    if (this.player.y >= groundY) {
      this.player.y = groundY;
      this.player.vy = 0;
      this.player.isGrounded = true;
      this.player.isGliding = false;
    }

    // Smooth camera tracking
    const targetCamX = this.player.x - 180;
    this.cameraX += (targetCamX - this.cameraX) * 0.1;
    this.cameraX = Math.max(0, Math.min(700, this.cameraX));

    // Pickup collision
    for (let p of this.pickups) {
      if (!p.collected &&
          Math.abs((this.player.x + 14) - p.x) < 22 &&
          Math.abs((this.player.y + 18) - p.y) < 22) {
        p.collected = true;
        if (window.gameStorage) window.gameStorage.addCoins(p.type === 'secret_chip' ? 25 : 2);
        if (window.audioMgr) window.audioMgr.playCoinSound();

        if (p.type === 'secret_chip') {
          if (this.dialogBox) {
            this.dialogText.textContent = "✦ FOUND SECRET CHONGQING DATA CHIP! (+25 Coins) ✦";
            this.dialogBox.style.display = 'block';
          }
        }
      }
    }
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cam = this.cameraX;

    ctx.clearRect(0, 0, w, h);

    // Deep city night background
    ctx.fillStyle = '#080315';
    ctx.fillRect(0, 0, w, h);

    // Parallax background buildings
    ctx.fillStyle = '#110724';
    for (let i = 0; i < 12; i++) {
      const bx = i * 110 - (cam * 0.3) % 110;
      ctx.fillRect(bx, 60 + (i % 3) * 15, 80, 150);
      ctx.fillStyle = '#ff3cac';
      ctx.fillRect(bx + 10, 80, 3, 3);
      ctx.fillStyle = '#38f9ff';
      ctx.fillRect(bx + 30, 95, 3, 3);
      ctx.fillStyle = '#110724';
    }

    // Street Ground & Multi-tier Walkways
    ctx.fillStyle = '#170b30';
    ctx.fillRect(0 - cam, 195, 1200, 45);

    // Neon Ground Line
    ctx.strokeStyle = '#38f9ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0 - cam, 195);
    ctx.lineTo(1200 - cam, 195);
    ctx.stroke();

    // Render Shops
    for (let s of this.shops) {
      const sx = s.x - cam;
      // Shop Building
      ctx.fillStyle = '#130728';
      ctx.fillRect(sx, s.y, s.width, s.height);

      // Neon frame
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, s.y, s.width, s.height);

      // Shop Signboard
      ctx.fillStyle = s.color;
      ctx.fillRect(sx + 4, s.y + 4, s.width - 8, 16);
      ctx.fillStyle = '#05020a';
      ctx.font = '7px monospace';
      ctx.fillText(s.name, sx + 6, s.y + 15);

      // Shop Door / Enter prompt
      ctx.fillStyle = '#090317';
      ctx.fillRect(sx + s.width / 2 - 12, s.y + 24, 24, s.height - 24);

      // Prompt if player is near
      if (Math.abs((this.player.x + this.player.width / 2) - (s.x + s.width / 2)) < 50) {
        ctx.fillStyle = '#ffe14d';
        ctx.font = '8px monospace';
        ctx.fillText('ENTER [E]', sx + s.width / 2 - 20, s.y - 6);
      }
    }

    // Render Pickups
    for (let p of this.pickups) {
      if (p.collected) continue;
      const px = p.x - cam;
      if (p.type === 'secret_chip') {
        ctx.fillStyle = '#ff3cac';
        ctx.fillRect(px - 6, p.y - 6, 12, 12);
        ctx.fillStyle = '#38f9ff';
        ctx.fillRect(px - 3, p.y - 3, 6, 6);
      } else {
        ctx.fillStyle = '#ffe14d';
        ctx.beginPath();
        ctx.arc(px, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Render Player
    const px = this.player.x - cam;
    const py = this.player.y;

    // Glide trail if gliding
    if (this.player.isGliding) {
      ctx.strokeStyle = '#38f9ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px - 8, py);
      ctx.lineTo(px + 36, py);
      ctx.stroke();
    }

    if (this.charImg.complete && this.charImg.naturalWidth !== 0) {
      ctx.drawImage(this.charImg, px - 6, py - 4, 40, 44);
    } else {
      ctx.fillStyle = '#ff3cac';
      ctx.fillRect(px, py, this.player.width, this.player.height);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.exploreMode = new ChongqingExploreMode();
});

