/**
 * Environment & Lighting Presets Configuration
 * 
 * In Three.js and real-world 3D presentation, changing an "environment" must NOT
 * simply change a CSS background color. True environmental realism comes from:
 * 
 * 1. Ambient Light: The baseline non-directional light reflecting off atmosphere/walls.
 * 2. Key Light (Directional): Simulating the primary light source (e.g. sun or studio softbox)
 *    casting realistic shadows with configurable position, color, and intensity.
 * 3. Fill Light: Counterbalancing harsh contrast on the shadowed side of the model.
 * 4. Rim / Back Light: Highlighting the silhouette of the chair from behind.
 * 5. Ground Shadow: Grounding the 3D model with contact occlusion.
 * 6. Scene Background: Gradient styling harmonized with the lighting mood.
 * 
 * By driving lighting from this configuration object, adding new presets
 * (e.g., Cyberpunk Neon, Sunset Beach, Gallery White) takes seconds!
 */

export const environments = {
  studio: {
    id: 'studio',
    name: 'Studio Minimal',
    tagline: 'Neutral Balanced Photography',
    icon: 'studio',
    backgroundGradient: 'radial-gradient(circle at 50% 35%, #242933 0%, #0d0f14 100%)',
    uiCardTheme: 'rgba(25, 29, 38, 0.75)',
    // Lighting parameters consumed by <Lighting /> component
    lighting: {
      ambient: {
        color: '#ffffff',
        intensity: 0.85
      },
      keyLight: {
        color: '#ffffff',
        intensity: 1.8,
        position: [4, 7, 5],
        castShadow: true,
        shadowBias: -0.0001
      },
      fillLight: {
        color: '#93c5fd', // Soft cool fill to balance shadows
        intensity: 0.65,
        position: [-5, 3, -3]
      },
      rimLight: {
        color: '#ffffff',
        intensity: 1.1,
        position: [0, 5, -6]
      }
    },
    ground: {
      shadowOpacity: 0.55,
      pedestalColor: '#1a1f28'
    }
  },

  outdoor: {
    id: 'outdoor',

    name: 'Natural Daylight',

    tagline: 'Bright Open-Air Sunlight',

    icon: 'sun',

    // Bright sky / outdoor environment
    backgroundGradient:
      'linear-gradient(180deg, #87CEEB 0%, #BFE7F5 45%, #E8F4F1 72%, #D6D3C8 100%)',

    // Slightly translucent white card works better against the bright environment
    uiCardTheme: 'rgba(255, 255, 255, 0.82)',

    lighting: {

      // General illumination coming from the sky
      ambient: {
        color: '#DDF4FF',
        intensity: 1.15
      },

      // Main sunlight
      keyLight: {
        color: '#FFF4D6',
        intensity: 3.2,
        position: [6, 10, 5],
        castShadow: true,
        shadowBias: -0.00015,

        // If your setup supports these:
        shadowMapSize: 2048,
        shadowRadius: 6
      },

      // Blue skylight bouncing onto the shadow side
      fillLight: {
        color: '#9DD7FF',
        intensity: 1.15,
        position: [-6, 5, -3]
      },

      // Subtle warm edge separation
      rimLight: {
        color: '#FFE0B2',
        intensity: 1.0,
        position: [-4, 7, -6]
      },

      // Optional softer secondary sunlight
      bounceLight: {
        color: '#FFF1CC',
        intensity: 0.45,
        position: [2, 3, -5]
      }
    },

    ground: {

      // Soft but visible contact shadow
      shadowOpacity: 0.38,

      // Neutral outdoor ground rather than dark studio flooring
      pedestalColor: '#D8D4C8'
    }
  },

  interior: {
    id: 'interior',
    name: 'Warm Lounge',
    tagline: 'Cozy Architectural Ambience',
    icon: 'lamp',
    backgroundGradient: 'radial-gradient(ellipse at 50% 35%, #332219 0%, #120a06 100%)',
    uiCardTheme: 'rgba(38, 26, 20, 0.75)',
    lighting: {
      ambient: {
        color: '#fed7aa', // Warm incandescent ambient
        intensity: 0.9
      },
      keyLight: {
        color: '#ffedd5', // Soft warm pendant light
        intensity: 1.9,
        position: [3, 8, 3],
        castShadow: true,
        shadowBias: -0.0001
      },
      fillLight: {
        color: '#ca8a04', // Rich warm bounce
        intensity: 0.7,
        position: [-4, 2, -3]
      },
      rimLight: {
        color: '#f97316', // Amber accent light
        intensity: 1.3,
        position: [4, 4, -5]
      }
    },
    ground: {
      shadowOpacity: 0.6,
      pedestalColor: '#1f130d'
    }
  }
};

export const defaultEnvironmentKey = 'studio';
