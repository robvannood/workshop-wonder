const rig = document.getElementById('balanceRig');
const weight = document.getElementById('balanceWeight');
const rope = document.getElementById('balanceRope');
const state = document.getElementById('balanceState');
const detail = document.getElementById('balanceDetail');

let dragging = false;
let offsetY = 0;
let audio;

function tone(freq = 130, duration = .16, gainValue = .025) {
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume();
    const now = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const filter = audio.createBiquadFilter();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * .92, now + duration);
    filter.type = 'lowpass';
    filter.frequency.value = 780;
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainValue, now + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    osc.connect(filter).connect(gain).connect(audio.destination);
    osc.start(now); osc.stop(now + duration + .02);
  } catch {}
}

function setPosition(y, announce = false) {
  const stage = rig.querySelector('.balance-stage');
  const max = stage.clientHeight - weight.offsetHeight - 7;
  const clamped = Math.max(8, Math.min(max, y));
  weight.style.top = `${clamped}px`;
  const center = clamped + weight.offsetHeight / 2;
  const anchorY = 17;
  const dx = 77;
  const dy = center - anchorY;
  rope.style.width = `${Math.hypot(dx, dy)}px`;
  rope.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;

  rig.classList.remove('too-light', 'balanced', 'too-heavy');
  let next;
  if (clamped < 39) {
    next = 'too-heavy';
    state.textContent = 'too much pull';
    detail.textContent = 'The cup rises before the signal can travel.';
  } else if (clamped <= 67) {
    next = 'balanced';
    state.textContent = 'tension carries';
    detail.textContent = 'Weight becomes a readable signal.';
  } else {
    next = 'too-light';
    state.textContent = 'not enough tension';
    detail.textContent = 'The rope moves, but the cup keeps the energy.';
  }
  const changed = !rig.classList.contains(next);
  rig.classList.add(next);
  document.documentElement.style.setProperty('--balance', next === 'balanced' ? '1' : '0');
  if (announce && changed) {
    tone(next === 'balanced' ? 220 : next === 'too-heavy' ? 92 : 124, next === 'balanced' ? .52 : .2, next === 'balanced' ? .035 : .022);
    const live = document.getElementById('status');
    if (live) live.textContent = detail.textContent;
    if (next === 'balanced') {
      document.getElementById('forceTrace')?.classList.add('show');
      setTimeout(() => document.getElementById('forceTrace')?.classList.remove('show'), 1800);
    }
  }
}

function start(event) {
  dragging = true;
  weight.setPointerCapture?.(event.pointerId);
  const rect = weight.getBoundingClientRect();
  offsetY = event.clientY - rect.top;
  tone(112, .09, .012);
  event.preventDefault();
}

function move(event) {
  if (!dragging) return;
  const stage = rig.querySelector('.balance-stage').getBoundingClientRect();
  setPosition(event.clientY - stage.top - offsetY, false);
}

function end(event) {
  if (!dragging) return;
  dragging = false;
  weight.releasePointerCapture?.(event.pointerId);
  setPosition(parseFloat(weight.style.top) || 70, true);
}

weight?.addEventListener('pointerdown', start);
window.addEventListener('pointermove', move);
window.addEventListener('pointerup', end);
window.addEventListener('resize', () => setPosition(parseFloat(weight.style.top) || 70));

requestAnimationFrame(() => setPosition(70));