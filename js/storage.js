/**
 * storage.js
 * Manages persistence for Neon Chongqing Radio using localStorage.
 */

const STORAGE_KEYS = {
  STATE: 'neon_chongqing_state_v1'
};

const DEFAULT_STATE = {
  coins: 120,
  selectedCrew: 'mei', // mei | rio | iki | sai | mimi
  equippedGear: ['cyber_visor', 'neon_jacket'],
  unlockedGear: ['cyber_visor', 'neon_jacket'],
  radio: {
    volume: 0.7,
    rainVolume: 0.4,
    isMuted: false,
    rainEnabled: true,
    currentTrackIndex: 0
  },
  highScores: {
    runner: 0,
    jumper: 0,
    flyer: 0
  }
};

class GameStorage {
  constructor() {
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATE);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STATE,
          ...parsed,
          radio: { ...DEFAULT_STATE.radio, ...(parsed.radio || {}) },
          highScores: { ...DEFAULT_STATE.highScores, ...(parsed.highScores || {}) }
        };
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using defaults.', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save to localStorage.', e);
    }
  }

  getCoins() {
    return this.state.coins;
  }

  addCoins(amount) {
    this.state.coins = Math.max(0, this.state.coins + amount);
    this.saveState();
    window.dispatchEvent(new CustomEvent('coins-updated', { detail: { coins: this.state.coins } }));
    return this.state.coins;
  }

  getSelectedCrew() {
    return this.state.selectedCrew;
  }

  setSelectedCrew(crewId) {
    this.state.selectedCrew = crewId;
    this.saveState();
    window.dispatchEvent(new CustomEvent('crew-changed', { detail: { crewId } }));
  }

  getEquippedGear() {
    return this.state.equippedGear;
  }

  isGearUnlocked(gearId) {
    return this.state.unlockedGear.includes(gearId);
  }

  unlockGear(gearId, cost = 0) {
    if (this.state.coins >= cost && !this.isGearUnlocked(gearId)) {
      this.addCoins(-cost);
      this.state.unlockedGear.push(gearId);
      this.saveState();
      return true;
    }
    return false;
  }

  toggleEquipGear(gearId) {
    if (!this.isGearUnlocked(gearId)) return false;
    const idx = this.state.equippedGear.indexOf(gearId);
    if (idx > -1) {
      this.state.equippedGear.splice(idx, 1);
    } else {
      this.state.equippedGear.push(gearId);
    }
    this.saveState();
    window.dispatchEvent(new CustomEvent('gear-updated', { detail: { equipped: this.state.equippedGear } }));
    return true;
  }

  getRadioSettings() {
    return this.state.radio;
  }

  updateRadioSettings(updates) {
    this.state.radio = { ...this.state.radio, ...updates };
    this.saveState();
  }

  saveHighScore(game, score) {
    if (score > (this.state.highScores[game] || 0)) {
      this.state.highScores[game] = score;
      this.saveState();
      return true;
    }
    return false;
  }
}

// Global instance
window.gameStorage = new GameStorage();

