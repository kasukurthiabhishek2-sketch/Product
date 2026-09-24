import { useMemo } from "react";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// --- Studio cyclorama geometry ---

function createCycloramaGeometry(floorHex) {
  const radialSegments = 72;
  const heightSegments = 36;

  const rFlat = 4.2;
  const rCurveEnd = 8.5;
  const rWallTop = 10.5;
  const yCurveEnd = 3.6;
  const yWallTop = 14.0;

  const colFloor = new THREE.Color(floorHex);
  const colWall = new THREE.Color("#1B1D21");
  const colWallTop = new THREE.Color("#14161A");

  const positions = [];
  const colors = [];
  const uvs = [];
  const indices = [];

  // Center vertex
  positions.push(0, -0.002, 0);
  colors.push(colFloor.r, colFloor.g, colFloor.b);
  uvs.push(0.5, 0.5);

  for (let j = 1; j <= heightSegments; j++) {
    const v = j / heightSegments;
    let r, y;
    const col = new THREE.Color();

    if (v <= 0.35) {
      const t = v / 0.35;
      r = t * rFlat;
      y = -0.002;
      col.copy(colFloor);
    } else if (v <= 0.75) {
      // Smooth fillet from floor to wall
      const t = (v - 0.35) / 0.4;
      const angle = t * (Math.PI / 2);
      r = rFlat + (rCurveEnd - rFlat) * Math.sin(angle);
      y = -0.002 + yCurveEnd * (1 - Math.cos(angle));
      const smoothT = t * t * (3 - 2 * t);
      col.lerpColors(colFloor, colWall, smoothT);
    } else {
      const t = (v - 0.75) / 0.25;
      r = rCurveEnd + (rWallTop - rCurveEnd) * t;
      y = yCurveEnd + (yWallTop - yCurveEnd) * t;
      col.lerpColors(colWall, colWallTop, t);
    }

    for (let i = 0; i < radialSegments; i++) {
      const u = i / radialSegments;
      const theta = u * Math.PI * 2;
      positions.push(r * Math.sin(theta), y, r * Math.cos(theta));
      colors.push(col.r, col.g, col.b);
      uvs.push(u, v);
    }
  }

  // Center fan indices
  for (let i = 0; i < radialSegments; i++) {
    indices.push(0, 1 + i, 1 + ((i + 1) % radialSegments));
  }

  // Ring-to-ring indices
  for (let j = 1; j < heightSegments; j++) {
    const rowA = 1 + (j - 1) * radialSegments;
    const rowB = 1 + j * radialSegments;
    for (let i = 0; i < radialSegments; i++) {
      const next = (i + 1) % radialSegments;
      indices.push(rowA + i, rowB + i, rowA + next);
      indices.push(rowB + i, rowB + next, rowA + next);
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

function StudioBackdrop({ floorColor = "#35342F" }) {
  const geometry = useMemo(
    () => createCycloramaGeometry(floorColor),
    [floorColor]
  );

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        vertexColors
        roughness={0.92}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// --- Outdoor scenery data (static, never changes) ---

const MOUNTAINS = [
  { position: [-26, 3.2, -50], radius: 18, height: 11, segments: 7, color: "#889eaf" },
  { position: [-10, 4.5, -46], radius: 21, height: 13, segments: 8, color: "#7e94a5" },
  { position: [8, 3.8, -48], radius: 19, height: 12, segments: 7, color: "#8399aa" },
  { position: [25, 2.9, -52], radius: 16, height: 10, segments: 7, color: "#8c9fb0" },
  { position: [42, 2.2, -56], radius: 14, height: 9, segments: 6, color: "#93a6b5" },
];

const TREES = [
  { position: [-13, 0, -22], scale: 1.1 },
  { position: [-9, 0, -30], scale: 0.95 },
  { position: [13, 0, -24], scale: 1.05 },
  { position: [18, 0, -32], scale: 0.9 },
];

function OutdoorScenery() {
  return (
    <group>
      <group position={[0, -2, 0]}>
        {MOUNTAINS.map((m, i) => (
          <mesh key={i} position={m.position}>
            <coneGeometry args={[m.radius, m.height, m.segments]} />
            <meshStandardMaterial
              color={m.color}
              roughness={0.96}
              metalness={0.02}
              flatShading
            />
          </mesh>
        ))}
      </group>

      <group>
        {TREES.map((t, i) => (
          <group key={i} position={t.position} scale={t.scale}>
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.07, 0.12, 2.4, 6]} />
              <meshStandardMaterial color="#352f2a" roughness={0.95} />
            </mesh>
            <mesh position={[0, 2.4, 0]}>
              <coneGeometry args={[0.75, 2.2, 7]} />
              <meshStandardMaterial color="#3a483c" roughness={0.92} flatShading />
            </mesh>
            <mesh position={[0, 3.6, 0]}>
              <coneGeometry args={[0.55, 1.9, 7]} />
              <meshStandardMaterial color="#435446" roughness={0.92} flatShading />
            </mesh>
            <mesh position={[0, 4.6, 0]}>
              <coneGeometry args={[0.35, 1.4, 7]} />
              <meshStandardMaterial color="#4c5e4f" roughness={0.92} flatShading />
            </mesh>
          </group>
        ))}
      </group>

      <mesh position={[0, -0.01, -16]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[70, 0.15]} />
        <meshStandardMaterial color="#b8b2a5" roughness={0.9} />
      </mesh>
    </group>
  );
}

// --- Fog config per environment ---

const FOG_CONFIG = {
  outdoor: { color: "#b9d2e0", near: 22, far: 72 },
  studio: { color: "#14161a", near: 24, far: 55 },
};

// --- Ground (contact shadows + floor surfaces) ---

function Ground({ environment }) {
  const { ground, id } = environment;

  if (id === "studio") {
    return (
      <>
        <StudioBackdrop floorColor={ground.floorColor} />
        {ground.shadowOpacity > 0 && (
          <ContactShadows
            position={[0, 0, 0]}
            opacity={ground.shadowOpacity}
            scale={4.4}
            blur={2.8}
            far={2.2}
            resolution={1024}
            color="#141518"
          />
        )}
      </>
    );
  }

  if (id === "outdoor") {
    return (
      <>
        {ground.shadowOpacity > 0 && (
          <ContactShadows
            position={[0, 0, 0]}
            opacity={ground.shadowOpacity}
            scale={4.2}
            blur={2.0}
            far={2.2}
            resolution={1024}
            color="#1a222a"
          />
        )}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.002, 0]}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial
            color={ground.floorColor || "#d8d3c8"}
            roughness={0.92}
            metalness={0.02}
          />
        </mesh>
      </>
    );
  }

  return null;
}

// --- Main export ---

export function SceneEnvironment({ environment }) {
  const fog = FOG_CONFIG[environment.id] || FOG_CONFIG.studio;

  return (
    <>
      <fog attach="fog" args={[fog.color, fog.near, fog.far]} />
      {environment.id === "outdoor" && <OutdoorScenery />}
      <Ground environment={environment} />
    </>
  );
}
