const intro = document.getElementById('arrival');
const enter = document.getElementById('enterWorkshop');
const listen = document.getElementById('listen');
const whisper = document.getElementById('whisper');

let audioContext;
let master;
let ambienceOn = false;
let entered = false;
let timers = [];

function makeAudio() {
  if (audioContext) return;
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  master = audioContext.createGain();
  master.gain.value = 0.0001;
  master.connect(audioContext.destination);

  const room = audioContext.createOscillator();
  const roomGain = audioContext.createGain();
  const roomFilter = audioContext.createBiquadFilter();
  room.type = 'sine';
  room.frequency.value = 54;
  roomGain.gain.value = 0.025;
  roomFilter.type = 'lowpass';
  roomFilter.frequency.value = 180;
  room.connect(roomFilter).connect(roomGain).connect(master);
  room.start();

  const overtone = audioContext.createOscillator();
  const overtoneGain = audioContext.createGain();
  overtone.type = 'triangle';
  overtone.frequency.value = 81;
  overtoneGain.gain.value = 0.008;
  overtone.connect(overtoneGain).connect(master);
  overtone.start();
}

function pluck(frequency = 220, duration = 2.4, volume = 0.035) {
  if (!audioContext || !ambienceOn) return;
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(frequency, now);
  osc.frequency.exponentialRampToValueAtTime(frequency * 0.992, now + duration);
  filter.type = 'lowpass';
  filter.frequency.value = 950;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(filter).connect(gain).connect(master);
  osc.start(now);
  osc.stop(now + duration + 0.1);
}

function scheduleResonance() {
  timers.forEach(clearTimeout);
  timers = [];
  if (!ambienceOn) return;
  const notes = [146.83, 164.81, 196, 220, 246.94, 293.66];
  const delay = 4200 + Math.random() * 7000;
  timers.push(setTimeout(() => {
    const root = notes[Math.floor(Math.random() * notes.length)];
    pluck(root, 2.8 + Math.random() * 1.8, 0.018 + Math.random() * 0.018);
    if (Math.random() > 0.55) setTimeout(() => pluck(root * 1.5, 2.1, 0.014), 620);
    scheduleResonance();
  }, delay));
}

async function toggleAmbience(force) {
  makeAudio();
  if (audioContext.state === 'suspended') await audioContext.resume();
  ambienceOn = typeof force === 'boolean' ? force : !ambienceOn;
  master.gain.cancelScheduledValues(audioContext.currentTime);
  master.gain.linearRampToValueAtTime(ambienceOn ? 0.72 : 0.0001, audioContext.currentTime + 1.2);
  listen?.classList.toggle('active', ambienceOn);
  listen?.setAttribute('aria-pressed', String(ambienceOn));
  if (whisper) whisper.textContent = ambienceOn ? 'the room is listening' : 'listen to the room';
  scheduleResonance();
}

function enterWorkshop() {
  if (entered) return;
  entered = true;
  document.body.classList.add('arrived');
  intro?.setAttribute('aria-hidden', 'true');
  toggleAmbience(true);
  setTimeout(() => intro?.remove(), 1400);
}

enter?.addEventListener('click', enterWorkshop);
listen?.addEventListener('click', () => toggleAmbience());

window.addEventListener('keydown', event => {
  if (!entered && (event.key === 'Enter' || event.key === ' ')) enterWorkshop();
  if (event.key.toLowerCase() === 'l' && entered) toggleAmbience();
});

// Fine grain parallax and living dust, independent of the 3D scene.
window.addEventListener('pointermove', event => {
  const x = event.clientX / innerWidth - 0.5;
  const y = event.clientY / innerHeight - 0.5;
  document.documentElement.style.setProperty('--look-x', `${x * 18}px`);
  document.documentElement.style.setProperty('--look-y', `${y * 14}px`);
});

// Contact with interface objects produces restrained material feedback.
document.addEventListener('pointerdown', event => {
  if (!entered || !ambienceOn) return;
  const target = event.target.closest('button, #question, canvas');
  if (!target) return;
  pluck(target.tagName === 'CANVAS' ? 118 : 176, 0.48, 0.012);
});
