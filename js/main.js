// BrowserGames Hub — shared interactions + pixel UI life
(function () {
  // ---------- Shared safe storage + analytics ----------
  const storage = {
    get(key, fallback) {
      try {
        const value = window.localStorage.getItem(key);
        return value === null ? fallback : value;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* private mode */ }
    }
  };

  const games = [
    { id: 'snake', name: 'Pixel Snake', players: '1p', devices: 'keyboard touch', modes: 'solo score', duration: 'quick', tags: 'onsite arcade' },
    { id: 'pong', name: 'Pixel Pong', players: '2p', devices: 'keyboard', modes: 'versus local', duration: 'quick', tags: 'onsite 2p' },
    { id: 'memory-match', name: 'Memory Match', players: '1p', devices: 'mouse touch', modes: 'solo memory', duration: 'medium', tags: 'onsite puzzle memory' },
    { id: 'pixel-runner', name: 'Pixel Runner', players: '1p', devices: 'keyboard touch', modes: 'solo score', duration: 'quick', tags: 'onsite arcade' },
    { id: '2048-pixel', name: '2048 Pixel', players: '1p', devices: 'keyboard touch', modes: 'solo puzzle', duration: 'medium', tags: 'onsite puzzle' },
    { id: 'breakout', name: 'Pixel Breakout', players: '1p', devices: 'keyboard mouse touch', modes: 'solo score', duration: 'medium', tags: 'onsite arcade' },
    { id: 'tic-tac-toe', name: 'Tic-Tac-Toe', players: '2p', devices: 'mouse touch', modes: 'versus local', duration: 'quick', tags: 'onsite 2p board' },
    { id: 'simon-says', name: 'Simon Says', players: '1p', devices: 'mouse touch', modes: 'solo memory', duration: 'quick', tags: 'onsite memory' },
    { id: 'flappy-pixel', name: 'Flappy Pixel', players: '1p', devices: 'keyboard mouse touch', modes: 'solo score', duration: 'quick', tags: 'onsite arcade' },
    { id: 'connect-4', name: 'Connect 4', players: '2p', devices: 'mouse touch', modes: 'versus local', duration: 'medium', tags: 'onsite 2p board' },
    { id: 'checkers', name: 'Checkers', players: '2p', devices: 'mouse touch', modes: 'versus local strategy', duration: 'long', tags: 'onsite 2p board' },
    { id: 'word-guess', name: 'Word Guess', players: '1p', devices: 'keyboard mouse touch', modes: 'solo puzzle', duration: 'medium', tags: 'onsite word' },
    { id: 'draw-and-guess', name: 'Draw & Guess', players: '2p', devices: 'keyboard mouse touch', modes: 'party local', duration: 'medium', tags: 'onsite party' },
    { id: 'egg-shooter', name: 'Egg Shooter', players: '1p', devices: 'mouse touch', modes: 'solo score', duration: 'quick', tags: 'onsite shooter' },
    { id: 'block-shooter', name: 'Block Shooter', players: '1p', devices: 'mouse touch', modes: 'solo score', duration: 'quick', tags: 'onsite shooter' },
    { id: 'neon-shooter', name: 'Neon Shooter', players: '1p', devices: 'mouse touch', modes: 'solo score', duration: 'quick', tags: 'onsite shooter' },
    { id: 'slope-dash', name: 'Slope Dash', players: '1p', devices: 'keyboard touch', modes: 'solo score', duration: 'quick', tags: 'onsite arcade racing' },
    { id: 'drift-dash', name: 'Drift Dash', players: '1p', devices: 'keyboard touch', modes: 'solo score', duration: 'quick', tags: 'onsite racing' },
    { id: 'party-quiz', name: 'Party Quiz', players: '2p', devices: 'keyboard mouse touch', modes: 'party local', duration: 'medium', tags: 'onsite party' },
    { id: 'whack-a-mole', name: 'Whack-a-Mole', players: '1p', devices: 'mouse touch', modes: 'solo score', duration: 'quick', tags: 'onsite arcade' },
    { id: 'reaction-time', name: 'Reaction Time', players: '1p', devices: 'mouse touch', modes: 'solo reflex', duration: 'quick', tags: 'onsite arcade' }
  ];
  window.bgGames = games;

  const pageGameId = () => {
    const match = window.location.pathname.match(/\/games\/([^/]+)\.html$/i);
    return match ? match[1] : '';
  };

  const gameHref = (id) => pageGameId() ? `../games/${id}.html` : `games/${id}.html`;
  const currentGame = () => games.find((game) => game.id === pageGameId()) || null;

  const track = (eventName, params) => {
    const payload = Object.assign({ page_path: window.location.pathname }, params || {});
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, payload);
      } else {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(['event', eventName, payload]);
      }
    } catch (e) {
      // Analytics must never interrupt gameplay or navigation.
    }
  };
  window.bgTrack = track;

  const RECENT_KEY = 'bg-recent-games';
  const getRecentGames = () => {
    try {
      const ids = JSON.parse(storage.get(RECENT_KEY, '[]'));
      return Array.isArray(ids) ? ids.filter((id) => games.some((game) => game.id === id)) : [];
    } catch (e) {
      return [];
    }
  };
  const rememberGame = (id) => {
    if (!id) return;
    const recent = [id].concat(getRecentGames().filter((item) => item !== id)).slice(0, 6);
    storage.set(RECENT_KEY, JSON.stringify(recent));
  };
  window.bgRecentGames = { get: getRecentGames, add: rememberGame };

  const copyText = (value) => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      return navigator.clipboard.writeText(value);
    }
    return new Promise((resolve, reject) => {
      const input = document.createElement('textarea');
      input.value = value;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand('copy');
        resolve();
      } catch (e) {
        reject(e);
      } finally {
        input.remove();
      }
    });
  };

  const sharePage = (options) => {
    const config = options || {};
    const url = config.url || window.location.href;
    const title = config.title || document.title;
    const text = config.text || `Play ${title} on BrowserGames Hub`;
    const method = typeof navigator.share === 'function' ? 'native' : 'clipboard';
    track('share', { method, content_type: config.contentType || 'page', game_id: pageGameId() || undefined });
    if (typeof navigator.share === 'function') {
      return navigator.share({ title, text, url }).then(() => true).catch((error) => {
        if (error && error.name === 'AbortError') return false;
        return copyText(url).then(() => true).catch(() => false);
      });
    }
    return copyText(url).then(() => true).catch(() => false);
  };
  window.bgShare = sharePage;

  const addSkipLink = () => {
    const main = document.querySelector('main');
    if (!main) return;
    if (!main.id) main.id = 'main-content';
    if (document.querySelector('.skip-link')) return;
    const link = document.createElement('a');
    link.className = 'skip-link';
    link.href = `#${main.id}`;
    link.textContent = 'Skip to content';
    document.body.insertBefore(link, document.body.firstChild);
  };

  // ---------- Sound engine (global) ----------
  const SOUND_KEY = 'bg-sound-on';
  const audio = {
    ctx: null,
    enabled: storage.get(SOUND_KEY, 'on') !== 'off',
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
      storage.set(SOUND_KEY, this.enabled ? 'on' : 'off');
      return this.enabled;
    }
  };
  window.bgSound = audio;

  // ---------- Sound toggle button ----------
  const soundBtn = document.createElement('button');
  soundBtn.type = 'button';
  soundBtn.className = 'sound-toggle' + (audio.enabled ? '' : ' off');
  soundBtn.setAttribute('aria-label', 'Toggle sound effects');
  soundBtn.setAttribute('aria-pressed', String(audio.enabled));
  soundBtn.textContent = audio.enabled ? 'SND ON' : 'SND OFF';
  soundBtn.addEventListener('click', () => {
    const on = audio.toggle();
    soundBtn.textContent = on ? 'SND ON' : 'SND OFF';
    soundBtn.classList.toggle('off', !on);
    soundBtn.setAttribute('aria-pressed', String(on));
    audio.play('flip');
  });
  const mountSoundButton = () => {
    if (document.body && !soundBtn.parentNode) document.body.appendChild(soundBtn);
  };
  mountSoundButton();
  document.addEventListener('DOMContentLoaded', mountSoundButton, { once: true });

  // ---------- Analytics consent ----------
  const ANALYTICS_CONSENT_KEY = 'bg-analytics-consent';
  const ANALYTICS_ID = 'G-579DPCHJ6G';
  const loadAnalyticsScript = () => {
    if (window.__bgAnalyticsLoaded || document.querySelector('script[data-bg-analytics], script[src*="googletagmanager.com/gtag/js"]')) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
    script.setAttribute('data-bg-analytics', 'true');
    script.addEventListener('load', () => { window.__bgAnalyticsLoaded = true; }, { once: true });
    document.head.appendChild(script);
  };
  const applyAnalyticsConsent = (granted) => {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
    if (granted) loadAnalyticsScript();
  };
  const openAnalyticsConsent = () => {
    if (window.location.search.indexOf('embed=1') !== -1) return;
    const existing = document.querySelector('.consent-banner');
    if (existing) {
      const allow = existing.querySelector('[data-consent-allow]');
      if (allow) allow.focus();
      return;
    }
    const banner = document.createElement('aside');
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Privacy choices');
    const privacyHref = pageGameId() ? '../privacy-policy.html' : 'privacy-policy.html';
    banner.innerHTML = '<div class="consent-banner-inner"><p id="privacy-choice-copy"><strong>Privacy choices.</strong> We use optional analytics to understand which pages and games are useful. You can continue without analytics. <a href="' + privacyHref + '">Read the privacy policy</a>.</p><div class="consent-actions"><button type="button" class="btn btn-primary" data-consent-allow>Allow analytics</button><button type="button" class="btn btn-ghost" data-consent-deny>Continue without</button></div></div>';
    banner.setAttribute('aria-describedby', 'privacy-choice-copy');
    const choose = (value) => {
      storage.set(ANALYTICS_CONSENT_KEY, value);
      applyAnalyticsConsent(value === 'granted');
      banner.remove();
      const privacyButton = document.querySelector('[data-privacy-choices]');
      if (privacyButton) privacyButton.focus();
    };
    banner.querySelector('[data-consent-allow]').addEventListener('click', () => choose('granted'));
    banner.querySelector('[data-consent-deny]').addEventListener('click', () => choose('denied'));
    document.body.appendChild(banner);
    window.requestAnimationFrame(() => banner.querySelector('[data-consent-allow]').focus());
  };
  const initAnalyticsConsent = () => {
    if (window.location.search.indexOf('embed=1') !== -1) return;
    const saved = storage.get(ANALYTICS_CONSENT_KEY, '');
    if (saved === 'granted' || saved === 'denied') {
      applyAnalyticsConsent(saved === 'granted');
      return;
    }
    openAnalyticsConsent();
  };
  const addPrivacyChoicesLink = () => {
    if (window.location.search.indexOf('embed=1') !== -1) return;
    const footerLinks = document.querySelector('.footer-links');
    if (!footerLinks || footerLinks.querySelector('[data-privacy-choices]')) return;
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'privacy-choice-link';
    button.setAttribute('data-privacy-choices', 'true');
    button.textContent = 'Privacy choices';
    button.addEventListener('click', openAnalyticsConsent);
    item.appendChild(button);
    footerLinks.appendChild(item);
  };

  // ---------- Mobile nav toggle ----------
  const toggle = document.querySelector('[data-nav-toggle]');
  const links = document.querySelector('[data-nav-links]');
  if (toggle && links) {
    if (!links.id) links.id = 'site-navigation';
    toggle.setAttribute('aria-controls', links.id);
    const closeMenu = (returnFocus) => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      if (open) {
        const firstLink = links.querySelector('a');
        if (firstLink && window.matchMedia('(max-width: 768px)').matches) firstLink.focus();
      }
    });
    toggle.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu(false);
    });
    links.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu(true);
    });
    links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu(false)));
  }

  // ---------- Game finder filter ----------
  const chips = document.querySelectorAll('[data-filter-group] [data-filter], .finder-controls > [data-filter]');
  const items = document.querySelectorAll('[data-game]');
  if (chips.length && items.length) {
    const filterState = {};
    const groups = {};
    const resultCount = document.querySelector('[data-filter-result-count]');
    const emptyState = document.querySelector('[data-filter-empty]');
    const getGroup = (chip) => chip.closest('[data-filter-group]');
    const getValue = (chip) => chip.getAttribute('data-filter-value') || chip.getAttribute('data-filter');
    const getGroupName = (chip) => {
      const group = getGroup(chip);
      return group ? (group.getAttribute('data-filter-group') || 'genre') : 'genre';
    };
    const getAttributeName = (chip) => {
      const group = getGroup(chip);
      if (group && group.getAttribute('data-filter-attribute')) return group.getAttribute('data-filter-attribute');
      return 'game';
    };
    chips.forEach((chip) => {
      const name = getGroupName(chip);
      if (!groups[name]) groups[name] = [];
      groups[name].push(chip);
      chip.type = 'button';
      chip.setAttribute('aria-pressed', chip.classList.contains('active') ? 'true' : 'false');
      if (chip.classList.contains('active')) filterState[name] = getValue(chip);
    });
    Object.keys(groups).forEach((name) => {
      if (!filterState[name]) filterState[name] = 'all';
      groups[name].forEach((chip) => {
        const selected = getValue(chip) === filterState[name];
        chip.classList.toggle('active', selected);
        chip.setAttribute('aria-pressed', String(selected));
      });
    });

    const updateFilterUi = (sourceChip) => {
      let visibleCount = 0;
      items.forEach((item) => {
        const matches = Object.keys(groups).every((name) => {
          const value = filterState[name];
          if (value === 'all') return true;
          const chip = groups[name][0];
          const attribute = getAttributeName(chip);
          const raw = item.getAttribute(`data-${attribute}`) || '';
          return raw.split(/\s+/).includes(value);
        });
        item.classList.toggle('hide', !matches);
        item.setAttribute('aria-hidden', String(!matches));
        if (matches) visibleCount += 1;
      });
      if (resultCount) {
        resultCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'game' : 'games'} found`;
        resultCount.setAttribute('data-count', String(visibleCount));
      }
      if (emptyState) emptyState.hidden = visibleCount !== 0;
      if (sourceChip) {
        track('finder_filter', {
          filter_group: getGroupName(sourceChip),
          filter_value: getValue(sourceChip),
          results_count: visibleCount
        });
      }
    };

    const setFilter = (chip, shouldTrack) => {
      const name = getGroupName(chip);
      filterState[name] = getValue(chip);
      groups[name].forEach((candidate) => {
        const selected = candidate === chip;
        candidate.classList.toggle('active', selected);
        candidate.setAttribute('aria-pressed', String(selected));
      });
      updateFilterUi(shouldTrack === false ? null : chip);
    };
    chips.forEach((chip) => {
      chip.addEventListener('click', () => setFilter(chip));
      chip.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        const group = groups[getGroupName(chip)];
        const current = group.indexOf(chip);
        let next = current;
        if (event.key === 'ArrowLeft') next = (current - 1 + group.length) % group.length;
        if (event.key === 'ArrowRight') next = (current + 1) % group.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = group.length - 1;
        event.preventDefault();
        group[next].focus();
        setFilter(group[next]);
      });
    });
    document.querySelectorAll('[data-filter-reset]').forEach((reset) => {
      reset.addEventListener('click', () => {
        Object.keys(groups).forEach((name) => {
          const all = groups[name].find((chip) => getValue(chip) === 'all');
          if (all) setFilter(all, false);
        });
        const first = chips[0];
        if (first) first.focus();
      });
    });
    updateFilterUi();
  }

  // ---------- Recent games, sharing, and reusable game actions ----------
  const renderRecentGames = () => {
    const root = document.querySelector('[data-recent-games]');
    if (!root) return;
    const recent = getRecentGames().map((id) => games.find((game) => game.id === id)).filter(Boolean);
    root.hidden = recent.length === 0;
    const grid = root.querySelector('[data-recent-games-list]');
    if (!grid) return;
    grid.textContent = '';
    recent.forEach((game) => {
      const link = document.createElement('a');
      link.className = 'game-card recent-game-card';
      link.href = gameHref(game.id);
      link.setAttribute('data-game-link', game.id);
      const label = document.createElement('span');
      label.className = 'game-label';
      label.textContent = 'Recently played';
      const title = document.createElement('h4');
      title.textContent = game.name;
      const description = document.createElement('p');
      description.textContent = 'Jump back in where you left off.';
      const action = document.createElement('span');
      action.className = 'game-link';
      action.textContent = 'Play again';
      link.append(label, title, description, action);
      grid.appendChild(link);
    });
  };

  const enhanceGamePage = () => {
    const game = currentGame();
    const gameWrap = document.querySelector('.game-page .game-wrap');
    if (!game || !gameWrap || document.querySelector('[data-game-enhancements]')) return;

    const main = document.querySelector('main');
    const gameStatus = document.createElement('p');
    gameStatus.className = 'game-status';
    gameStatus.setAttribute('role', 'status');
    gameStatus.setAttribute('aria-live', 'polite');
    gameStatus.textContent = 'Ready to play.';

    const scoreNodes = gameWrap.querySelectorAll('#score, #best, #moves, #time, [data-score], [data-best]');
    scoreNodes.forEach((node) => {
      node.setAttribute('aria-live', 'polite');
      node.setAttribute('aria-atomic', 'true');
    });
    const controlsNote = gameWrap.querySelector('.controls-note');
    if (controlsNote) {
      if (!controlsNote.id) controlsNote.id = 'game-controls-note';
      controlsNote.setAttribute('role', 'note');
    }
    gameWrap.querySelectorAll('canvas').forEach((canvas, index) => {
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('tabindex', '0');
      canvas.setAttribute('aria-label', `${game.name} game board${index ? ` ${index + 1}` : ''}`);
      if (controlsNote) canvas.setAttribute('aria-describedby', controlsNote.id);
    });

    const actionBar = document.createElement('div');
    actionBar.className = 'game-actions';
    actionBar.setAttribute('role', 'group');
    actionBar.setAttribute('aria-label', `${game.name} actions`);
    const existingRestart = gameWrap.querySelector('#restart, .btn-restart');
    const startButton = gameWrap.querySelector('#start');
    const resetButton = existingRestart || startButton;
    let suppressRestartTelemetry = false;
    let gameStarted = false;
    let gameStartedAt = 0;
    let engagementTimer = null;
    const markGameStarted = (trigger) => {
      if (gameStarted) return;
      gameStarted = true;
      gameStartedAt = Date.now();
      track('game_start', { game_id: game.id, trigger: trigger || 'interaction' });
      engagementTimer = window.setTimeout(() => {
        if (!document.hidden) track('game_engaged', { game_id: game.id, engagement_seconds: 30 });
      }, 30000);
    };

    const rematch = document.createElement('button');
    rematch.type = 'button';
    rematch.className = 'btn btn-primary game-action';
    rematch.textContent = 'Rematch';
    rematch.setAttribute('data-game-rematch', 'true');
    rematch.addEventListener('click', () => {
      track('rematch', { game_id: game.id, navigation_type: 'shared_action' });
      suppressRestartTelemetry = true;
      gameStatus.textContent = 'New round ready.';
      if (resetButton) {
        resetButton.click();
      } else {
        window.location.reload();
      }
    });
    actionBar.appendChild(rematch);

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        const label = (resetButton.textContent || '').trim();
        const isInitialStart = /^start( game)?$/i.test(label);
        markGameStarted(isInitialStart ? 'start_button' : 'restart_button');
        if (!isInitialStart && !suppressRestartTelemetry) {
          track('rematch', { game_id: game.id, navigation_type: 'existing_action' });
        }
        if (!isInitialStart) resetGameEndState();
        suppressRestartTelemetry = false;
        gameStatus.textContent = 'New round ready.';
      });
    }

    const next = games[(games.indexOf(game) + 1) % games.length];
    const nextLink = document.createElement('a');
    nextLink.className = 'btn btn-ghost game-action';
    nextLink.href = gameHref(next.id);
    nextLink.textContent = `Next: ${next.name}`;
    nextLink.setAttribute('data-game-next', next.id);
    nextLink.addEventListener('click', () => track('next_game', { game_id: game.id, next_game_id: next.id }));
    actionBar.appendChild(nextLink);

    const shareButton = document.createElement('button');
    shareButton.type = 'button';
    shareButton.className = 'btn btn-ghost game-action';
    shareButton.textContent = 'Share game';
    shareButton.setAttribute('data-share', 'game');
    shareButton.addEventListener('click', () => {
      sharePage({
        title: document.title,
        text: `Play ${game.name} free in your browser.`,
        contentType: 'game'
      }).then((shared) => {
        if (!shared) return;
        shareButton.textContent = 'Link copied';
        window.setTimeout(() => { shareButton.textContent = 'Share game'; }, 1800);
      });
    });
    actionBar.appendChild(shareButton);

    const reportLink = document.createElement('a');
    reportLink.className = 'btn btn-ghost game-action';
    reportLink.href = pageGameId() ? '../contact.html' : 'contact.html';
    reportLink.textContent = 'Report a problem';
    actionBar.appendChild(reportLink);

    const gameInfo = gameWrap.querySelector('.game-info');
    if (gameInfo) {
      gameInfo.insertAdjacentElement('beforebegin', actionBar);
      actionBar.insertAdjacentElement('afterend', gameStatus);
    } else {
      gameWrap.append(actionBar, gameStatus);
    }
    const related = document.createElement('section');
    related.className = 'container related-games game-enhancements';
    related.setAttribute('data-game-enhancements', 'related');
    related.setAttribute('aria-labelledby', 'related-games-title');
    const relatedTitle = document.createElement('h2');
    relatedTitle.id = 'related-games-title';
    relatedTitle.textContent = 'More pixel games';
    const relatedGrid = document.createElement('div');
    relatedGrid.className = 'game-stack';
    games.filter((candidate) => candidate.id !== game.id && candidate.tags.split(/\s+/).some((tag) => game.tags.split(/\s+/).includes(tag))).slice(0, 3).forEach((candidate) => {
      const link = document.createElement('a');
      link.className = 'game-card';
      link.href = gameHref(candidate.id);
      link.setAttribute('data-game-link', candidate.id);
      const label = document.createElement('span');
      label.className = 'game-label';
      label.textContent = 'Related game';
      const title = document.createElement('h4');
      title.textContent = candidate.name;
      const description = document.createElement('p');
      description.textContent = 'Play instantly with no download or sign-up.';
      const action = document.createElement('span');
      action.className = 'game-link';
      action.textContent = 'Play now';
      link.append(label, title, description, action);
      link.addEventListener('click', () => track('next_game', { game_id: game.id, next_game_id: candidate.id, navigation_type: 'related' }));
      relatedGrid.appendChild(link);
    });
    related.append(relatedTitle, relatedGrid);
    if (main) main.insertAdjacentElement('afterend', related);

    let roundEnded = false;
    const readScore = () => {
      const score = gameWrap.querySelector('#score, [data-score]');
      return score ? (score.textContent || '').trim().replace(/^score:\s*/i, '') : undefined;
    };
    const announceGameEnd = (source) => {
      if (roundEnded) return;
      roundEnded = true;
      track('game_end', {
        game_id: game.id,
        end_source: source || 'shared_observer',
        score: readScore(),
        duration_seconds: gameStartedAt ? Math.round((Date.now() - gameStartedAt) / 1000) : undefined
      });
      gameStatus.textContent = 'Round ended. Choose Rematch or Next game.';
    };
    const resetGameEndState = () => { roundEnded = false; };
    window.bgGameEnd = announceGameEnd;
    window.bgGameStart = () => markGameStarted('shared_api');
    const endText = /game over|you win|you won|wins!|you lose|time'?s up|time up|finished|it's a draw|draw!/i;
    const checkText = (node) => {
      if (node && endText.test(node.textContent || '')) announceGameEnd('status_text');
    };
    const observeRoot = gameWrap;
    if (window.MutationObserver && observeRoot) {
      const observer = new MutationObserver((records) => records.forEach((record) => checkText(record.target)));
      observer.observe(observeRoot, { childList: true, subtree: true, characterData: true });
    }
    if (window.CanvasRenderingContext2D && !window.__bgCanvasTelemetryWrapped) {
      const originalFillText = window.CanvasRenderingContext2D.prototype.fillText;
      window.CanvasRenderingContext2D.prototype.fillText = function (text) {
        const result = originalFillText.apply(this, arguments);
        if (endText.test(String(text))) window.bgGameEnd('canvas_text');
        return result;
      };
      window.__bgCanvasTelemetryWrapped = true;
    }
    gameWrap.addEventListener('click', (event) => {
      if (event.target.closest('[data-game-rematch]')) {
        resetGameEndState();
        markGameStarted('rematch');
      }
    });
    gameWrap.addEventListener('pointerdown', (event) => {
      if (event.target.closest('canvas, .game-frame, .game-controls, #start, #restart, .btn-restart')) markGameStarted('pointer');
    });
    window.addEventListener('keydown', (event) => {
      if (['Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return;
      markGameStarted('keyboard');
    });
    window.addEventListener('pagehide', () => {
      if (engagementTimer) window.clearTimeout(engagementTimer);
    }, { once: true });
    track('game_view', { game_id: game.id });
    rememberGame(game.id);
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    const href = link.href;
    const url = new URL(href, window.location.href);
    const linkText = (link.textContent || '').trim().slice(0, 80);
    if (url.origin === window.location.origin) {
      const gameLink = url.pathname.match(/\/games\/([^/]+)\.html$/i);
      if (gameLink && !pageGameId()) track('guide_to_game', { game_id: gameLink[1], link_text: linkText });
      return;
    }
    if (!/^https?:/i.test(href)) return;
    track('outbound_click', { link_url: href, link_text: linkText });
  });

  const initSharedEnhancements = () => {
    addSkipLink();
    addPrivacyChoicesLink();
    initAnalyticsConsent();
    if (window.location.search.indexOf('embed=1') !== -1) return;
    renderRecentGames();
    enhanceGamePage();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedEnhancements, { once: true });
  } else {
    initSharedEnhancements();
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
    const games = ['snake','pong','memory-match','pixel-runner','2048-pixel','breakout','tic-tac-toe','simon-says','flappy-pixel','connect-4','checkers','word-guess','draw-and-guess','egg-shooter','block-shooter','neon-shooter','slope-dash','drift-dash','party-quiz','whack-a-mole','reaction-time'];
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
        'party-quiz': 'Party Quiz',
          'whack-a-mole': 'Whack-a-Mole',
          'reaction-time': 'Reaction Time'
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
        track('game_start', { game_id: games[current], trigger: 'quick_play' });
        rememberGame(games[current]);
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
