/**
 * radio.js
 * Handheld Console Music Play Station (Exact 1:1 replica of PDF Page 5).
 * Play, pause, station switching, volume, visualizer, custom audio upload,
 * and auto-play "I Really Want to Stay at Your House" when sitting by the river!
 */

class HandheldConsolePlayer {
  constructor() {
    this.stations = [
      {
        id: 'edgerunners',
        name: 'CYBERPUNK EDGERUNNERS',
        tracks: [
          {
            title: 'I Really Want to Stay at Your House',
            artist: 'Rosa Walton / Cyberpunk 2077',
            src: 'assets/audio/i_really_want_to_stay_at_your_house.wav',
            badge: 'EDGERUNNERS'
          }
        ]
      },
      {
        id: 'synthwave',
        name: 'NEON SYNTHWAVE',
        tracks: [
          {
            title: 'Neon Overdrive 2077',
            artist: 'Cyber Pulse Reverie',
            src: 'assets/audio/synthwave_overdrive.wav',
            badge: 'SYNTHWAVE'
          }
        ]
      },
      {
        id: 'lofi',
        name: 'CHILLWAVE LO-FI',
        tracks: [
          {
            title: 'Chongqing City Nights',
            artist: 'Mimi 88.8 FM',
            src: 'assets/audio/lofi_city_nights.wav',
            badge: 'LO-FI'
          }
        ]
      }
    ];

    // Flattened playlist with station tags
    this.playlist = [];
    this.stations.forEach(st => {
      st.tracks.forEach(tr => {
        this.playlist.push({ ...tr, stationId: st.id, stationName: st.name });
      });
    });

    this.currentStationIndex = 0;
    this.currentIndex = 0;
    this.isPlaying = false;
    this.currentHowl = null;

    // DOM Elements
    this.dockEl = document.getElementById('corner-player-dock');
    this.playBtn = document.getElementById('radio-btn-play');
    this.prevBtn = document.getElementById('radio-btn-prev');
    this.nextBtn = document.getElementById('radio-btn-next');
    this.trackTitleEl = document.getElementById('radio-track-title');
    this.volSlider = document.getElementById('radio-vol-slider');
    this.eqBars = document.querySelectorAll('.eq-bar');

    // LCD screen dynamic elements
    this.lcdBadge = document.querySelector('.lcd-badge-pill');
    this.lcdRandomTitle = document.querySelector('.lcd-random-title');

    this.init();
  }

  init() {
    this.setupDockToggle();
    this.setupPlaybackControls();
    this.setupPhysicalConsoleButtons();
    this.setupCustomUpload();
    this.setupArcadeLauncher();
    this.startEqualizerLoop();
    this.updateDisplay();
  }

  setupDockToggle() {
    const toggleBtn = document.getElementById('btn-toggle-dock');
    if (toggleBtn && this.dockEl) {
      toggleBtn.addEventListener('click', () => {
        this.dockEl.classList.toggle('minimized');
        const isMin = this.dockEl.classList.contains('minimized');
        toggleBtn.textContent = isMin ? '▲' : '▼';
        if (window.audioMgr) window.audioMgr.playClickSound();
      });
    }
  }

