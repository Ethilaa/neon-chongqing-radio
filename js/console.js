/**
 * console.js
 * Manages the translucent blue handheld console window, tab navigation,
 * and physical buttons (D-Pad, A/B, SELECT/START).
 */

class ConsoleController {
  constructor() {
    this.overlay = document.getElementById('console-modal-overlay');
    this.tabs = document.querySelectorAll('.console-tab-btn');
    this.panes = document.querySelectorAll('.tab-pane');
    this.currentTab = 'radio';
    this.isOpen = false;

    this.init();
  }

  init() {
    this.setupTabNavigation();
    this.setupPhysicalButtons();
    this.setupKeyboardControls();

    // Close button
    const closeBtn = document.querySelector('.console-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Backdrop click closes console
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }
  }

  open() {
    if (this.overlay) {
      this.overlay.classList.add('open');
      this.isOpen = true;
      if (window.audioMgr) window.audioMgr.playClickSound();
    }
  }

  close() {
    if (this.overlay) {
      this.overlay.classList.remove('open');
      this.isOpen = false;
      if (window.audioMgr) window.audioMgr.playClickSound();
    }
  }

  openTab(tabName) {
    this.open();
    this.switchTab(tabName);
  }

  switchTab(tabName) {
    const targetPane = document.getElementById(`tab-${tabName}`);
    if (!targetPane) return;

    this.currentTab = tabName;

    // Update tab button styles
    this.tabs.forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update active pane
    this.panes.forEach(pane => {
      if (pane.id === `tab-${tabName}`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    if (window.audioMgr) window.audioMgr.playClickSound();

    // Trigger lifecycle hooks if switching into Explore or Game tabs
    if (tabName === 'explore' && window.exploreMode) {
      window.exploreMode.start();
    }
  }

  setupTabNavigation() {
    this.tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab) this.switchTab(tab);
      });
    });
  }

  // Bind D-pad, A/B, Select, Start buttons
  setupPhysicalButtons() {
    const bindPress = (selector, action) => {
      const el = document.querySelector(selector);
      if (!el) return;
      el.addEventListener('mousedown', () => {
        el.classList.add('pressed');
        if (window.audioMgr) window.audioMgr.playClickSound();
        action();
      });
      el.addEventListener('mouseup', () => el.classList.remove('pressed'));
      el.addEventListener('mouseleave', () => el.classList.remove('pressed'));
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        el.classList.add('pressed');
        if (window.audioMgr) window.audioMgr.playClickSound();
        action();
      });
      el.addEventListener('touchend', () => el.classList.remove('pressed'));
    };

    // D-Pad
    bindPress('.dpad-up', () => this.handleDirection('up'));
    bindPress('.dpad-down', () => this.handleDirection('down'));
    bindPress('.dpad-left', () => this.handleDirection('left'));
    bindPress('.dpad-right', () => this.handleDirection('right'));

    // A Button (Confirm / Jump / Play)
    bindPress('.btn-action-a', () => {
      if (this.currentTab === 'games' && window.miniGameManager) {
        window.miniGameManager.handleActionA();
      } else if (this.currentTab === 'explore' && window.exploreMode) {
        window.exploreMode.handleJump();
      } else if (this.currentTab === 'radio' && window.radioPlayer) {
        window.radioPlayer.togglePlay();
      }
    });

    // B Button (Back / Close)
    bindPress('.btn-action-b', () => {
      if (this.currentTab === 'games' && window.miniGameManager && window.miniGameManager.isPlaying) {
        window.miniGameManager.exitToLobby();
      } else {
        this.close();
      }
    });

    // SELECT Button (Cycle Tabs)
    bindPress('.btn-pill-select', () => {
      const tabOrder = ['radio', 'games', 'explore', 'crew', 'gear'];
      const currentIndex = tabOrder.indexOf(this.currentTab);
      const nextIndex = (currentIndex + 1) % tabOrder.length;
      this.switchTab(tabOrder[nextIndex]);
    });

    // START Button (Toggle or Start Game)
    bindPress('.btn-pill-start', () => {
      if (!this.isOpen) {
        this.open();
      } else if (this.currentTab === 'games' && window.miniGameManager) {
        window.miniGameManager.handleActionA();
      }
    });
  }

  handleDirection(dir) {
    if (this.currentTab === 'games' && window.miniGameManager) {
      window.miniGameManager.handleDirection(dir);
    } else if (this.currentTab === 'explore' && window.exploreMode) {
      window.exploreMode.handleDirection(dir);
    }
  }

  setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      // Toggle console with Escape or Start
      if (e.key === 'Escape') {
        if (this.isOpen) this.close();
      }

      if (!this.isOpen) return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.handleDirection('up');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.handleDirection('down');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.handleDirection('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.handleDirection('right');
      } else if (e.key === ' ' || e.key === 'Enter') {
        // A Button
        const aBtn = document.querySelector('.btn-action-a');
        if (aBtn) aBtn.classList.add('pressed');
        if (this.currentTab === 'games' && window.miniGameManager) {
          window.miniGameManager.handleActionA();
        } else if (this.currentTab === 'explore' && window.exploreMode) {
          window.exploreMode.handleJump();
        }
      } else if (e.key === 'b' || e.key === 'B') {
        // B button
        const bBtn = document.querySelector('.btn-action-b');
        if (bBtn) bBtn.classList.add('pressed');
        if (this.currentTab === 'games' && window.miniGameManager && window.miniGameManager.isPlaying) {
          window.miniGameManager.exitToLobby();
        } else {
          this.close();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        const aBtn = document.querySelector('.btn-action-a');
        if (aBtn) aBtn.classList.remove('pressed');
      } else if (e.key === 'b' || e.key === 'B') {
        const bBtn = document.querySelector('.btn-action-b');
        if (bBtn) bBtn.classList.remove('pressed');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.consoleUI = new ConsoleController();
});

