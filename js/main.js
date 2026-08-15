// BrowserGames Hub — shared interactions + pixel UI life
(function () {
  // ---------- Sound engine (global) ----------
  const SOUND_KEY = 'bg-sound-on';
  const audio = {
    ctx: null,
    enabled: localStorage.getItem(SOUND_KEY) !== 'off',
    ensure() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },
    tone(freq, dur, type, vol, delay) {
      if (!this.enabled) return;
      this.ensure();
      if (!this.ctx) return;
      const t0 = this.ctx.currentTime + (delay || 0);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(vol || 0.07, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur);
    },
    play(type) {
      if (!this.enabled) return;
      this.ensure();
      switch (type) {
        case 'eat':
          this.tone(660, 0.07, 'square', 0.06);
          this.tone(880, 0.07, 'square', 0.06, 0.05);
          break;
        case 'bounce':
          this.tone(440, 0.05, 'square', 0.05);
          break;
        case 'score':
          this.tone(523, 0.07, 'square', 0.06);
          this.tone(659, 0.07, 'square', 0.06, 0.06);
          this.tone(784, 0.09, 'square', 0.06, 0.12);
          break;
        case 'over':
          this.tone(392, 0.12, 'sawtooth', 0.06);
          this.tone(311, 0.12, 'sawtooth', 0.06, 0.12);
          this.tone(233, 0.2, 'sawtooth', 0.06, 0.24);
          break;
        case 'jump':
          this.tone(220, 0.09, 'square', 0.06);
          this.tone(440, 0.09, 'square', 0.06, 0.06);
          break;
        case 'flip':
          this.tone(520, 0.04, 'square', 0.05);
          break;
        case 'match':
          this.tone(523, 0.08, 'square', 0.06);
          this.tone(784, 0.1, 'square', 0.06, 0.07);
          break;
        case 'win':
          this.tone(523, 0.08, 'square', 0.06);
          this.tone(659, 0.08, 'square', 0.06, 0.08);
          this.tone(784, 0.08, 'square', 0.06, 0.16);
          this.tone(1047, 0.14, 'square', 0.06, 0.24);
          break;
        case 'move':
          this.tone(330, 0.03, 'square', 0.04);
          break;
        case 'hurt':
          this.tone(196, 0.12, 'sawtooth', 0.06);
          break;
        default:
          this.tone(600, 0.05, 'square', 0.05);
      }
    },
    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem(SOUND_KEY, this.enabled ? 'on' : 'off');
      return this.enabled;
    }
  };
  window.bgSound = audio;

  // ---------- Sound toggle button ----------
  const soundBtn = document.createElement('button');
  soundBtn.type = 'button';
  soundBtn.className = 'sound-toggle' + (audio.enabled ? '' : ' off');
  soundBtn.setAttribute('aria-label', 'Toggle sound effects');
  soundBtn.textContent = audio.enabled ? 'SND ON' : 'SND OFF';
  soundBtn.addEventListener('click', () => {
    const on = audio.toggle();
    soundBtn.textContent = on ? 'SND ON' : 'SND OFF';
    soundBtn.classList.toggle('off', !on);
    audio.play('flip');
  });
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(soundBtn));
  if (document.body) document.body.appendChild(soundBtn);

  // ---------- Mobile nav toggle ----------
  const toggle = document.querySelector('[data-nav-toggle]');
  const links = document.querySelector('[data-nav-links]');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // ---------- Game finder filter ----------
  const chips = document.querySelectorAll('[data-filter]');
  const items = document.querySelectorAll('[data-game]');
  if (chips.length && items.length) {
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.getAttribute('data-filter');
        items.forEach((item) => {
          const match = filter === 'all' || item.getAttribute('data-game').split(/\s+/).includes(filter);
          item.classList.toggle('hide', !match);
        });
      });
    });
  }

  // ---------- Auto year ----------
  const yearEls = document.querySelectorAll('[data-year]');
  if (yearEls.length) {
    const year = String(new Date().getFullYear());
    yearEls.forEach((el) => (el.textContent = year));
  }

  // ---------- Pause bridge for embedded games ----------
  window.bgPaused = false;
  window.addEventListener('message', (e) => {
    if (e.data === 'bg-pause') window.bgPaused = true;
    if (e.data === 'bg-resume') window.bgPaused = false;
  });

  // ---------- Random quick-play game (homepage widget) ----------
  const quickFrame = document.getElementById('quick-game');
  if (quickFrame) {
    const games = ['snake','pong','memory-match','pixel-runner','2048-pixel','breakout','tic-tac-toe','simon-says','flappy-pixel','connect-4','checkers','word-guess','draw-and-guess','egg-shooter','block-shooter','neon-shooter','slope-dash','drift-dash','party-quiz'];
    const names = {
      'snake': 'Pixel Snake',
      'pong': 'Pixel Pong',
      'memory-match': 'Memory Match',
      'pixel-runner': 'Pixel Runner',
      '2048-pixel': '2048 Pixel',
      'breakout': 'Pixel Breakout',
      'tic-tac-toe': 'Tic-Tac-Toe',
      'simon-says': 'Simon Says',
      'flappy-pixel': 'Flappy Pixel',
        'connect-4': 'Connect 4',
        'checkers': 'Checkers',
        'word-guess': 'Word Guess',
        'draw-and-guess': 'Draw & Guess',
        'egg-shooter': 'Egg Shooter',
        'block-shooter': 'Block Shooter',
        'neon-shooter': 'Neon Shooter',
        'slope-dash': 'Slope Dash',
        'drift-dash': 'Drift Dash',
        'party-quiz': 'Party Quiz'
    };
    let current = Math.floor(Math.random() * games.length);
    let started = false;
    let paused = false;
    const overlay = document.getElementById('quick-overlay');
    const overlayText = document.getElementById('quick-overlay-text');
    const startBtn = document.getElementById('quick-start');
    const pauseBtn = document.getElementById('quick-pause');
    const resumeBtn = document.getElementById('quick-resume');

    const sendToGame = (msg) => {
      if (quickFrame.contentWindow) quickFrame.contentWindow.postMessage(msg, '*');
    };

    const showOverlay = (text, showResume) => {
      if (overlay) overlay.classList.remove('hide');
      if (overlayText) overlayText.textContent = text;
      if (resumeBtn) resumeBtn.style.display = showResume ? 'inline-flex' : 'none';
      if (startBtn) startBtn.style.display = showResume ? 'none' : 'inline-flex';
    };

    const hideOverlay = () => {
      if (overlay) overlay.classList.add('hide');
    };

    const loadGame = () => {
      quickFrame.src = 'games/' + games[current] + '.html?embed=1';
      paused = false;
      if (pauseBtn) pauseBtn.textContent = 'Pause';
      hideOverlay();
    };

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        started = true;
        loadGame();
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        if (!started) return;
        paused = !paused;
        if (paused) {
          sendToGame('bg-pause');
          pauseBtn.textContent = 'Resume';
          showOverlay('Paused — take a breath', true);
        } else {
          sendToGame('bg-resume');
          pauseBtn.textContent = 'Pause';
          hideOverlay();
        }
      });
    }

    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        if (pauseBtn) pauseBtn.click();
      });
    }

    const rndBtn = document.getElementById('random-game');
    if (rndBtn) {
      rndBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let next;
        do { next = Math.floor(Math.random() * games.length); } while (next === current && games.length > 1);
        current = next;
        if (started) {
          loadGame();
        } else {
          showOverlay('Next up: ' + names[games[current]], false);
        }
      });
    }

    showOverlay('Ready for ' + names[games[current]] + '?', false);
  }