  setupPlaybackControls() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevTrack());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextTrack());
    }

    if (this.volSlider) {
      this.volSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (window.audioMgr) window.audioMgr.setVolume(val);
        if (this.currentHowl) this.currentHowl.volume(val);
      });
    }

    // Now-playing top HUD pill play/pause click
    const hudPlayBtn = document.getElementById('hud-np-play-toggle');
    if (hudPlayBtn) {
      hudPlayBtn.addEventListener('click', () => this.togglePlay());
    }
  }

  setupPhysicalConsoleButtons() {
    // Physical A / B buttons on console
    const btnA = document.querySelector('.handheld-shell .btn-action-a');
    if (btnA) {
      btnA.addEventListener('click', () => {
        this.togglePlay();
        if (window.audioMgr) window.audioMgr.playClickSound();
      });
    }

    const btnB = document.querySelector('.handheld-shell .btn-action-b');
    if (btnB) {
      btnB.addEventListener('click', () => {
        this.nextTrack();
        if (window.audioMgr) window.audioMgr.playClickSound();
      });
    }

    // D-Pad Buttons
    const dpadLeft = document.querySelector('.dpad-btn.dpad-left');
    if (dpadLeft) {
      dpadLeft.addEventListener('click', () => {
        this.prevTrack();
        if (window.audioMgr) window.audioMgr.playClickSound();
      });
    }

    const dpadRight = document.querySelector('.dpad-btn.dpad-right');
    if (dpadRight) {
      dpadRight.addEventListener('click', () => {
        this.nextTrack();
        if (window.audioMgr) window.audioMgr.playClickSound();
      });
    }

    const dpadUp = document.querySelector('.dpad-btn.dpad-up');
    if (dpadUp) {
      dpadUp.addEventListener('click', () => {
        const cur = window.audioMgr ? window.audioMgr.volume : 0.7;
        const nxt = Math.min(1.0, cur + 0.1);
        if (window.audioMgr) window.audioMgr.setVolume(nxt);
        if (this.currentHowl) this.currentHowl.volume(nxt);
        if (this.volSlider) this.volSlider.value = nxt;
        if (window.audioMgr) window.audioMgr.playClickSound();
      });
    }

    const dpadDown = document.querySelector('.dpad-btn.dpad-down');
    if (dpadDown) {
      dpadDown.addEventListener('click', () => {
        const cur = window.audioMgr ? window.audioMgr.volume : 0.7;
        const nxt = Math.max(0.0, cur - 0.1);
        if (window.audioMgr) window.audioMgr.setVolume(nxt);
        if (this.currentHowl) this.currentHowl.volume(nxt);
        if (this.volSlider) this.volSlider.value = nxt;
        if (window.audioMgr) window.audioMgr.playClickSound();
      });
    }

    // SELECT Button: Cycle Stations
    const btnSelect = document.querySelector('.btn-pill-select');
    if (btnSelect) {
      btnSelect.addEventListener('click', () => {
        this.cycleStation();
        if (window.audioMgr) window.audioMgr.playClickSound();
      });
    }

    // START Button: Open Mini Games Arcade
    const btnStart = document.querySelector('.btn-pill-start');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        if (window.arcadeModal) window.arcadeModal.open();
        if (window.audioMgr) window.audioMgr.playClickSound();
      });
    }
  }

  setupCustomUpload() {
    const input = document.getElementById('custom-audio-input');
    if (!input) return;

    input.addEventListener('change', (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        const name = file.name.replace(/\.[^/.]+$/, '');

        this.playlist.unshift({
          title: name,
          artist: 'Custom User Track',
          src: url,
          badge: 'CUSTOM',
          stationId: 'custom',
          stationName: 'CUSTOM AUDIO'
        });
      }

      this.currentIndex = 0;
      this.playTrack(0);
      if (window.audioMgr) window.audioMgr.playCoinSound();
    });
  }

  setupArcadeLauncher() {
    const arcadeBtn = document.getElementById('btn-player-open-arcade');
    if (arcadeBtn) {
      arcadeBtn.addEventListener('click', () => {
        if (window.arcadeModal) window.arcadeModal.open();
      });
    }
  }

  cycleStation() {
    this.currentStationIndex = (this.currentStationIndex + 1) % this.stations.length;
    const st = this.stations[this.currentStationIndex];
    // Find first track belonging to this station
    const idx = this.playlist.findIndex(t => t.stationId === st.id);
    if (idx !== -1) {
      this.playTrack(idx);
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.playTrack(this.currentIndex);
    }
  }

  playTrack(idx) {
    if (idx < 0) idx = this.playlist.length - 1;
    if (idx >= this.playlist.length) idx = 0;
    this.currentIndex = idx;

    const track = this.playlist[this.currentIndex];

    if (this.currentHowl) {
      this.currentHowl.stop();
      this.currentHowl.unload();
      this.currentHowl = null;
    }

    if (track && track.src) {
      this.currentHowl = new Howl({
        src: [track.src],
        html5: true,
        volume: window.audioMgr ? window.audioMgr.volume : 0.7,
        loop: true,
        onplay: () => {
          this.isPlaying = true;
          this.updateDisplay();
        },
        onpause: () => {
          this.isPlaying = false;
          this.updateDisplay();
        },
        onstop: () => {
          this.isPlaying = false;
          this.updateDisplay();
        }
      });
      this.currentHowl.play();
    }

    this.isPlaying = true;
    this.updateDisplay();
  }

  pause() {
    if (this.currentHowl) {
      this.currentHowl.pause();
    }
    this.isPlaying = false;
    this.updateDisplay();
  }

  nextTrack() {
    this.playTrack(this.currentIndex + 1);
  }

  prevTrack() {
    this.playTrack(this.currentIndex - 1);
  }

  playSongByName(titleQuery) {
    const q = titleQuery.toLowerCase();
    const idx = this.playlist.findIndex(t => t.title.toLowerCase().includes(q));
    if (idx !== -1) {
      this.playTrack(idx);
      return true;
    }
    return false;
  }

  updateDisplay() {
    const track = this.playlist[this.currentIndex];
    if (track) {
      if (this.trackTitleEl) this.trackTitleEl.textContent = track.title;
      
      // Update Handheld LCD Screen Badge
      if (this.lcdBadge) {
        this.lcdBadge.textContent = track.badge || `NO. 0${this.currentIndex + 1}`;
      }

      // Update Top HUD Now Playing widget
      const hudTrackName = document.getElementById('hud-np-title');
      if (hudTrackName) {
        hudTrackName.textContent = track.title;
      }
    }

    if (this.playBtn) {
      this.playBtn.textContent = this.isPlaying ? '❚❚' : '▶';
    }

    const hudPlayToggle = document.getElementById('hud-np-play-toggle');
    if (hudPlayToggle) {
      hudPlayToggle.textContent = this.isPlaying ? '❚❚' : '▶';
    }

    // Top HUD equalizer indicator active state
    const hudBars = document.querySelectorAll('.hud-eq-bar');
    hudBars.forEach(b => {
      if (this.isPlaying) b.classList.add('dancing');
      else b.classList.remove('dancing');
    });

    // Notify listeners
    window.dispatchEvent(new CustomEvent('music-status-changed', {
      detail: {
        isPlaying: this.isPlaying,
        track: track,
        index: this.currentIndex
      }
    }));
  }

  startEqualizerLoop() {
    const loop = () => {
      if (this.isPlaying) {
        const t = performance.now() * 0.009;
        this.eqBars.forEach((bar, i) => {
          const h = Math.abs(Math.sin(t + i * 0.8)) * 16 + Math.random() * 4 + 4;
          bar.style.height = `${h}px`;
        });
      } else {
        this.eqBars.forEach(bar => {
          bar.style.height = '5px';
        });
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.consolePlayer = new HandheldConsolePlayer();
});
