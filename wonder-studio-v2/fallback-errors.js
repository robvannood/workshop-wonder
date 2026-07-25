(() => {
  const enginePattern = /jsdelivr|three(?:\.module)?|rapier|app\.js|runtime-|webgl|webassembly|wasm/i;
  function openFallback(message) {
    const start = window.startWorkshopFallback;
    if (typeof start === 'function') start(message || 'The larger 3D engine could not start.');
  }
  window.addEventListener('error', event => {
    const detail = `${event.message || ''} ${event.filename || ''}`;
    if (enginePattern.test(detail)) openFallback(detail.trim());
  }, true);
  window.addEventListener('unhandledrejection', event => {
    const detail = String(event.reason?.message || event.reason || '');
    if (enginePattern.test(detail)) openFallback(detail);
  });
})();