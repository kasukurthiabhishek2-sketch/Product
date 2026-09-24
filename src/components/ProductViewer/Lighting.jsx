import { useRef } from 'react';

/**
 * Lighting Component
 * 
 * CORE THREE.JS LIGHTING CONCEPTS:
 * 
 * In real-world cinematography and 3D product photography, professional lighting
 * relies on a "Three-Point Lighting" setup:
 * 
 * 1. Ambient Light (`<ambientLight />`):
 *    Provides uniform, non-directional illumination to every face in the scene.
 *    Without ambient light, any surface facing away from a directional light would be
 *    pitch black (like shadows in deep space).
 * 
 * 2. Key Light (`<directionalLight />`):
 *    The primary light source that establishes highlights and casts shadows.
 *    Directional lights emit parallel light rays (like the sun or a large studio softbox).
 *    Configuring `castShadow={true}` instructs Three.js to render a depth map (shadow map)
 *    from this light's perspective.
 * 
 * 3. Fill Light (`<directionalLight />`):
 *    Placed opposite the key light to gently illuminate shadowed crevices.
 *    In our configurator, the fill light is subtly tinted (e.g. soft sky blue in Daylight,
 *    warm amber in Lounge) to simulate realistic ambient bounced radiosity.
 * 
 * 4. Rim / Back Light (`<directionalLight />` or `<pointLight />`):
 *    Placed behind the product facing towards the camera.
 *    It grazes the outer silhouette of the chair, creating a subtle specular rim edge
 *    that separates the dark chair silhouette from the dark background.
 * 
 * When the user switches environments (Studio <-> Outdoor <-> Interior), these light
 * intensities and colors update dynamically, completely changing the emotional mood!
 */
export function Lighting({ environment }) {
  const { lighting } = environment;
  const keyLightRef = useRef();

  return (
    <group>
      {/* 1. Base Ambient Illumination */}
      <ambientLight
        color={lighting.ambient.color}
        intensity={lighting.ambient.intensity}
      />

      {/* 2. Key Light (Primary directional light casting soft shadows) */}
      <directionalLight
        ref={keyLightRef}
        position={lighting.keyLight.position}
        color={lighting.keyLight.color}
        intensity={lighting.keyLight.intensity}
        castShadow={lighting.keyLight.castShadow}
        // Shadow map resolution for crisp yet soft contact edges
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        // Shadow camera frustum bounds
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-2.5}
        shadow-camera-right={2.5}
        shadow-camera-top={2.5}
        shadow-camera-bottom={-2.5}
        // Shadow bias prevents shadow acne (self-shadowing artifacts on curved surfaces)
        shadow-bias={lighting.keyLight.shadowBias || -0.0001}
      />

      {/* 3. Fill Light (Opposite side, softening dark shadow areas) */}
      <directionalLight
        position={lighting.fillLight.position}
        color={lighting.fillLight.color}
        intensity={lighting.fillLight.intensity}
      />

      {/* 4. Rim Light (Backlight for edge separation and velvet sheen) */}
      <directionalLight
        position={lighting.rimLight.position}
        color={lighting.rimLight.color}
        intensity={lighting.rimLight.intensity}
      />
    </group>
  );
}
