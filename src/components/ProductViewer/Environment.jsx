/**
 * Environment Component
 * 
 * CORE THREE.JS CONCEPTS:
 * 
 * 1. Scene Fog (`<fog />`):
 *    Fog gradually blends distant geometry into the background color.
 *    Linear fog uses `[color, nearDistance, farDistance]`, creating subtle atmospheric
 *    depth without needing heavy volumetric rendering shaders.
 * 
 * 2. Physically Based Rendering (PBR) & Ambient Radiance:
 *    Three.js MeshStandardMaterial responds to lighting using PBR principles (conservation of energy,
 *    Fresnel reflections, microfacet distribution). By providing matching ambient tinting and
 *    directional lighting, the materials look tactile and grounded in their environment.
 */
export function SceneEnvironment({ environment }) {
  const { lighting } = environment;

  return (
    <>
      {/* Subtle depth fog matching ambient atmosphere */}
      <fog attach="fog" args={[lighting.ambient.color, 12, 35]} />
    </>
  );
}
