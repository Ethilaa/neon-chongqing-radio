/**
 * crew.js
 * Character manager for Mei, Rio, Iki, Sai, and Mimi with cute anime avatars.
 */

const CREW_ROSTER = {
  mei: {
    id: 'mei',
    name: 'MEI',
    role: 'Rooftop Courier',
    quote: '"No rooftop too high, no delivery late."',
    color: '#ff3cac',
    sprite: 'assets/sprites/crew-mei.svg'
  },
  rio: {
    id: 'rio',
    name: 'RIO',
    role: 'Street Racer',
    quote: '"Faster than the Maglev, louder than the rain."',
    color: '#ffe14d',
    sprite: 'assets/sprites/crew-rio.svg'
  },
  iki: {
    id: 'iki',
    name: 'IKI',
    role: 'Signal Hacker',
    quote: '"Every firewall in Chongqing has a back door."',
    color: '#38f9ff',
    sprite: 'assets/sprites/crew-iki.svg'
  },
  sai: {
    id: 'sai',
    name: 'SAI',
    role: 'Gun Tinkerer',
    quote: '"Chrome over flesh, precision over luck."',
    color: '#7b5cff',
    sprite: 'assets/sprites/crew-sai.svg'
  },
  mimi: {
    id: 'mimi',
    name: 'MIMI',
    role: 'Night-Radio Host',
    quote: '"Broadcasting 88.8 FM until the neon fades."',
    color: '#ff71ce',
    sprite: 'assets/sprites/crew-mimi.svg'
  }
};

class CharacterCrewManager {
  constructor() {
    this.selectedCrew = 'mei';
    this.init();
  }

  init() {
    if (window.gameStorage) {
      this.selectedCrew = window.gameStorage.getSelectedCrew() || 'mei';
    }

    this.bindDockButtons();
    this.updateActiveDockUI();
  }

  bindDockButtons() {
    const buttons = document.querySelectorAll('.crew-avatar-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const charId = btn.dataset.char;
        if (charId) this.selectCharacter(charId);
      });
    });
  }

  selectCharacter(charId) {
    if (!CREW_ROSTER[charId]) return;
    this.selectedCrew = charId;

    if (window.gameStorage) {
      window.gameStorage.setSelectedCrew(charId);
    }

    if (window.audioMgr) window.audioMgr.playCoinSound();

    this.updateActiveDockUI();

    // Broadcast change
    window.dispatchEvent(new CustomEvent('crew-changed', { detail: { crewId: charId } }));
  }

  updateActiveDockUI() {
    const buttons = document.querySelectorAll('.crew-avatar-btn');
    buttons.forEach(btn => {
      if (btn.dataset.char === this.selectedCrew) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const activeChar = this.getActiveCharacter();
    document.documentElement.style.setProperty('--char-trail-color', activeChar.color);
  }

  getActiveCharacter() {
    return CREW_ROSTER[this.selectedCrew] || CREW_ROSTER.mei;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.crewManager = new CharacterCrewManager();
});
