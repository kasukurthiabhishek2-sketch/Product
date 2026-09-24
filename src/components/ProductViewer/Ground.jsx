import { ContactShadows } from '@react-three/drei';

/**
 * Ground Component
 * 
 * CORE THREE.JS VISUAL POLISH CONCEPTS:
 * 
 * 1. Contact Shadows:
 *    In 3D product rendering, floating objects look unnatural and amateurish.
 *    Traditional directional shadow maps can suffer from jagged shadow edges, bias acne,
 *    and distance fading.
 *    Drei's `<ContactShadows />` renders a dedicated orthographic depth pass from the ground
 *    pointing up, generating a smooth, diffused Ambient Occlusion (AO) contact footprint.
 *    Notice how the shadow is darkest where the chair feet meet the floor, and softly
 *    diffuses further out!
 * 
 * 2. Visual Grounding Pedestal:
 *    A subtle circular ring plane defines a studio display pedestal, giving the product
 *    a physical stage.
 */
export function Ground({ environment }) {
  const { ground } = environment;

  return (
    <group position={[0, -0.001, 0]}>
      {/* Soft Contact Shadow directly beneath chair legs */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={ground.shadowOpacity || 0.6}
        scale={4.5}
        blur={2.2}
        far={2.5}
        resolution={1024}
        color="#000000"
      />

      {/* Subtle Studio Pedestal Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <circleGeometry args={[2.2, 64]} />
        <meshStandardMaterial
          color={ground.pedestalColor || '#181b22'}
          roughness={0.85}
          metalness={0.1}
          transparent={true}
          opacity={0.35}
        />
      </mesh>

      {/* Subtle Outer Accent Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.003, 0]}>
        <ringGeometry args={[2.2, 2.22, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent={true}
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}
