/**
 * Product Configuration Data
 * 
 * In modern 3D configurator architecture, separating product metadata and
 * customization options from the rendering components keeps the application
 * modular, maintainable, and data-driven.
 * 
 * If you want to configure a different product in the future, you only need
 * to update this configuration file without rewriting the 3D viewer components!
 */

export const productDetails = {
  id: 'chair',
  name: 'LOUNGE CHAIR',
  tagline: 'Signature Edition',
  subtitle: 'Ergonomic curves sculpted with luxury tactile velvet and solid hardwood.',
  designer: 'Studio Antigravity & Atelier Nord',
  modelPath: '/models/product.glb',
  dimensions: '82 cm (W) × 88 cm (D) × 76 cm (H)',
  weight: '14.2 kg',
  materials: {
    upholstery: 'Mystere Micro-Sheen Velvet',
    frame: 'Hand-rubbed Solid American Walnut',
    hardware: 'Brushed Matte Gunmetal Steel'
  },
  // Target mesh name in the GLB hierarchy whose material color is customizable.
  // Using a matcher function ensures flexibility if the GLB structure varies.
  targetMeshMatcher: (mesh) => {
    const name = (mesh.name || '').toLowerCase();
    const matName = (mesh.material?.name || '').toLowerCase();
    return name.includes('fabric') || matName.includes('fabric') || name === 'sheenchair_fabric';
  }
};

/**
 * Curated color palette for the velvet upholstery.
 * 
 * Each color contains:
 * - id: unique identifier for React key & state
 * - name: human-readable luxury shade name
 * - hex: Three.js compatible hex color string
 * - accent: complimentary border/glow color for the UI swatch
 * - description: tactile narrative for the UI preview
 */
export const productColors = [
  {
    id: 'obsidian',
    name: 'Obsidian Velvet',
    hex: '#18181b',
    accent: '#52525b',
    description: 'Deep, dramatic midnight black with subtle lustrous highlights.'
  },
  {
    id: 'ivory',
    name: 'Ivory Cream',
    hex: '#ede8df',
    accent: '#d4cfc5',
    description: 'Warm, timeless neutral tone offering refined architectural poise.'
  },
  {
    id: 'crimson',
    name: 'Royal Crimson',
    hex: '#881337',
    accent: '#be123c',
    description: 'Rich burgundy wine with regal depth and warm undertones.'
  },
  {
    id: 'navy',
    name: 'Midnight Navy',
    hex: '#1e3a8a',
    accent: '#2563eb',
    description: 'Sophisticated deep oceanic blue with an intimate presence.'
  }
];

export const defaultColor = productColors[0];
