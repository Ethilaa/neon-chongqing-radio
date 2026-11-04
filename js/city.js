/**
 * city.js
 * Cyberpunk Chongqing World with 3D Rotatable Perspective.
 * Multi-District System (Downtown Arcade & Jialing Riverwalk),
 * Giant Neon Billboards (Geisha, Kuromi, Future Idol),
 * Flying Hovercars, Monorail, Cruise Ship,
 * and River Pier Bench with Rosa Walton "I Really Want to Stay at Your House" auto-play!
 */

const GROUND_Y = 520;
const WORLD_WIDTH = 3400;

class InteractiveChongqingWorld {
  constructor() {
    this.stage = document.getElementById('world-3d-stage');
    this.canvas = document.getElementById('world-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.reflectionCanvas = document.getElementById('river-reflection-canvas');
    this.refCtx = this.reflectionCanvas ? this.reflectionCanvas.getContext('2d') : null;

    this.promptEl = document.getElementById('world-interact-prompt');
    this.sittingBanner = document.getElementById('sitting-view-banner');
    this.sittingText = document.getElementById('sitting-banner-text');

    // Camera & 3D Rotation
    this.cameraX = 0;
    this.cameraY = 0;
    this.camRotX = 0; // Degrees
    this.camRotY = 0; // Degrees
    this.currentViewMode = 'river'; // 'river' | 'drone' | 'street'

    // Current District State ('d1' | 'd2')
    this.currentDistrict = 'd1';

    // Player State (8-Directional movement + Sprint + Jump + Glide)
    this.player = {
      x: 380,
      y: GROUND_Y - 62, // Exactly standing on the ground promenade
      vx: 0,
      vy: 0,
      width: 46,
      height: 62,
      baseSpeed: 5.4,
      sprintMultiplier: 1.75,
      jumpForce: -12.5,
      gravity: 0.58,
      isGrounded: true,
      jumpsLeft: 2,
      facing: 'right',
      isSitting: false,
      currentSeat: null,
      isSprinting: false,
      isGliding: false
    };

    this.keys = { left: false, right: false, up: false, down: false, sprint: false };

    // Multi-tier Platforms & Rooftops
    this.platforms = [
      // Ground Waterfront Promenade (Extends across both districts)
      { x: 0, y: GROUND_Y, width: WORLD_WIDTH, height: 260, type: 'ground' },

      // District 1: Hongyadong Tier 1 Balcony & Arcade Mezzanine
      { x: 240, y: 395, width: 480, height: 25, type: 'balcony' },

      // District 1: Hongyadong Tier 2 Rooftop Pagoda Deck
      { x: 340, y: 245, width: 360, height: 25, type: 'rooftop' },

      // District 1 -> District 2: Elevated Cyber Skybridge
      { x: 820, y: 340, width: 460, height: 25, type: 'skybridge' },

      // District 2: High-Rise Skyline Terrace
      { x: 1380, y: 210, width: 440, height: 30, type: 'terrace' },

      // District 2: High vantage crane platform
      { x: 1920, y: 160, width: 320, height: 25, type: 'crane' }
    ];

    // Interactive Spots (Seating Viewpoints + Arcade Terminals)
    this.interactiveSpots = [
      // District 1: Claw Machine Terminal
      {
        id: 'arcade_claw',
        type: 'game',
        name: 'NEON CLAW MACHINE',
        x: 440,
        y: GROUND_Y,
        prompt: '✦ [E] PLAY NEON CLAW MACHINE ("夹娃娃") ✦',
        action: () => { if (window.clawMachine) window.clawMachine.open(); }
      },
      // District 1: Jumping Crack Arcade Cabinet
      {
        id: 'arcade_jumper',
        type: 'game',
        name: 'JUMPING CRACK CABINET',
        x: 880,
        y: 340,
        prompt: '✦ [E] PLAY JUMPING CRACK (ROOFTOP RUNNER) ✦',
        action: () => { if (window.arcadeModal) window.arcadeModal.open(); }
      },
      // District 2: The Iconic River Pier Bench (Rosa Walton track!)
      {
        id: 'river_bench',
        type: 'seat',
        name: 'RIVER PIER BENCH',
        x: 2150,
        y: GROUND_Y,
        sitX: 2185,
        sitY: GROUND_Y - 58,
        prompt: '✦ [E] SIT BY RIVER TO WATCH WATER REFLECTIONS ✦',
        desc: '✦ SITTING BY JIALING RIVER // WATCHING NEON CRUISE SHIPS ✦'
      },
      // District 2: High Rooftop Ledge Viewpoint
      {
        id: 'rooftop_ledge',
        type: 'seat',
        name: 'MEGA SKYLINE ROOFTOP',
        x: 1540,
        y: 210,
        sitX: 1570,
        sitY: 152,
        prompt: '✦ [E] SIT ON ROOFTOP LEDGE (MEGA CITY VIEW) ✦',
        desc: '✦ SITTING OVER CHONGQING SKYLINE // PANORAMIC VIEW ✦'
      },
      // District 1: Cyber Balcony Cafe
      {
        id: 'balcony_cafe',
        type: 'seat',
        name: 'HONGYADONG CAFE TABLE',
        x: 580,
        y: 395,
        sitX: 600,
        sitY: 337,
        prompt: '✦ [E] SIT AT CYBER TEA BALCONY ✦',
        desc: '✦ SITTING AT LANTERN BALCONY // WATCHING THE STREETS ✦'
      }
    ];

    // Beautiful Glowing River Cruise Ship
    this.cruiseShip = {
      x: 100,
      y: GROUND_Y + 35,
      width: 220,
      height: 52,
      speed: 1.15
    };

    // Flying Monorail / Sky Train
    this.monorail = {
      x: 0,
      y: 165,
      width: 240,
      height: 28,
      speed: 3.6
    };

    // Sky Traffic: Flying Hovercars
    this.hovercars = [
      { x: 300, y: 125, speed: 4.6, scale: 0.72 },
      { x: 1350, y: 140, speed: 5.2, scale: 0.65 },
      { x: 2300, y: 115, speed: 4.8, scale: 0.70 }
    ];

    // Patrol Surveillance Drones
    this.drones = [
      { x: 740, y: 220, angle: 0, range: 45 },
      { x: 1980, y: 180, angle: Math.PI, range: 55 }
    ];

    // Floating 3D Hologram Koi Fish in sky
    this.koiHolo = {
      x: 1050,
      y: 105,
      phase: 0
    };

    // Load Images
    this.skylineImg = new Image();
    this.buildingsImg = new Image();
    this.riverBenchImg = new Image();
    this.charImg = new Image();
    this.billboardGeishaImg = new Image();
    this.billboardKuromiImg = new Image();
    this.billboardIdolImg = new Image();
    this.hovercarImg = new Image();
    this.droneImg = new Image();

    this.skylineImg.src = 'assets/images/skyline-chongqing.svg';
    this.buildingsImg.src = 'assets/images/chongqing-buildings.svg';
    this.riverBenchImg.src = 'assets/images/river-bench.svg';
    this.billboardGeishaImg.src = 'assets/images/billboard-geisha.svg';
    this.billboardKuromiImg.src = 'assets/images/billboard-kuromi.svg';
    this.billboardIdolImg.src = 'assets/images/billboard-idol.svg';
    this.hovercarImg.src = 'assets/images/hovercar.svg';
    this.droneImg.src = 'assets/images/drone.svg';

    this.updateSprite();
    window.addEventListener('crew-changed', () => this.updateSprite());

    this.init();
  }

  updateSprite() {
    const char = window.crewManager ? window.crewManager.getActiveCharacter() : null;
    this.charImg.src = char ? char.sprite : 'assets/sprites/crew-mei.svg';
  }

  init() {
    this.resizeCanvases();
    window.addEventListener('resize', () => this.resizeCanvases());

    this.setupControls();
    this.setupCameraViewButtons();
    this.setupDistrictSelectorButtons();

    // Main animation loop
    const loop = () => {
      this.update();
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  resizeCanvases() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (this.canvas) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    if (this.reflectionCanvas) {
      this.reflectionCanvas.width = w;
      this.reflectionCanvas.height = h;
    }
  }

  setupControls() {
    window.addEventListener('keydown', (e) => {
      // Sprint with Shift
      if (e.key === 'Shift') this.keys.sprint = true;

      // 8-Directional Navigation
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.keys.left = true;
        if (this.player.isSitting) this.standUp();
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.keys.right = true;
        if (this.player.isSitting) this.standUp();
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.keys.down = true;
        if (this.player.isSitting) this.standUp();
      }
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.jump();
        if (this.player.isSitting) this.standUp();
      }

      // Interact [E]
      if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        this.handleInteract();
      }

      // Camera Angle Rotation with [Q] and [R]
      if (e.key === 'q' || e.key === 'Q') {
        this.camRotY = Math.max(-16, this.camRotY - 4);
        this.applyCustomCameraTransform();
      }
      if (e.key === 'r' || e.key === 'R') {
        this.camRotY = Math.min(16, this.camRotY + 4);
        this.applyCustomCameraTransform();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Shift') this.keys.sprint = false;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.keys.down = false;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.player.isGliding = false;
      }
    });

