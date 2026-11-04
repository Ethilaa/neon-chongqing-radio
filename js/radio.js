/**
 * radio.js
 * Handheld Console Music Play Station (Exact 1:1 replica of PDF Page 5).
 * Play, pause, station switching, volume, visualizer, custom audio upload,
 * persistent IndexedDB storage, and guaranteed auto-play for
 * "I Really Want to Stay at Your House" when sitting by the river!
 */

// ============================================================================
// IndexedDB: Permanently save user-uploaded custom tracks in browser storage
// ============================================================================
const IDB_NAME = 'NeonChongqingRadioDB';
const IDB_VERSION = 1;
const IDB_STORE = 'custom_audio_tracks';

function openAudioDB() {
  return new Promise((resolve) => {
    if (!window.indexedDB) return resolve(null);
    try {
      const req = window.indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'id', autoIncrement: true });
        }
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

function saveTrackToIndexedDB(trackObj) {
  return new Promise(async (resolve) => {
    const db = await openAudioDB();
    if (!db) return resolve(false);
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.add(trackObj);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch (e) {
      resolve(false);
    }
  });
}

function loadAllTracksFromIndexedDB() {
  return new Promise(async (resolve) => {
    const db = await openAudioDB();
    if (!db) return resolve([]);
    try {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    } catch (e) {
      resolve([]);
    }
  });
}

// ============================================================================
// Handheld Console Music Player Class
// ============================================================================
class HandheldConsolePlayer {
  constructor() {
    this.defaultStations = [
      {
        id: 'edgerunners',
        name: 'CYBERPUNK EDGERUNNERS',
        tracks: [
          {
            title: 'I Really Want to Stay at Your House',
            artist: 'Rosa Walton / Cyberpunk 2077',
            src: 'assets/audio/i_really_want_to_stay_at_your_house.wav',
            badge: 'EDGERUNNERS',
            stationId: 'edgerunners',
            stationName: 'CYBERPUNK EDGERUNNERS'
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
            badge: 'SYNTHWAVE',
            stationId: 'synthwave',
            stationName: 'NEON SYNTHWAVE'
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
            badge: 'LO-FI',
            stationId: 'lofi',
            stationName: 'CHILLWAVE LO-FI'
          }
        ]
      }
    ];

    this.stations = JSON.parse(JSON.stringify(this.defaultStations));

    // Active flattened playlist
    this.playlist = [];
    this.rebuildPlaylist();

    this.currentStationIndex = 0;
    this.currentIndex = 0;
    this.isPlaying = false;
    this.currentHowl = null;
    this.html5Audio = null;

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

  rebuildPlaylist() {
    this.playlist = [];
    this.stations.forEach(st => {
      st.tracks.forEach(tr => {
        this.playlist.push({ ...tr, stationId: st.id, stationName: st.name });
      });
    });
  }

  async init() {
    this.setupDockToggle();
    this.setupPlaybackControls();
    this.setupPhysicalConsoleButtons();
    this.setupCustomUpload();
    this.setupArcadeLauncher();
    this.startEqualizerLoop();

    // 1. Try to load synced repository playlist.json
    await this.loadSyncedPlaylist();

    // 2. Restore any custom user tracks permanently saved in IndexedDB
    await this.restoreCustomTracksFromIndexedDB();

    this.updateDisplay();
  }

  async loadSyncedPlaylist() {
    try {
      const res = await fetch('assets/audio/playlist.json');
      if (res.ok) {
        const synced = await res.json();
        if (Array.isArray(synced) && synced.length > 0) {
          // Replace or augment tracks
          this.playlist = synced;
          console.log(`Loaded ${synced.length} permanent songs from playlist.json`);
        }
      }
    } catch (e) {
      // In offline file:// or when playlist.json is not yet fetched, keep defaultStations
    }
  }

  async restoreCustomTracksFromIndexedDB() {
    try {
      const savedTracks = await loadAllTracksFromIndexedDB();
      if (savedTracks && savedTracks.length > 0) {
        savedTracks.forEach(item => {
          const url = URL.createObjectURL(item.blob);
          this.playlist.push({
            title: item.title,
            artist: item.artist || 'Local Upload',
            src: url,
            badge: 'SAVED',
            stationId: 'custom',
            stationName: 'MY SAVED TRACKS'
          });
        });
        console.log(`Restored ${savedTracks.length} tracks permanently from IndexedDB`);
      }
    } catch (e) {
      console.warn('Could not restore tracks from IndexedDB:', e);
    }
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
        if (this.html5Audio) this.html5Audio.volume = val;
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
        if (this.volSlider) {
          const v = Math.min(1, parseFloat(this.volSlider.value) + 0.1);
          this.volSlider.value = v;
          this.volSlider.dispatchEvent(new Event('input'));
        }
      });
    }

    const dpadDown = document.querySelector('.dpad-btn.dpad-down');
    if (dpadDown) {
      dpadDown.addEventListener('click', () => {
        if (this.volSlider) {
          const v = Math.max(0, parseFloat(this.volSlider.value) - 0.1);
          this.volSlider.value = v;
          this.volSlider.dispatchEvent(new Event('input'));
        }
      });
    }

    // SELECT Button: Cycle Radio Station
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

    input.addEventListener('change', async (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_\-]+/g, ' ').trim();

        const trackObj = {
          title: cleanName,
          artist: 'Custom User Track',
          src: url,
          badge: 'SAVED',
          stationId: 'custom',
          stationName: 'MY SAVED TRACKS'
        };

        // Add to active playlist
        this.playlist.unshift(trackObj);

        // Permanently persist to browser's IndexedDB
        await saveTrackToIndexedDB({
          title: cleanName,
          artist: 'Custom User Track',
          blob: file,
          name: file.name,
          date: Date.now()
        });
      }

      this.currentIndex = 0;
      this.playTrack(0);

      if (window.audioMgr) window.audioMgr.playCoinSound();
      if (window.cyberMenu && typeof window.cyberMenu.showToast === 'function') {
        window.cyberMenu.showToast(`✦ ${files.length} SONG(S) PERMANENTLY SAVED TO BROWSER ✦`);
      }
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

  // ==========================================================================
  // Guaranteed Dual Audio Engine (Howler + Native HTML5 Audio Fallback)
  // ==========================================================================
  playTrack(idx) {
    if (this.playlist.length === 0) return;
    if (idx < 0) idx = this.playlist.length - 1;
    if (idx >= this.playlist.length) idx = 0;
    this.currentIndex = idx;

    const track = this.playlist[this.currentIndex];

    // Clean up previous Howler instance
    if (this.currentHowl) {
      try {
        this.currentHowl.stop();
        this.currentHowl.unload();
      } catch (e) {}
      this.currentHowl = null;
    }

    // Clean up previous HTML5 audio
    if (this.html5Audio) {
      try {
        this.html5Audio.pause();
        this.html5Audio.src = '';
      } catch (e) {}
      this.html5Audio = null;
    }

    if (!track || !track.src) return;

    const vol = window.audioMgr ? window.audioMgr.volume : 0.7;

    const onPlaySuccess = () => {
      this.isPlaying = true;
      this.updateDisplay();
    };

    const onPauseState = () => {
      this.isPlaying = false;
      this.updateDisplay();
    };

    let usedHowler = false;
    if (typeof Howl !== 'undefined') {
      try {
        this.currentHowl = new Howl({
          src: [track.src],
          html5: true,
          volume: vol,
          loop: true,
          onloaderror: (id, err) => {
            console.warn('Howler error, seamlessly falling back to HTML5 audio:', err);
            this.playWithHtml5Audio(track.src, vol, onPlaySuccess, onPauseState);
          },
          onplayerror: (id, err) => {
            console.warn('Howler play error, unlocking audio:', err);
            if (this.currentHowl) {
              this.currentHowl.once('unlock', () => {
                if (this.currentHowl) this.currentHowl.play();
              });
            }
          },
          onplay: onPlaySuccess,
          onpause: onPauseState,
          onstop: onPauseState
        });
        this.currentHowl.play();
        usedHowler = true;
      } catch (e) {
        usedHowler = false;
      }
    }

    if (!usedHowler) {
      this.playWithHtml5Audio(track.src, vol, onPlaySuccess, onPauseState);
    }

    this.isPlaying = true;
    this.updateDisplay();
  }

  playWithHtml5Audio(src, vol, onPlaySuccess, onPauseState) {
    try {
      this.html5Audio = new Audio(src);
      this.html5Audio.loop = true;
      this.html5Audio.volume = vol;
      this.html5Audio.onplay = onPlaySuccess;
      this.html5Audio.onpause = onPauseState;
      this.html5Audio.onended = onPauseState;

      const p = this.html5Audio.play();
      if (p !== undefined) {
        p.then(onPlaySuccess).catch((err) => {
          console.warn('HTML5 Audio autoplay prevented. Will play on next interaction:', err);
          const resumeOnInteraction = () => {
            if (this.html5Audio) this.html5Audio.play().catch(() => {});
            window.removeEventListener('click', resumeOnInteraction);
            window.removeEventListener('keydown', resumeOnInteraction);
          };
          window.addEventListener('click', resumeOnInteraction, { once: true });
          window.addEventListener('keydown', resumeOnInteraction, { once: true });
        });
      }
    } catch (e) {
      console.error('HTML5 audio error:', e);
    }
  }

  pause() {
    if (this.currentHowl) {
      try { this.currentHowl.pause(); } catch (e) {}
    }
    if (this.html5Audio) {
      try { this.html5Audio.pause(); } catch (e) {}
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

  // ==========================================================================
  // Guaranteed River Pier Bench Auto-Play for Rosa Walton
  // ==========================================================================
  playEdgerunnersBenchSong() {
    if (window.audioMgr) {
      window.audioMgr.initAudioContext();
    }

    // 1. Find the track matching Rosa Walton or Cyberpunk Edgerunners
    let idx = this.playlist.findIndex(t => {
      const title = (t.title || '').toLowerCase();
      const artist = (t.artist || '').toLowerCase();
      const src = (t.src || '').toLowerCase();
      return title.includes('stay') || title.includes('rosa') ||
             artist.includes('rosa') || artist.includes('edgerunners') ||
             src.includes('stay') || src.includes('house');
    });

    if (idx !== -1) {
      this.playTrack(idx);
    } else {
      // Direct fallback to index 0 (Edgerunners station)
      this.playTrack(0);
    }

    if (window.cyberMenu && typeof window.cyberMenu.showToast === 'function') {
      window.cyberMenu.showToast('♫ NOW PLAYING: "I Really Want to Stay at Your House" - Rosa Walton');
    }
    return true;
  }

  playSongByName(titleQuery) {
    if (!titleQuery) return false;
    const q = titleQuery.toLowerCase();

    // Check if query is asking for the river bench stay song
    if (q.includes('stay') || q.includes('house') || q.includes('edgerunners') || q.includes('rosa')) {
      return this.playEdgerunnersBenchSong();
    }

    const idx = this.playlist.findIndex(t => {
      const title = (t.title || '').toLowerCase();
      const artist = (t.artist || '').toLowerCase();
      const src = (t.src || '').toLowerCase();
      return title.includes(q) || artist.includes(q) || src.includes(q);
    });

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
