import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Lighting({ environment, selectedColor }) {
  const { lighting } = environment;

  const ambientRef = useRef();
  const keyLightRef = useRef();
  const fillLightRef = useRef();
  const rimLightRef = useRef();
  const hemiLightRef = useRef();

  // Reduce intensity on white to prevent specular burnout
  const brightnessFactor = useMemo(() => {
    if (environment.id === "outdoor" && selectedColor?.id === "white") return 0.85;
    if (selectedColor?.id === "white") return 0.92;
    return 1.0;
  }, [environment.id, selectedColor?.id]);

  const targets = useMemo(
    () => ({
      ambient: new THREE.Color(lighting.ambient.color),
      key: new THREE.Color(lighting.keyLight.color),
      fill: new THREE.Color(lighting.fillLight.color),
      rim: new THREE.Color(lighting.rimLight.color),
      hemiSky: new THREE.Color(lighting.hemisphere?.skyColor || lighting.ambient.color),
      hemiGround: new THREE.Color(lighting.hemisphere?.groundColor || "#222222"),
    }),
    [lighting]
  );

  useEffect(() => {
    if (keyLightRef.current?.shadow)
      keyLightRef.current.shadow.bias = lighting.keyLight.shadowBias || -0.0001;
    if (fillLightRef.current?.shadow)
      fillLightRef.current.shadow.bias = lighting.fillLight.shadowBias || -0.0001;
  }, [lighting]);

  // Smooth interpolation between environments
  useFrame((_, delta) => {
    const rate = Math.min(delta * 5.5, 1);

    if (ambientRef.current) {
      ambientRef.current.color.lerp(targets.ambient, rate);
      ambientRef.current.intensity = THREE.MathUtils.damp(
        ambientRef.current.intensity,
        lighting.ambient.intensity * brightnessFactor,
        5.5, delta
      );
    }

    if (hemiLightRef.current && lighting.hemisphere) {
      hemiLightRef.current.color.lerp(targets.hemiSky, rate);
      hemiLightRef.current.groundColor.lerp(targets.hemiGround, rate);
      hemiLightRef.current.intensity = THREE.MathUtils.damp(
        hemiLightRef.current.intensity,
        lighting.hemisphere.intensity * brightnessFactor,
        5.5, delta
      );
    }

    if (keyLightRef.current) {
      keyLightRef.current.color.lerp(targets.key, rate);
      keyLightRef.current.intensity = THREE.MathUtils.damp(
        keyLightRef.current.intensity,
        lighting.keyLight.intensity * brightnessFactor,
        5.5, delta
      );
      const [kx, ky, kz] = lighting.keyLight.position;
      keyLightRef.current.position.x = THREE.MathUtils.damp(keyLightRef.current.position.x, kx, 5.5, delta);
      keyLightRef.current.position.y = THREE.MathUtils.damp(keyLightRef.current.position.y, ky, 5.5, delta);
      keyLightRef.current.position.z = THREE.MathUtils.damp(keyLightRef.current.position.z, kz, 5.5, delta);
    }

    if (fillLightRef.current) {
      fillLightRef.current.color.lerp(targets.fill, rate);
      fillLightRef.current.intensity = THREE.MathUtils.damp(
        fillLightRef.current.intensity,
        lighting.fillLight.intensity * brightnessFactor,
        5.5, delta
      );
      const [fx, fy, fz] = lighting.fillLight.position;
      fillLightRef.current.position.x = THREE.MathUtils.damp(fillLightRef.current.position.x, fx, 5.5, delta);
      fillLightRef.current.position.y = THREE.MathUtils.damp(fillLightRef.current.position.y, fy, 5.5, delta);
      fillLightRef.current.position.z = THREE.MathUtils.damp(fillLightRef.current.position.z, fz, 5.5, delta);
    }

    if (rimLightRef.current) {
      rimLightRef.current.color.lerp(targets.rim, rate);
      rimLightRef.current.intensity = THREE.MathUtils.damp(
        rimLightRef.current.intensity,
        lighting.rimLight.intensity * brightnessFactor,
        5.5, delta
      );
      const [rx, ry, rz] = lighting.rimLight.position;
      rimLightRef.current.position.x = THREE.MathUtils.damp(rimLightRef.current.position.x, rx, 5.5, delta);
      rimLightRef.current.position.y = THREE.MathUtils.damp(rimLightRef.current.position.y, ry, 5.5, delta);
      rimLightRef.current.position.z = THREE.MathUtils.damp(rimLightRef.current.position.z, rz, 5.5, delta);
    }
  });

  return (
    <group>
      <ambientLight
        ref={ambientRef}
        color={lighting.ambient.color}
        intensity={lighting.ambient.intensity * brightnessFactor}
      />

      {lighting.hemisphere && (
        <hemisphereLight
          ref={hemiLightRef}
          color={lighting.hemisphere.skyColor}
          groundColor={lighting.hemisphere.groundColor}
          intensity={lighting.hemisphere.intensity * brightnessFactor}
        />
      )}

      <directionalLight
        ref={keyLightRef}
        position={lighting.keyLight.position}
        color={lighting.keyLight.color}
        intensity={lighting.keyLight.intensity * brightnessFactor}
        castShadow={Boolean(lighting.keyLight.castShadow)}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1.0}
        shadow-camera-far={20}
        shadow-camera-left={-2.2}
        shadow-camera-right={2.2}
        shadow-camera-top={2.2}
        shadow-camera-bottom={-2.2}
        shadow-bias={lighting.keyLight.shadowBias || -0.0001}
      />

      <directionalLight
        ref={fillLightRef}
        position={lighting.fillLight.position}
        color={lighting.fillLight.color}
        intensity={lighting.fillLight.intensity * brightnessFactor}
        castShadow={Boolean(lighting.fillLight.castShadow)}
      />

      <directionalLight
        ref={rimLightRef}
        position={lighting.rimLight.position}
        color={lighting.rimLight.color}
        intensity={lighting.rimLight.intensity * brightnessFactor}
      />
    </group>
  );
}