    const standBtn = document.getElementById('btn-stand-up');
    if (standBtn) {
      standBtn.addEventListener('click', () => this.standUp());
    }

    if (this.promptEl) {
      this.promptEl.style.cursor = 'pointer';
      this.promptEl.addEventListener('click', () => this.handleInteract());
    }
  }

  setupCameraViewButtons() {
    const btnRiver = document.getElementById('cam-view-river');
    const btnDrone = document.getElementById('cam-view-drone');
    const btnStreet = document.getElementById('cam-view-street');
    const rotLeft = document.getElementById('cam-rot-left');
    const rotRight = document.getElementById('cam-rot-right');

    const setMode = (mode) => {
      this.currentViewMode = mode;
      [btnRiver, btnDrone, btnStreet].forEach(b => b && b.classList.remove('active'));

      if (this.stage) {
        this.stage.className = `view-${mode}`;
      }

      if (mode === 'river' && btnRiver) btnRiver.classList.add('active');
      if (mode === 'drone' && btnDrone) btnDrone.classList.add('active');
      if (mode === 'street' && btnStreet) btnStreet.classList.add('active');

      if (window.audioMgr) window.audioMgr.playClickSound();
    };

    if (btnRiver) btnRiver.addEventListener('click', () => setMode('river'));
    if (btnDrone) btnDrone.addEventListener('click', () => setMode('drone'));
    if (btnStreet) btnStreet.addEventListener('click', () => setMode('street'));

    if (rotLeft) {
      rotLeft.addEventListener('click', () => {
        this.camRotY = Math.max(-16, this.camRotY - 5);
        this.applyCustomCameraTransform();
        if (window.audioMgr) window.audioMgr.playClickSound();
      });
    }

    if (rotRight) {
      rotRight.addEventListener('click', () => {
        this.camRotY = Math.min(16, this.camRotY + 5);
        this.applyCustomCameraTransform();
        if (window.audioMgr) window.audioMgr.playClickSound();
      });
    }
  }

  setupDistrictSelectorButtons() {
    const distPill = document.getElementById('hud-district-pill');
    if (distPill) {
      distPill.addEventListener('click', () => {
        const nextDist = this.currentDistrict === 'd1' ? 2 : 1;
        this.teleportToDistrict(nextDist);
      });
    }
  }

  teleportToDistrict(distNum) {
    if (distNum === 1) {
      this.player.x = 420;
      this.player.y = GROUND_Y - this.player.height;
      this.currentDistrict = 'd1';
    } else {
      this.player.x = 2100;
      this.player.y = GROUND_Y - this.player.height;
      this.currentDistrict = 'd2';
    }

    this.player.vx = 0;
    this.player.vy = 0;
    if (this.player.isSitting) this.standUp();

    this.updateDistrictHUD();

    if (window.cyberMenu) {
      const name = distNum === 1 ? 'DISTRICT 1: NEON DOWNTOWN & ARCADE' : 'DISTRICT 2: JIALING RIVERWALK';
      window.cyberMenu.showToast(`✦ FAST TRAVEL: ${name} ✦`);
    }

    if (window.audioMgr) window.audioMgr.playClickSound();
  }

  applyCustomCameraTransform() {
    if (this.stage) {
      this.stage.style.transform = `rotateX(${this.camRotX}deg) rotateY(${this.camRotY}deg)`;
    }
  }

  jump() {
    if (this.player.jumpsLeft > 0) {
      const force = this.keys.sprint ? this.player.jumpForce * 1.15 : this.player.jumpForce;
      this.player.vy = this.player.jumpsLeft === 2 ? force : force * 0.88;
      this.player.jumpsLeft--;
      this.player.isGrounded = false;
      if (window.audioMgr) window.audioMgr.playJumpSound();
    } else if (this.player.vy > 0) {
      // Hold jump in air to glide!
      this.player.isGliding = true;
    }
  }

  sitDownAt(spot) {
    this.player.isSitting = true;
    this.player.currentSeat = spot;
    this.player.x = spot.sitX;
    this.player.y = spot.sitY;
    this.player.vx = 0;
    this.player.vy = 0;

    if (this.promptEl) this.promptEl.style.display = 'none';
    if (this.sittingBanner) {
      if (this.sittingText) {
        if (spot.id === 'river_bench') {
          this.sittingText.innerHTML = `✦ SITTING BY JIALING RIVER // WATCHING NEON CRUISE SHIPS ✦<br><span style="color:var(--neon-pink); font-size:11px;">♫ NOW PLAYING: "I Really Want to Stay at Your House" - Rosa Walton</span>`;
        } else {
          this.sittingText.textContent = spot.desc;
        }
      }
      this.sittingBanner.style.display = 'flex';
    }

    // Auto-trigger song from cyberpunk ("I Really Want to Stay at Your House by Rosa Walton")!
    if (spot.id === 'river_bench' && window.consolePlayer) {
      if (typeof window.consolePlayer.playEdgerunnersBenchSong === 'function') {
        window.consolePlayer.playEdgerunnersBenchSong();
      } else {
        window.consolePlayer.playSongByName("I Really Want to Stay at Your House");
      }
    }

    if (window.audioMgr) window.audioMgr.playClickSound();
  }

  standUp() {
    this.player.isSitting = false;
    this.player.currentSeat = null;
    this.player.y = GROUND_Y - this.player.height;
    if (this.sittingBanner) this.sittingBanner.style.display = 'none';
    if (window.audioMgr) window.audioMgr.playClickSound();
  }

  handleInteract() {
    for (let s of this.interactiveSpots) {
      const checkX = s.sitX || s.x;
      const checkY = s.sitY || s.y;
      const dist = Math.abs((this.player.x + this.player.width / 2) - checkX);
      const distY = Math.abs((this.player.y + this.player.height / 2) - checkY);

      if (dist < 130 && distY < 85) {
        if (s.type === 'seat' && !this.player.isSitting) {
          this.sitDownAt(s);
          return;
        } else if (s.type === 'game' && s.action) {
          s.action();
          return;
        }
      }
    }
  }

  update() {
    // Monorail and Cruise ship travel
    this.cruiseShip.x += this.cruiseShip.speed;
    if (this.cruiseShip.x > WORLD_WIDTH + 100) this.cruiseShip.x = -260;

    this.monorail.x += this.monorail.speed;
    if (this.monorail.x > WORLD_WIDTH + 100) this.monorail.x = -300;

    // Sky traffic hovercars
    for (let c of this.hovercars) {
      c.x += c.speed;
      if (c.x > WORLD_WIDTH + 100) c.x = -200;
    }

    // Drones hovering
    for (let d of this.drones) {
      d.angle += 0.035;
    }

    this.koiHolo.phase += 0.03;

    if (!this.player.isSitting) {
      // Speed (Regular or Cyber Sprint)
      const curSpeed = this.keys.sprint 
        ? this.player.baseSpeed * this.player.sprintMultiplier 
        : this.player.baseSpeed;

      // Horizontal running
      if (this.keys.left) {
        this.player.vx = -curSpeed;
        this.player.facing = 'left';
      } else if (this.keys.right) {
        this.player.vx = curSpeed;
        this.player.facing = 'right';
      } else {
        this.player.vx *= 0.68;
      }

      this.player.x += this.player.vx;
      this.player.x = Math.max(20, Math.min(WORLD_WIDTH - 60, this.player.x));

      // Vertical Gravity & Gliding
      const grav = this.player.isGliding ? 0.18 : this.player.gravity;
      this.player.vy += grav;
      if (this.player.isGliding && this.player.vy > 2.2) {
        this.player.vy = 2.2;
      }

      const prevY = this.player.y;
      this.player.y += this.player.vy;
      this.player.isGrounded = false;

      // 1. STRICT GROUND CLAMP: Player can NEVER fall through ground into abyss!
      if (this.player.y + this.player.height >= GROUND_Y) {
        this.player.y = GROUND_Y - this.player.height;
        this.player.vy = 0;
        this.player.isGrounded = true;
        this.player.isGliding = false;
        this.player.jumpsLeft = 2;
      } else {
        // 2. Elevated Platform collision (Balconies, Skybridge, Rooftops)
        for (let p of this.platforms) {
          if (p.type === 'ground') continue;
          const playerBottom = this.player.y + this.player.height;
          const prevBottom = prevY + this.player.height;

          if (
            this.player.x + this.player.width > p.x &&
            this.player.x < p.x + p.width &&
            this.player.vy >= 0 &&
            prevBottom <= p.y + 8 &&
            playerBottom >= p.y
          ) {
            this.player.y = p.y - this.player.height;
            this.player.vy = 0;
            this.player.isGrounded = true;
            this.player.isGliding = false;
            this.player.jumpsLeft = 2;
            break;
          }
        }
      }
    }

    // Camera follow player smoothly - FIRMLY BOUNDED AND STABLE!
    this.updateCamera();

    // Check seating and interactive spot prompts
    this.updatePrompt();

    // Check district transition
    this.checkDistrictTransition();
  }

  updateCamera() {
    const w = this.canvas ? this.canvas.width : window.innerWidth;
    const h = this.canvas ? this.canvas.height : window.innerHeight;

    // Horizontal tracking
    const targetCamX = this.player.x - w / 2 + (this.player.facing === 'right' ? 80 : -80);
    this.cameraX += (targetCamX - this.cameraX) * 0.08;
    this.cameraX = Math.max(0, Math.min(WORLD_WIDTH - w, this.cameraX));

    // Vertical tracking: Ground is at y = GROUND_Y (520).
    // We anchor ground so it sits at approximately 70% of screen height.
    const desiredGroundScreenY = Math.max(380, h * 0.70);
    const baseCamY = GROUND_Y - desiredGroundScreenY;

    // When player climbs onto high rooftops (y < 350), gently look up slightly (at most 100px)
    let lookUp = 0;
    if (this.player.y < 350) {
      lookUp = (350 - this.player.y) * 0.35;
    }

    const targetCamY = baseCamY - lookUp;

    // Firmly bounded camera Y - NEVER shoots up or runs away!
    this.cameraY += (targetCamY - this.cameraY) * 0.08;
  }

  checkDistrictTransition() {
    const newDist = this.player.x < 1500 ? 'd1' : 'd2';
    if (newDist !== this.currentDistrict) {
      this.currentDistrict = newDist;
      this.updateDistrictHUD();
      window.dispatchEvent(new CustomEvent('district-changed', { detail: { district: newDist } }));
    }
  }

  updateDistrictHUD() {
    const pill = document.getElementById('hud-district-pill');
    if (pill) {
      if (this.currentDistrict === 'd1') {
        pill.innerHTML = `<span>🌆 DISTRICT 1: DOWNTOWN & ARCADE</span>`;
        pill.className = 'district-pill dist-1';
      } else {
        pill.innerHTML = `<span>🌊 DISTRICT 2: JIALING RIVERWALK</span>`;
        pill.className = 'district-pill dist-2';
      }
    }
  }

  updatePrompt() {
    if (!this.promptEl) return;
    if (this.player.isSitting) {
      this.promptEl.style.display = 'none';
      return;
    }

    let activeSpot = null;
    for (let s of this.interactiveSpots) {
      const checkX = s.sitX || s.x;
      const checkY = s.sitY || s.y;
      const dist = Math.abs((this.player.x + this.player.width / 2) - checkX);
      const distY = Math.abs((this.player.y + this.player.height / 2) - checkY);
      if (dist < 130 && distY < 85) {
        activeSpot = s;
        break;
      }
    }

    if (activeSpot) {
      const screenX = this.player.x - this.cameraX + this.player.width / 2;
      const screenY = this.player.y - this.cameraY - 14;
      this.promptEl.textContent = activeSpot.prompt;
      this.promptEl.style.display = 'block';
      this.promptEl.style.left = `${screenX}px`;
      this.promptEl.style.top = `${screenY}px`;
    } else {
      this.promptEl.style.display = 'none';
    }
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const camX = this.cameraX;
    const camY = this.cameraY;

    ctx.clearRect(0, 0, w, h);

    // ======================================================================
    // 1. Deep Night Sky & Panoramic Skyline (Across River, PDF Page 1 & 2)
    // ======================================================================
    if (this.skylineImg.complete && this.skylineImg.naturalWidth !== 0) {
      const skyX = -camX * 0.22;
      const skyY = -camY * 0.12 - 20;
      ctx.drawImage(this.skylineImg, skyX, skyY, 2400, 720);
      if (skyX + 2400 < w + 800) {
        ctx.drawImage(this.skylineImg, skyX + 2400, skyY, 2400, 720);
      }
    } else {
      ctx.fillStyle = '#06020e';
      ctx.fillRect(0, 0, w, h);
    }

    // ======================================================================
    // 2. Giant Floating 3D Holographic Koi Fish
    // ======================================================================
    const koiScreenX = this.koiHolo.x - camX * 0.35;
    const koiScreenY = this.koiHolo.y + Math.sin(this.koiHolo.phase) * 14 - camY * 0.35;
    
    ctx.strokeStyle = 'rgba(56, 249, 255, 0.75)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(koiScreenX, koiScreenY, 65, 24, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 60, 172, 0.8)';
    ctx.beginPath();
    ctx.moveTo(koiScreenX - 65, koiScreenY);
    ctx.lineTo(koiScreenX - 95, koiScreenY - 18 + Math.cos(this.koiHolo.phase) * 8);
    ctx.lineTo(koiScreenX - 95, koiScreenY + 18 + Math.cos(this.koiHolo.phase) * 8);
    ctx.closePath();
    ctx.stroke();

    // ======================================================================
    // 3. Futuristic Chongqing Elevated Monorail
    // ======================================================================
    const monoX = this.monorail.x - camX * 0.5;
    const monoY = this.monorail.y - camY * 0.5;

    ctx.strokeStyle = '#2d145c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, monoY + 28);
    ctx.lineTo(w, monoY + 28);
    ctx.stroke();

    ctx.fillStyle = '#170933';
    ctx.fillRect(monoX, monoY, this.monorail.width, this.monorail.height);
    ctx.strokeStyle = '#38f9ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(monoX, monoY, this.monorail.width, this.monorail.height);

    for (let wx = monoX + 12; wx < monoX + this.monorail.width - 15; wx += 24) {
      ctx.fillStyle = '#ffe14d';
      ctx.fillRect(wx, monoY + 6, 16, 12);
    }

    // ======================================================================
    // 4. Sky Traffic: Flying Hovercars
    // ======================================================================
    if (this.hovercarImg.complete && this.hovercarImg.naturalWidth !== 0) {
      for (let hc of this.hovercars) {
        const hcX = hc.x - camX * 0.45;
        const hcY = hc.y - camY * 0.45;
        ctx.drawImage(this.hovercarImg, hcX, hcY, 130 * hc.scale, 48 * hc.scale);

        // Underglow trail
        ctx.strokeStyle = 'rgba(56, 249, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(hcX - 25, hcY + 25 * hc.scale);
        ctx.lineTo(hcX, hcY + 25 * hc.scale);
        ctx.stroke();
      }
    }

    // ======================================================================
    // 5. Patrol Surveillance Drones
    // ======================================================================
    if (this.droneImg.complete && this.droneImg.naturalWidth !== 0) {
      for (let dr of this.drones) {
        const drX = dr.x + Math.sin(dr.angle) * dr.range - camX;
        const drY = dr.y + Math.cos(dr.angle) * 8 - camY;
        ctx.drawImage(this.droneImg, drX, drY, 36, 28);

        // Scanning cone beam
        ctx.fillStyle = 'rgba(255, 60, 172, 0.12)';
        ctx.beginPath();
        ctx.moveTo(drX + 18, drY + 28);
        ctx.lineTo(drX - 15, drY + 110);
        ctx.lineTo(drX + 51, drY + 110);
        ctx.closePath();
        ctx.fill();
      }
    }

    // ======================================================================
    // 6. Real Architectural Buildings (Hongyadong Facades)
    // ======================================================================
    if (this.buildingsImg.complete && this.buildingsImg.naturalWidth !== 0) {
      // District 1 Hongyadong (Base resting on GROUND_Y = 520)
      const b1X = 200 - camX;
      const b1Y = GROUND_Y - 460 - camY;
      ctx.drawImage(this.buildingsImg, b1X, b1Y, 580, 460);

      // District 2 High Rise Pagoda Body (Base on GROUND_Y)
      const b2X = 1200 - camX;
      const b2Y = GROUND_Y - 460 - camY;
      ctx.drawImage(this.buildingsImg, b2X, b2Y, 580, 460);
    }

    // ======================================================================
    // 7. THREE GIANT NEON CYBERPUNK BILLBOARDS (Scrapbook Page 1, 2 & 4)
    // ======================================================================
    
    // Billboard 1: Giant Cyber Geisha (District 1 above Skybridge)
    if (this.billboardGeishaImg.complete && this.billboardGeishaImg.naturalWidth !== 0) {
      const gX = 520 - camX;
      const gY = 60 - camY;
      const gW = 150;
      const gH = 235;

      // Outer neon frame
      ctx.strokeStyle = '#38f9ff';
      ctx.lineWidth = 3;
      ctx.strokeRect(gX, gY, gW, gH);
      ctx.drawImage(this.billboardGeishaImg, gX, gY, gW, gH);

      // Steel mounting trusses
      ctx.strokeStyle = '#291252';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(gX + 20, gY + gH);
      ctx.lineTo(gX + 20, gY + gH + 50);
      ctx.moveTo(gX + gW - 20, gY + gH);
      ctx.lineTo(gX + gW - 20, gY + gH + 50);
      ctx.stroke();
    }

    // Billboard 2: Cyber Kuromi Kawaii Demon Cat (District 1 Arcade Tower)
    if (this.billboardKuromiImg.complete && this.billboardKuromiImg.naturalWidth !== 0) {
      const kX = 980 - camX;
      const kY = 85 - camY;
      const kW = 165;
      const kH = 192;

      ctx.strokeStyle = '#ff3cac';
      ctx.lineWidth = 3;
      ctx.strokeRect(kX, kY, kW, kH);
      ctx.drawImage(this.billboardKuromiImg, kX, kY, kW, kH);

      ctx.strokeStyle = '#291252';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(kX + 25, kY + kH);
      ctx.lineTo(kX + 25, kY + kH + 60);
      ctx.moveTo(kX + kW - 25, kY + kH);
      ctx.lineTo(kX + kW - 25, kY + kH + 60);
      ctx.stroke();
    }

    // Billboard 3: Future Idol Holographic Pop Idol (District 2 Skyline Terrace)
    if (this.billboardIdolImg.complete && this.billboardIdolImg.naturalWidth !== 0) {
      const idX = 1720 - camX;
      const idY = 65 - camY;
      const idW = 165;
      const idH = 215;

      ctx.strokeStyle = '#ffe14d';
      ctx.lineWidth = 3;
      ctx.strokeRect(idX, idY, idW, idH);
      ctx.drawImage(this.billboardIdolImg, idX, idY, idW, idH);

      ctx.strokeStyle = '#291252';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(idX + 25, idY + idH);
      ctx.lineTo(idX + 25, idY + idH + 60);
      ctx.moveTo(idX + idW - 25, idY + idH);
      ctx.lineTo(idX + idW - 25, idY + idH + 60);
      ctx.stroke();
    }

    // District 1: Neon Claw Machine Arcade Storefront (x = 440)
    const clawKioskX = 440 - camX;
    const clawKioskY = GROUND_Y - 110 - camY;

    ctx.fillStyle = '#110526';
    ctx.fillRect(clawKioskX - 44, clawKioskY, 88, 110);
    ctx.strokeStyle = '#ff3cac';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(clawKioskX - 44, clawKioskY, 88, 110);

    ctx.fillStyle = '#ff3cac';
    ctx.font = '8px "Press Start 2P", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('夹娃娃机', clawKioskX, clawKioskY + 22);

    ctx.fillStyle = 'rgba(56, 249, 255, 0.18)';
    ctx.fillRect(clawKioskX - 35, clawKioskY + 32, 70, 50);
    ctx.strokeStyle = '#38f9ff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(clawKioskX - 35, clawKioskY + 32, 70, 50);

    ctx.font = '16px sans-serif';
    ctx.fillText('🐱', clawKioskX - 14, clawKioskY + 64);
    ctx.fillText('🐰', clawKioskX + 14, clawKioskY + 64);

    // ======================================================================
    // 8. District Boundary Overhead Holographic Arch (x = 1500)
    // ======================================================================
    const archX = 1500 - camX;
    const archY = 320 - camY;

    ctx.fillStyle = 'rgba(14, 6, 32, 0.88)';
    ctx.fillRect(archX - 190, archY - 110, 380, 34);
    ctx.strokeStyle = '#38f9ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(archX - 190, archY - 110, 380, 34);

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px "Press Start 2P", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('◄ DOWNTOWN | RIVERWALK ►', archX, archY - 88);

    ctx.strokeStyle = 'rgba(56, 249, 255, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(archX - 180, archY - 76);
    ctx.lineTo(archX - 180, GROUND_Y - camY);
    ctx.moveTo(archX + 180, archY - 76);
    ctx.lineTo(archX + 180, GROUND_Y - camY);
    ctx.stroke();

    // ======================================================================
    // 9. Multi-tier Walkways, Platforms, Railings & Stairs
    // ======================================================================
    for (let p of this.platforms) {
      const px = p.x - camX;
      const py = p.y - camY;

      if (p.type === 'ground') {
        // Ground River Promenade
        ctx.fillStyle = '#140828';
        ctx.fillRect(px, py, p.width, p.height);

        // Stone Promenade Paving line
        ctx.strokeStyle = '#38f9ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + p.width, py);
        ctx.stroke();

        // Safety Railings along water
        ctx.strokeStyle = 'rgba(56, 249, 255, 0.55)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, py - 18);
        ctx.lineTo(px + p.width, py - 18);
        ctx.stroke();

        for (let rx = px; rx < px + p.width; rx += 45) {
          ctx.beginPath();
          ctx.moveTo(rx, py);
          ctx.lineTo(rx, py - 18);
          ctx.stroke();
        }
      } else if (p.type === 'skybridge') {
        ctx.fillStyle = '#1a0b38';
        ctx.fillRect(px, py, p.width, p.height);
        ctx.strokeStyle = '#ffe14d';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(px, py, p.width, p.height);
      } else if (p.type === 'terrace') {
        ctx.fillStyle = '#180932';
        ctx.fillRect(px, py, p.width, p.height);
        ctx.strokeStyle = '#ff3cac';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(px, py, p.width, p.height);
      } else {
        ctx.fillStyle = '#1c0d3a';
        ctx.fillRect(px, py, p.width, p.height);
        ctx.strokeStyle = '#38f9ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(px, py, p.width, p.height);
      }
    }

    // ======================================================================
    // 10. Luminous River (Cruise Ship, Water Caustics & Shimmering Reflections)
    // ======================================================================
    this.renderGorgeousRiver();

    // ======================================================================
    // 11. District 2: River Bench & Viewing Station (x = 2150)
    // ======================================================================
    if (this.riverBenchImg.complete && this.riverBenchImg.naturalWidth !== 0) {
      const benchScreenX = 2150 - camX;
      const benchScreenY = GROUND_Y - camY - 65;
      ctx.drawImage(this.riverBenchImg, benchScreenX, benchScreenY, 140, 90);

      // Lamppost Glow over river bench
      ctx.strokeStyle = '#ffe14d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(benchScreenX + 130, benchScreenY - 12, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 225, 77, 0.25)';
      ctx.beginPath();
      ctx.arc(benchScreenX + 130, benchScreenY - 12, 26, 0, Math.PI * 2);
      ctx.fill();
    }

    // ======================================================================
    // 12. PLAYER CHARACTER (Large, Clearly Visible Anime Sprite)
    // ======================================================================
    const playerScreenX = this.player.x - camX;
    let playerScreenY = this.player.y - camY;

    // Sprint Ghost Trail Effect
    if (this.keys.sprint && (this.keys.left || this.keys.right)) {
      ctx.save();
      ctx.globalAlpha = 0.35;
      const trailOffset = this.player.facing === 'left' ? 18 : -18;
      ctx.drawImage(this.charImg, playerScreenX + trailOffset, playerScreenY - 6, 60, 75);
      ctx.restore();
    }

    // Glide Holographic Wings
    if (this.player.isGliding) {
      ctx.strokeStyle = '#38f9ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(playerScreenX - 14, playerScreenY + 18);
      ctx.lineTo(playerScreenX + 60, playerScreenY + 18);
      ctx.stroke();
    }

    ctx.save();
    if (this.player.facing === 'left') {
      ctx.translate(playerScreenX + this.player.width, playerScreenY);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(playerScreenX, playerScreenY);
    }

    // Render Character (60x75px, Crystal Clear!)
    if (this.charImg.complete && this.charImg.naturalWidth !== 0) {
      ctx.drawImage(this.charImg, -8, -6, 60, 75);
    } else {
      ctx.fillStyle = '#ff3cac';
      ctx.fillRect(0, 0, this.player.width, this.player.height);
    }
    ctx.restore();
  }

  renderGorgeousRiver() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const camX = this.cameraX;
    const camY = this.cameraY;

    // Water starts at GROUND_Y + 10
    const waterScreenY = GROUND_Y + 12 - camY;
    if (waterScreenY >= h) return; // Off screen

    const waterHeight = h - waterScreenY;

    // Deep luminous water gradient
    const grad = ctx.createLinearGradient(0, waterScreenY, 0, h);
    grad.addColorStop(0, 'rgba(8, 3, 22, 0.7)');
    grad.addColorStop(0.2, 'rgba(11, 8, 36, 0.9)');
    grad.addColorStop(0.7, 'rgba(6, 12, 42, 0.98)');
    grad.addColorStop(1, 'rgba(3, 1, 14, 1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, waterScreenY, w, waterHeight);

    // Shimmering Water Caustics & Billboard Neon Reflections
    const time = performance.now() * 0.0035;

    // Shimmer reflection columns under each billboard
    const reflections = [
      { x: 520 - camX + 75, color: 'rgba(56, 249, 255, 0.45)', width: 140 }, // Geisha reflection
      { x: 980 - camX + 80, color: 'rgba(255, 60, 172, 0.45)', width: 150 }, // Kuromi reflection
      { x: 1720 - camX + 80, color: 'rgba(255, 225, 77, 0.45)', width: 150 } // Idol reflection
    ];

    for (let r of reflections) {
      if (r.x + r.width > 0 && r.x - r.width < w) {
        ctx.fillStyle = r.color;
        for (let i = 0; i < 16; i++) {
          const ry = waterScreenY + (i * 12) + 6;
          const rw = r.width * (1.0 - i * 0.04) + Math.sin(time * 2 + i) * 12;
          ctx.fillRect(r.x - rw / 2, ry, rw, 2.5);
        }
      }
    }

    // Horizontal rippling caustic waves
    const waveColors = [
      'rgba(56, 249, 255, 0.4)',
      'rgba(255, 60, 172, 0.35)',
      'rgba(123, 92, 255, 0.3)'
    ];

    for (let i = 0; i < 18; i++) {
      const y = waterScreenY + (i * 14) + 8;
      const speed = 0.5 + i * 0.06;
      const amplitude = 3.0 + i * 0.35;
      const col = waveColors[i % waveColors.length];

      ctx.strokeStyle = col;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let x = 0; x < w; x += 18) {
        const offset = Math.sin(x * 0.016 + time * speed + i) * amplitude;
        if (x === 0) ctx.moveTo(x, y + offset);
        else ctx.lineTo(x, y + offset);
      }
      ctx.stroke();
    }

    // Floating Illuminated Chongqing Cyber Cruise Ship
    const shipScreenX = this.cruiseShip.x - camX * 0.45;
    const shipScreenY = waterScreenY + 16;

    // Ship Hull
    ctx.fillStyle = '#12062b';
    ctx.beginPath();
    ctx.moveTo(shipScreenX, shipScreenY + 28);
    ctx.lineTo(shipScreenX + 30, shipScreenY + 48);
    ctx.lineTo(shipScreenX + this.cruiseShip.width - 20, shipScreenY + 48);
    ctx.lineTo(shipScreenX + this.cruiseShip.width, shipScreenY + 28);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ff3cac';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ship Multilevel Pagoda Deck with Glowing Lanterns
    ctx.fillStyle = '#220b42';
    ctx.fillRect(shipScreenX + 40, shipScreenY + 6, 130, 22);
    ctx.strokeStyle = '#ffe14d';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(shipScreenX + 40, shipScreenY + 6, 130, 22);

    // Ship Lanterns
    for (let lx = shipScreenX + 48; lx < shipScreenX + 160; lx += 18) {
      ctx.fillStyle = '#ff0055';
      ctx.beginPath();
      ctx.arc(lx, shipScreenY + 17, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ship neon water wake
    ctx.strokeStyle = 'rgba(56, 249, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shipScreenX - 10, shipScreenY + 48);
    ctx.lineTo(shipScreenX + this.cruiseShip.width + 25, shipScreenY + 48);
    ctx.stroke();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cityWorld = new InteractiveChongqingWorld();
});
