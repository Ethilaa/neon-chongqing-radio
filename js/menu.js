/**
 * menu.js
 * Cyberpunk System Menu.
 * Navigation: Home > City > Mini Games / Music Station / Settings
 */

class CyberpunkMenuManager {
  constructor() {
    this.modal = document.getElementById('cyberpunk-menu-modal');
    this.openBtn = document.getElementById('btn-open-menu');
    this.closeBtn = document.querySelector('.menu-close-btn');
    this.tabs = document.querySelectorAll('.menu-nav-tab');
    this.tabPanels = document.querySelectorAll('.menu-tab-panel');

    this.init();
  }

  init() {
    // Menu Open / Close
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.open());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Keyboard shortcut [M] or [ESC]
    window.addEventListener('keydown', (e) => {
      if (e.key === 'm' || e.key === 'M') {
        if (this.modal && this.modal.classList.contains('open')) this.close();
        else this.open();
      }
      if (e.key === 'Escape') {
        if (this.modal && this.modal.classList.contains('open')) this.close();
      }
    });

    // Tab Navigation
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        this.switchTab(target);
      });
    });

    // District fast travel buttons inside City tab
    const travelD1 = document.getElementById('btn-travel-d1');
    const travelD2 = document.getElementById('btn-travel-d2');

    if (travelD1) {
      travelD1.addEventListener('click', () => {
        if (window.cityWorld) window.cityWorld.teleportToDistrict(1);
        this.close();
      });
    }

    if (travelD2) {
      travelD2.addEventListener('click', () => {
        if (window.cityWorld) window.cityWorld.teleportToDistrict(2);
        this.close();
      });
    }

    // Mini game launch buttons inside Mini Games tab
    const launchJumper = document.getElementById('btn-menu-launch-jumper');
    const launchClaw = document.getElementById('btn-menu-launch-claw');

    if (launchJumper) {
      launchJumper.addEventListener('click', () => {
        this.close();
        if (window.arcadeModal) window.arcadeModal.open();
      });
    }

    if (launchClaw) {
      launchClaw.addEventListener('click', () => {
        this.close();
        if (window.clawMachine) window.clawMachine.open();
      });
    }

    // Settings switches
    const scanlineToggle = document.getElementById('settings-toggle-scanlines');
    const crtOverlay = document.querySelector('.crt-overlay');
    if (scanlineToggle && crtOverlay) {
      scanlineToggle.addEventListener('change', (e) => {
        crtOverlay.style.display = e.target.checked ? 'block' : 'none';
      });
    }

    const rainToggle = document.getElementById('settings-toggle-rain');
    if (rainToggle) {
      rainToggle.addEventListener('change', (e) => {
        if (window.rainSystem) window.rainSystem.toggle(e.target.checked);
      });
    }
  }

  open(defaultTab = 'home') {
    if (this.modal) {
      this.modal.classList.add('open');
      this.switchTab(defaultTab);
      if (window.audioMgr) window.audioMgr.playClickSound();
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove('open');
      if (window.audioMgr) window.audioMgr.playClickSound();
    }
  }

  switchTab(tabId) {
    this.tabs.forEach(t => {
      if (t.dataset.tab === tabId) t.classList.add('active');
      else t.classList.remove('active');
    });

    this.tabPanels.forEach(p => {
      if (p.id === `tab-panel-${tabId}`) p.classList.add('active');
      else p.classList.remove('active');
    });

    if (window.audioMgr) window.audioMgr.playHoverSound();
  }

  showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'cyber-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 20);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cyberMenu = new CyberpunkMenuManager();
});
