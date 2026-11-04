/**
 * gear.js
 * Cyberpunk Weapon & Accessory Shop & Equipment system.
 */

const GEAR_CATALOG = [
  { id: 'cyber_blaster', name: 'CYBER BLASTER', type: 'WEAPON', icon: '🔫', cost: 0, desc: 'Standard 88.8 tactical sidearm.' },
  { id: 'plasma_blade', name: 'PLASMA BLADE', type: 'WEAPON', icon: '⚡', cost: 60, desc: 'Pink thermal blade cutting through alloys.' },
  { id: 'pulse_smg', name: 'PULSE SMG', type: 'WEAPON', icon: '💥', cost: 120, desc: 'High-RPM neon projectile repeater.' },
  { id: 'cyber_visor', name: 'CYBER VISOR', type: 'ACCESSORY', icon: '👓', cost: 0, desc: 'Targeting HUD with thermal outline.' },
  { id: 'neon_jacket', name: 'NEON JACKET', type: 'ACCESSORY', icon: '🧥', cost: 0, desc: 'Waterproof Chongqing rain courier coat.' },
  { id: 'cat_ears', name: 'KUROMI EARS', type: 'ACCESSORY', icon: '🐱', cost: 40, desc: 'Cyber-cat holographic sensory antennas.' },
  { id: 'chrome_arm', name: 'CHROME ARM', type: 'ACCESSORY', icon: '🦾', cost: 80, desc: 'Military grade cybernetic prosthesis.' },
  { id: 'hacker_deck', name: 'CYBER DECK', type: 'ACCESSORY', icon: '💻', cost: 100, desc: 'Portable terminal for signal overriding.' },
  { id: 'companion_drone', name: 'MINI DRONE', type: 'ACCESSORY', icon: '🛸', cost: 150, desc: 'Personal aerial companion.' }
];

class GearShopManager {
  constructor() {
    this.container = document.querySelector('.gear-grid-list');
    this.coinCountEl = document.getElementById('gear-coin-count');

    this.init();
  }

  init() {
    this.render();
    this.updateCoinDisplay();

    // Listen for coin updates
    window.addEventListener('coins-updated', () => {
      this.updateCoinDisplay();
      this.render();
    });

    window.addEventListener('gear-updated', () => {
      this.render();
    });
  }

  updateCoinDisplay() {
    if (!this.coinCountEl) return;
    const coins = window.gameStorage ? window.gameStorage.getCoins() : 120;
    this.coinCountEl.textContent = coins;
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const currentCoins = window.gameStorage ? window.gameStorage.getCoins() : 0;
    const equipped = window.gameStorage ? window.gameStorage.getEquippedGear() : [];

    GEAR_CATALOG.forEach(item => {
      const isUnlocked = window.gameStorage ? window.gameStorage.isGearUnlocked(item.id) : true;
      const isEquipped = equipped.includes(item.id);

      const card = document.createElement('div');
      card.className = `gear-item-card ${isEquipped ? 'equipped' : ''}`;

      let actionBtnHtml = '';
      if (!isUnlocked) {
        actionBtnHtml = `<button class="gear-item-btn btn-buy" data-id="${item.id}" data-cost="${item.cost}">BUY 🪙${item.cost}</button>`;
      } else if (isEquipped) {
        actionBtnHtml = `<button class="gear-item-btn btn-equipped" data-id="${item.id}">EQUIPPED ✓</button>`;
      } else {
        actionBtnHtml = `<button class="gear-item-btn btn-equip" data-id="${item.id}">EQUIP</button>`;
      }

      card.innerHTML = `
        <div class="gear-item-top">
          <div class="gear-item-icon">${item.icon}</div>
          <div class="gear-item-meta">
            <span class="gear-item-name">${item.name}</span>
            <span class="gear-item-type">${item.type}</span>
          </div>
        </div>
        <p class="gear-item-desc">${item.desc}</p>
        ${actionBtnHtml}
      `;

      // Button click handler
      const btn = card.querySelector('.gear-item-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          if (!isUnlocked) {
            if (currentCoins >= item.cost) {
              const success = window.gameStorage.unlockGear(item.id, item.cost);
              if (success) {
                if (window.audioMgr) window.audioMgr.playCoinSound();
                this.render();
              }
            } else {
              // Not enough coins
              btn.textContent = 'NEED COINS!';
              setTimeout(() => { this.render(); }, 1000);
            }
          } else {
            window.gameStorage.toggleEquipGear(item.id);
            if (window.audioMgr) window.audioMgr.playClickSound();
            this.render();
          }
        });
      }

      this.container.appendChild(card);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.gearShop = new GearShopManager();
});

