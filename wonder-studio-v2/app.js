import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import RAPIER from 'rapier';
import { CATALOG, STARTING_COMPONENTS, compatibleConnector } from './components.js';

try {
  await RAPIER.init();
  const files = [1, 2, 3, 4, 5, 6, 7];
  const source = (await Promise.all(files.map(async n => {
    const response = await fetch(`./runtime-${n}.txt`);
    if (!response.ok) throw new Error(`Could not load runtime-${n}.txt`);
    return response.text();
  }))).join('');
  new Function('THREE', 'OrbitControls', 'RAPIER', 'CATALOG', 'STARTING_COMPONENTS', 'compatibleConnector', source)(
    THREE, OrbitControls, RAPIER, CATALOG, STARTING_COMPONENTS, compatibleConnector
  );
} catch (error) {
  console.error(error);
  document.getElementById('loading')?.classList.add('hidden');
  document.getElementById('error')?.classList.add('show');
  const message = document.querySelector('#error p');
  if (message) message.textContent = `The construction system could not start: ${error.message}`;
}
