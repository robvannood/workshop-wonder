(() => {
  let engineReady = false;
  let fallbackStarted = false;
  let entryAttempted = false;
  let pendingFailure = '';
  let fallbackTimer;

  const errorPanel = document.getElementById('error');
  const enterButton = document.getElementById('enterWorkshop');

  function armFallback() {
    entryAttempted = true;
    clearTimeout(fallbackTimer);
    if (pendingFailure) {
      setTimeout(() => startFallback(pendingFailure), 350);
      return;
    }
    fallbackTimer = setTimeout(() => {
      if (!engineReady) startFallback('The full 3D engine took too long to start.');
    }, 9000);
  }

  enterButton?.addEventListener('click', armFallback, { capture: true });
  window.addEventListener('keydown', event => {
    if (!entryAttempted && (event.key === 'Enter' || event.key === ' ')) armFallback();
  }, { capture: true });

  window.addEventListener('wonder-engine-ready', () => {
    engineReady = true;
    clearTimeout(fallbackTimer);
  });

  if (errorPanel) {
    new MutationObserver(() => {
      if (!errorPanel.classList.contains('show')) return;
      const text = errorPanel.querySelector('p')?.textContent || 'The 3D construction system could not start.';
      pendingFailure = text;
      if (entryAttempted) startFallback(text);
    }).observe(errorPanel, { attributes: true, attributeFilter: ['class'], subtree: true, childList: true, characterData: true });
  }

  window.startWorkshopFallback = startFallback;

  function startFallback(reason = '') {
    if (fallbackStarted || engineReady) return;
    fallbackStarted = true;
    clearTimeout(fallbackTimer);
    document.getElementById('loading')?.classList.add('hidden');
    errorPanel?.classList.remove('show');
    document.getElementById('arrival')?.remove();
    document.body.classList.add('arrived', 'fallback-active');
    document.querySelector('canvas')?.setAttribute('aria-hidden', 'true');

    const fallback = document.createElement('section');
    fallback.id = 'fallbackWorkshop';
    fallback.className = 'show';
    fallback.setAttribute('aria-label', 'Lightweight Wonder Studio');
    fallback.innerHTML = `
      <div class="fb-scene">
        <div class="fb-title"><small>THE WORKSHOP OPENED IN LIGHTWEIGHT MODE</small><h1>Wonder Studio</h1><p>The larger engine could not start, but the mechanism is still here to investigate.</p></div>
        <div class="fb-badge">NO DOWNLOADS · NO EXTERNAL ENGINE</div>
        <div class="fb-note">Ramp first.<br>Then tension.<br>Change one thing.</div>
        <div class="fb-window"><div id="fbDistant" class="fb-distant"></div></div>
        <div class="fb-bench"></div>
        <div class="fb-board">
          <svg id="fbSvg" viewBox="0 0 1100 650" role="img" aria-label="A cardboard marble and counterweight mechanism">
            <defs><radialGradient id="fbGlass" cx="30%" cy="25%"><stop offset="0" stop-color="#fff"/><stop offset=".32" stop-color="#8eb5ba"/><stop offset=".78" stop-color="#2c4650"/></radialGradient></defs>
            <path class="fb-cardboard" d="M75 78 L985 48 L1040 565 L115 605 Z"/>
            <path class="fb-cardboard-edge" d="M93 95 L968 67 L1019 548 L132 584 Z"/>
            <text x="720" y="105" fill="#56351f" font-family="Comic Sans MS,cursive" font-size="23" transform="rotate(-3 720 105)">prototype 9 — the rope remembers</text>
            <g id="fbRamp" class="fb-ramp"><rect x="170" y="418" width="350" height="25" rx="5" class="fb-wood"/><circle cx="500" cy="430" r="18" class="fb-handle"/><path d="M185 430 L225 430" stroke="#dba568" stroke-width="4" stroke-dasharray="5 5"/></g>
            <g id="fbTray" class="fb-tray"><path d="M105 365 L180 365 L164 415 L118 415 Z" fill="#8b5b37" stroke="#54331f" stroke-width="5"/><text x="112" y="350" fill="#4b301e" font-size="17">marble tray</text></g>
            <circle id="fbMarble" class="fb-marble" cx="150" cy="392" r="18"/>
            <rect id="fbLever" class="fb-lever fb-wood" x="535" y="446" width="140" height="18" rx="5"/>
            <g id="fbWheel" class="fb-wheel"><circle cx="610" cy="305" r="91" class="fb-metal"/><circle cx="610" cy="305" r="65" fill="#9e783c" stroke="#6d542c" stroke-width="5"/><path d="M610 221 V389 M526 305 H694 M551 246 L669 364 M669 246 L551 364" stroke="#6d542c" stroke-width="10"/><circle cx="610" cy="305" r="17" fill="#4e3924"/></g>
            <circle cx="790" cy="198" r="48" class="fb-metal"/><circle cx="790" cy="198" r="23" fill="#674f2c"/>
            <path id="fbRope" class="fb-rope" d="M790 198 C800 220 830 240 842 270 L842 360"/>
            <g id="fbWeight" class="fb-weight"><path d="M817 265 Q842 238 867 265" fill="none" stroke="#d7c194" stroke-width="7"/><rect x="810" y="265" width="64" height="75" rx="8" class="fb-metal"/><path d="M825 285 H859 M825 302 H859" stroke="#6b512b" stroke-width="5"/></g>
            <g id="fbCup" class="fb-cup"><path d="M715 405 L790 405 L777 474 L728 474 Z" fill="#915c35" stroke="#57351f" stroke-width="6"/><line x1="752" y1="405" x2="752" y2="265" class="fb-rope"/></g>
            <circle id="fbFilament" class="fb-filament" cx="930" cy="255" r="57"/>
            <path id="fbPulse" class="fb-pulse" d="M545 455 C625 430 640 345 700 320 S770 255 790 198 S875 195 930 255"/>
          </svg>
        </div>
        <div class="fb-instructions"><strong>Touch the mechanism itself.</strong>Drag the ramp handle. Drag the brass weight. Touch the marble tray to place and release the marble. Failure is information.</div>
        <div class="fb-panel"><div id="fbStatus" class="fb-status">The room is quiet. The mechanism is waiting for a first adjustment.</div><button id="fbReset">Reset mechanism</button><button id="fbRetry">Try the full 3D room again</button></div>
      </div>`;
    document.body.appendChild(fallback);
    bindFallback(reason);
  }

  function bindFallback(reason) {
    const svg = document.getElementById('fbSvg');
    const ramp = document.getElementById('fbRamp');
    const weight = document.getElementById('fbWeight');
    const tray = document.getElementById('fbTray');
    const marble = document.getElementById('fbMarble');
    const lever = document.getElementById('fbLever');
    const wheel = document.getElementById('fbWheel');
    const rope = document.getElementById('fbRope');
    const cup = document.getElementById('fbCup');
    const filament = document.getElementById('fbFilament');
    const pulse = document.getElementById('fbPulse');
    const distant = document.getElementById('fbDistant');
    const status = document.getElementById('fbStatus');

    let angle = 7;
    let weightY = 265;
    let placed = false;
    let busy = false;
    let dragging = '';
    let audioContext;

    const say = text => { status.textContent = text; };
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const svgPoint = event => {
      const rect = svg.getBoundingClientRect();
      return { x: (event.clientX - rect.left) * 1100 / rect.width, y: (event.clientY - rect.top) * 650 / rect.height };
    };
    const sound = (frequency = 170, duration = .12, gain = .025, type = 'triangle') => {
      try {
        audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') audioContext.resume();
        const oscillator = audioContext.createOscillator();
        const volume = audioContext.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        volume.gain.setValueAtTime(.0001, audioContext.currentTime);
        volume.gain.exponentialRampToValueAtTime(gain, audioContext.currentTime + .012);
        volume.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration);
        oscillator.connect(volume).connect(audioContext.destination);
        oscillator.start(); oscillator.stop(audioContext.currentTime + duration + .03);
      } catch (_) {}
    };

    function tension() { return Math.round((weightY - 220) / 2.45); }
    function updateRamp() {
      ramp.setAttribute('transform', `rotate(${angle} 170 430)`);
      if (angle < -13) say('The ramp is steep. The marble may jump past the lever.');
      else if (angle > 0) say('The ramp is shallow. The marble will lose too much height.');
      else say('The ramp now points toward the lever.');
    }
    function updateWeight() {
      weight.setAttribute('transform', `translate(0 ${weightY - 265})`);
      rope.setAttribute('d', `M790 198 C800 220 830 232 842 ${weightY + 5} L842 ${weightY + 8}`);
      const value = tension();
      if (value < 43) say('The cord is slack. The wheel may turn without lifting the cup.');
      else if (value > 70) say('The cord is over-tensioned. The cup may rise before the signal reaches it.');
      else say('The rope settles into a useful tension.');
    }

    function beginDrag(kind, event) {
      if (busy) return;
      dragging = kind;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      sound(kind === 'ramp' ? 145 : 105, .08, .015, 'sawtooth');
      event.preventDefault();
    }
    ramp.addEventListener('pointerdown', event => beginDrag('ramp', event));
    weight.addEventListener('pointerdown', event => beginDrag('weight', event));
    window.addEventListener('pointermove', event => {
      if (!dragging || busy) return;
      const point = svgPoint(event);
      if (dragging === 'ramp') {
        angle = clamp(Math.atan2(point.y - 430, point.x - 170) * 180 / Math.PI, -20, 12);
        updateRamp();
      } else {
        weightY = clamp(point.y - 34, 225, 465);
        updateWeight();
      }
    });
    window.addEventListener('pointerup', () => { if (dragging) sound(178, .11, .02); dragging = ''; });

    tray.addEventListener('click', () => {
      if (busy) return;
      if (!placed) {
        placed = true;
        marble.classList.add('placed');
        say('The marble waits in the tray. Touch it again when you are ready to test your idea.');
        sound(235, .16, .028);
      } else releaseMarble();
    });

    function animateMarble(targetX, targetY, duration, done) {
      const startX = 150, startY = 392, start = performance.now();
      function frame(now) {
        const progress = clamp((now - start) / duration, 0, 1);
        const eased = progress * progress;
        marble.setAttribute('cx', String(startX + (targetX - startX) * eased));
        marble.setAttribute('cy', String(startY + (targetY - startY) * eased + Math.sin(progress * Math.PI) * -18));
        if (progress < 1) requestAnimationFrame(frame); else done();
      }
      requestAnimationFrame(frame);
    }

    function releaseMarble() {
      busy = true;
      placed = false;
      const aligned = angle >= -13 && angle <= 0;
      say('The marble is carrying your adjustment into the mechanism…');
      sound(130, .2, .022, 'sine');
      animateMarble(aligned ? 548 : 500, aligned ? 450 : 570, 950, () => {
        if (!aligned) {
          say(angle < -13 ? 'The marble jumped the lever. The steep ramp left a clear trace.' : 'The marble arrived without enough height. The shallow ramp absorbed the motion.');
          sound(82, .22, .035, 'triangle');
          setTimeout(() => { busy = false; marble.classList.remove('placed'); }, 500);
          return;
        }
        lever.classList.remove('hit'); wheel.classList.remove('spin');
        void lever.getBoundingClientRect();
        lever.classList.add('hit'); wheel.classList.add('spin');
        sound(92, .18, .045, 'square');
        setTimeout(() => evaluateTension(), 600);
      });
    }

    function evaluateTension() {
      const value = tension();
      if (value < 43) {
        say('The wheel turns, but the slack cord carries almost no lift. Change the weight position and try again.');
        sound(78, .3, .025);
        setTimeout(() => busy = false, 700);
        return;
      }
      if (value > 70) {
        cup.classList.add('lift');
        say('Too much preload: the cup rises early and the signal is lost before the filament.');
        sound(68, .38, .03, 'sawtooth');
        setTimeout(() => { cup.classList.remove('lift'); busy = false; }, 1300);
        return;
      }
      cup.classList.add('lift');
      pulse.classList.remove('go'); void pulse.getBoundingClientRect(); pulse.classList.add('go');
      say('Tension carries the motion through the pulley. The workshop answers beyond the window.');
      sound(196, .55, .025); setTimeout(() => sound(293.66, .7, .022), 180); setTimeout(() => sound(440, .9, .018), 380);
      setTimeout(() => { filament.classList.add('on'); distant.classList.add('on'); }, 650);
      setTimeout(() => busy = false, 1700);
    }

    document.getElementById('fbReset').addEventListener('click', () => {
      angle = 7; weightY = 265; placed = false; busy = false;
      ramp.setAttribute('transform', 'rotate(7 170 430)');
      weight.removeAttribute('transform'); rope.setAttribute('d', 'M790 198 C800 220 830 240 842 270 L842 360');
      marble.setAttribute('cx', '150'); marble.setAttribute('cy', '392'); marble.classList.remove('placed');
      cup.classList.remove('lift'); filament.classList.remove('on'); distant.classList.remove('on'); wheel.classList.remove('spin'); pulse.classList.remove('go');
      say('The mechanism rests again. You remember what the previous attempt revealed.');
      sound(150, .14, .018);
    });
    document.getElementById('fbRetry').addEventListener('click', () => location.reload());

    if (reason) console.warn('Wonder Studio lightweight fallback:', reason);
    say('The lightweight workshop is ready. Drag the ramp or the brass weight to begin.');
  }
})();