// ---------- Embed mode for game pages inside iframes ----------
  if (location.search.indexOf('embed=1') !== -1) {
    document.body.classList.add('embed-mode');
  }

  // ---------- Pixel decorations: butterfly + walking slime ----------
  const stage = document.querySelector('.hero, .article-hero');
  if (stage) {
    if (!stage.querySelector('.pixel-butterfly')) {
      const butterfly = document.createElement('div');
      butterfly.className = 'pixel-butterfly';
      butterfly.setAttribute('aria-hidden', 'true');
      butterfly.innerHTML = '<i class="wing l"></i><i class="wing r"></i>';
      stage.appendChild(butterfly);
    }
    if (!stage.querySelector('.pixel-slime')) {
      const slime = document.createElement('div');
      slime.className = 'pixel-slime';
      slime.setAttribute('aria-hidden', 'true');
      stage.appendChild(slime);
    }
  }

  // ---------- Pixel particles on button clicks ----------
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn, .chip');
    if (!btn) return;
    const n = 6;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      p.className = 'btn-particle';
      p.setAttribute('aria-hidden', 'true');
      const angle = Math.random() * Math.PI * 2;
      const dist = 22 + Math.random() * 34;
      p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      p.style.setProperty('--dy', `${Math.sin(angle) * dist - 18}px`);
      btn.appendChild(p);
      setTimeout(() => p.remove(), 650);
    }
  });
})();
