type Failure = 'marble-miss' | 'loose-cord';
type Phase = 'exploring' | 'ready' | 'failed' | 'complete';
interface State { rampAngle: number; cordTension: number; marblePlaced: boolean; phase: Phase; failure: Failure | null; questionUsed: boolean; causalEventId: number; replayCount: number; }
const initial: State = { rampAngle: 24, cordTension: 35, marblePlaced: false, phase: 'exploring', failure: null, questionUsed: false, causalEventId: 0, replayCount: 0 };
let state: State = { ...initial };
const root = document.querySelector<HTMLDivElement>('#root');
const toneFrequency = { wood: 180, thread: 260, marble: 420, miss: 110, loose: 150, wake: 520, reset: 220 } as const;
let audioContext: AudioContext | null = null;
function playTone(tone: keyof typeof toneFrequency) {
  const AudioContextClass = window.AudioContext;
  if (!AudioContextClass) return;
  audioContext ??= new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.frequency.value = toneFrequency[tone];
  oscillator.type = tone === 'wake' ? 'sine' : 'triangle';
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(tone === 'wake' ? 0.18 : 0.08, audioContext.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + (tone === 'wake' ? 0.9 : 0.24));
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + (tone === 'wake' ? 0.95 : 0.28));
}
const isRampAligned = () => state.rampAngle >= 39 && state.rampAngle <= 49;
const isCordTense = () => state.cordTension >= 70;
function setState(next: State) { const previousEvent = state.causalEventId; state = next; render(); if (state.causalEventId > previousEvent) playTone('wake'); }
function statusText() {
  if (state.failure === 'marble-miss') return 'The marble skitters past the lever. The ramp is telling you to change the angle.';
  if (state.failure === 'loose-cord') return 'The wheel turns, but the cup stays low. The cord needs more tension.';
  if (state.phase === 'complete') return 'The switch, filament, glow, particles, and distant answering light wake together.';
  return 'One quiet room. One central cardboard-and-thread mechanism.';
}
function render() {
  if (!root) return;
  root.innerHTML = `<main class="room" aria-label="Workshop Wonder opening room">
    <img src="/src/assets/workshop.svg" alt="Uploaded workshop room backdrop" class="backdrop" />
    <section class="machine ${state.phase} ${state.failure ?? ''}">
      <div class="filament" data-active="${state.phase === 'complete'}"></div><div class="distant-light" data-active="${state.phase === 'complete'}"></div>
      <div class="particles" data-active="${state.phase === 'complete'}">${Array.from({ length: 12 }, () => '<i></i>').join('')}</div>
      <div class="ramp" style="rotate:${state.rampAngle - 24}deg"><span class="marble" data-placed="${state.marblePlaced}"></span></div>
      <div class="wheel" style="--cord:${state.cordTension}%"><b></b></div><div class="switch" data-active="${state.phase === 'complete'}"></div>
    </section>
    <section class="bench" aria-label="mechanism controls">
      <label>Adjust launch ramp <input id="ramp" aria-label="adjust the launch ramp" type="range" min="20" max="60" value="${state.rampAngle}" /></label>
      <label>Thread / tension lifting cord <input id="cord" aria-label="thread or tension the lifting cord" type="range" min="20" max="100" value="${state.cordTension}" /></label>
      <button id="place">Place the marble</button><button id="release" ${!state.marblePlaced ? 'disabled' : ''}>Release the marble</button>
      ${state.failure ? '<button id="recover">Recover without full reset</button>' : ''}${state.phase === 'complete' ? '<button id="replay">Replay completed mechanism</button>' : ''}
      <button id="reset">Full reset</button>${!state.questionUsed ? '<button id="question">Question card</button>' : '<p class="card">What moved because you moved something else?</p>'}
    </section><p class="status" role="status">${statusText()}</p></main>`;
  document.querySelector<HTMLInputElement>('#ramp')?.addEventListener('input', (event) => { setState({ ...state, rampAngle: Number((event.target as HTMLInputElement).value), failure: state.failure === 'marble-miss' ? null : state.failure, phase: state.phase === 'failed' ? 'exploring' : state.phase }); playTone('wood'); });
  document.querySelector<HTMLInputElement>('#cord')?.addEventListener('input', (event) => { setState({ ...state, cordTension: Number((event.target as HTMLInputElement).value), failure: state.failure === 'loose-cord' ? null : state.failure, phase: state.phase === 'failed' ? 'exploring' : state.phase }); playTone('thread'); });
  document.querySelector('#place')?.addEventListener('click', () => { setState({ ...state, marblePlaced: true, failure: null, phase: 'ready' }); playTone('marble'); });
  document.querySelector('#release')?.addEventListener('click', () => { if (!state.marblePlaced) return; if (!isRampAligned()) setState({ ...state, phase: 'failed', failure: 'marble-miss', marblePlaced: false }); else if (!isCordTense()) setState({ ...state, phase: 'failed', failure: 'loose-cord', marblePlaced: false }); else setState({ ...state, phase: 'complete', failure: null, marblePlaced: false, causalEventId: state.causalEventId + 1 }); playTone(isRampAligned() ? (isCordTense() ? 'wake' : 'loose') : 'miss'); });
  document.querySelector('#recover')?.addEventListener('click', () => setState({ ...state, failure: null, phase: 'exploring' }));
  document.querySelector('#replay')?.addEventListener('click', () => setState({ ...state, phase: 'complete', causalEventId: state.causalEventId + 1, replayCount: state.replayCount + 1 }));
  document.querySelector('#reset')?.addEventListener('click', () => { setState({ ...initial }); playTone('reset'); });
  document.querySelector('#question')?.addEventListener('click', () => setState({ ...state, questionUsed: true }));
}
render();
