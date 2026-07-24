export const CATALOG = {
  panel: {
    label: 'Cardboard panel', kind: 'structure', shape: 'box', size: [1.65, 0.12, 1.05], mass: 0.9,
    color: 0xa66d3d, roughness: 1, restitution: 0.08, friction: 0.86,
    connectors: [
      { p: [-0.75, 0, 0], type: 'fixed' }, { p: [0.75, 0, 0], type: 'fixed' },
      { p: [0, 0, -0.47], type: 'hinge' }, { p: [0, 0, 0.47], type: 'hinge' }
    ]
  },
  beam: {
    label: 'Wooden beam', kind: 'structure', shape: 'box', size: [2.2, 0.18, 0.28], mass: 2.3,
    color: 0x765036, roughness: 0.87, restitution: 0.08, friction: 0.78,
    connectors: [
      { p: [-1.03, 0, 0], type: 'fixed' }, { p: [1.03, 0, 0], type: 'fixed' },
      { p: [0, 0, 0], type: 'axleSocket' }, { p: [0, 0, 0.14], type: 'ropeHook' }
    ]
  },
  rod: {
    label: 'Bamboo rod', kind: 'structure', shape: 'cylinder', radius: 0.095, height: 2.25, mass: 0.7,
    color: 0xb29a5e, roughness: 0.83, restitution: 0.12, friction: 0.7,
    connectors: [
      { p: [0, -1.07, 0], type: 'fixed' }, { p: [0, 1.07, 0], type: 'fixed' },
      { p: [0, 0, 0], type: 'ropeHook' }
    ]
  },
  wheel: {
    label: 'Brass wheel', kind: 'motion', shape: 'wheel', radius: 0.58, thickness: 0.19, mass: 2.1,
    color: 0xb38743, roughness: 0.43, metalness: 0.62, restitution: 0.16, friction: 0.63,
    connectors: [{ p: [0, 0, 0], type: 'axle' }]
  },
  ball: {
    label: 'Glass marble', kind: 'motion', shape: 'sphere', radius: 0.24, mass: 0.65,
    color: 0x5d8791, roughness: 0.18, metalness: 0.08, restitution: 0.46, friction: 0.26,
    connectors: []
  },
  weight: {
    label: 'Iron counterweight', kind: 'force', shape: 'box', size: [0.58, 0.78, 0.5], mass: 6.2,
    color: 0x3f403d, roughness: 0.58, metalness: 0.72, restitution: 0.05, friction: 0.8,
    connectors: [{ p: [0, 0.43, 0], type: 'ropeHook' }, { p: [0, -0.43, 0], type: 'fixed' }]
  },
  ropeEnd: {
    label: 'Rope connector', kind: 'force', shape: 'sphere', radius: 0.14, mass: 0.22,
    color: 0xbda77d, roughness: 1, restitution: 0.04, friction: 0.94,
    connectors: [{ p: [0, 0, 0], type: 'rope' }]
  },
  mirror: {
    label: 'Aged mirror', kind: 'light', shape: 'box', size: [0.92, 0.08, 1.12], mass: 1.2,
    color: 0xb9d0cd, roughness: 0.13, metalness: 0.22, opacity: 0.72,
    restitution: 0.06, friction: 0.58,
    connectors: [{ p: [0, -0.08, 0], type: 'fixed' }]
  },
  prism: {
    label: 'Glass prism', kind: 'light', shape: 'prism', radius: 0.44, height: 1.05, mass: 1.3,
    color: 0x9dc8c5, roughness: 0.12, metalness: 0.04, opacity: 0.56,
    restitution: 0.11, friction: 0.42, connectors: []
  },
  filterRed: {
    label: 'Red filter', kind: 'light', shape: 'box', size: [0.84, 0.06, 1.05], mass: 0.42,
    color: 0xa83f2f, roughness: 0.2, opacity: 0.56, restitution: 0.08, friction: 0.52, connectors: []
  },
  filterBlue: {
    label: 'Blue filter', kind: 'light', shape: 'box', size: [0.84, 0.06, 1.05], mass: 0.42,
    color: 0x376e8a, roughness: 0.2, opacity: 0.56, restitution: 0.08, friction: 0.52, connectors: []
  },
  bell: {
    label: 'Small bell', kind: 'sound', shape: 'bell', radius: 0.38, height: 0.7, mass: 1.1,
    color: 0xb38743, roughness: 0.4, metalness: 0.7, restitution: 0.12, friction: 0.55,
    connectors: [{ p: [0, 0.42, 0], type: 'ropeHook' }, { p: [0, -0.38, 0], type: 'fixed' }]
  }
};

export const STARTING_COMPONENTS = [
  ['panel', [-3.6, 3.0, 2.4], [0, 0.12, 0.02]],
  ['panel', [-2.0, 3.02, 2.7], [0, -0.18, -0.02]],
  ['beam', [-0.25, 3.05, 1.65], [0, 0.2, 0]],
  ['beam', [0.5, 3.06, 3.0], [0, -0.22, 0]],
  ['rod', [1.75, 3.35, 2.5], [Math.PI / 2, 0, 0.22]],
  ['wheel', [-0.55, 3.2, 3.8], [Math.PI / 2, 0, 0]],
  ['ball', [-3.9, 3.25, 1.4], [0, 0, 0]],
  ['weight', [2.55, 3.25, 1.6], [0, 0.08, 0]],
  ['ropeEnd', [2.0, 3.18, 3.9], [0, 0, 0]],
  ['ropeEnd', [2.45, 3.18, 4.05], [0, 0, 0]],
  ['mirror', [7.25, 2.4, 3.25], [0, 0.22, 0]],
  ['prism', [8.4, 2.55, 3.5], [Math.PI / 2, 0, 0.2]],
  ['filterRed', [9.35, 2.45, 4.05], [0, 0.1, 0]],
  ['filterBlue', [9.35, 2.47, 2.75], [0, -0.18, 0]],
  ['bell', [-9.1, 2.65, 3.2], [Math.PI, 0, 0]]
];

export function compatibleConnector(a, b) {
  const pair = new Set([a, b]);
  if (pair.has('axle') && pair.has('axleSocket')) return 'revolute';
  if (pair.has('rope') && pair.has('ropeHook')) return 'rope';
  if (a === 'hinge' && b === 'hinge') return 'hinge';
  if ((a === 'fixed' || a === 'hinge') && (b === 'fixed' || b === 'hinge')) return 'fixed';
  return null;
}
