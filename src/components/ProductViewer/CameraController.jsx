import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function computeDefaultPosition(fitDistance, center) {
  return new THREE.Vector3(
    center.x + fitDistance * 0.72,
    center.y + fitDistance * 0.4,
    center.z + fitDistance * 1.05
  );
}

export function CameraController({
  isAutoRotating = false,
  resetTrigger = 0,
  bounds = null,
}) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const isTransitioningRef = useRef(false);
  const targetPosRef = useRef(new THREE.Vector3());
  const lastResetRef = useRef(resetTrigger);
  const initializedRef = useRef(false);

  // Frame model on initial load
  useEffect(() => {
    if (!bounds || !controlsRef.current) return;

    const { center, maxDim } = bounds;
    const fovRad = (camera.fov * Math.PI) / 180;
    const fitDistance = (maxDim / (2 * Math.tan(fovRad / 2))) * 1.48;

    controlsRef.current.target.set(center.x, center.y, center.z);
    controlsRef.current.minDistance = fitDistance * 0.45;
    controlsRef.current.maxDistance = fitDistance * 2.8;

    const pos = computeDefaultPosition(fitDistance, center);
    targetPosRef.current.copy(pos);

    if (!initializedRef.current) {
      camera.position.copy(pos);
      camera.lookAt(center.x, center.y, center.z);
      controlsRef.current.update();
      initializedRef.current = true;
    }
  }, [bounds, camera]);

  // Animated reset
  useEffect(() => {
    if (!bounds || !controlsRef.current || resetTrigger === 0) return;
    if (resetTrigger === lastResetRef.current) return;

    lastResetRef.current = resetTrigger;
    const { center, maxDim } = bounds;
    const fovRad = (camera.fov * Math.PI) / 180;
    const fitDistance = (maxDim / (2 * Math.tan(fovRad / 2))) * 1.48;

    controlsRef.current.target.set(center.x, center.y, center.z);
    targetPosRef.current.copy(computeDefaultPosition(fitDistance, center));
    isTransitioningRef.current = true;
  }, [resetTrigger, bounds, camera]);

  // Smooth camera transition
  useFrame((state, delta) => {
    if (!isTransitioningRef.current || !bounds || !controlsRef.current) return;

    const cam = state.camera;
    const target = targetPosRef.current;

    cam.position.x = THREE.MathUtils.damp(cam.position.x, target.x, 6, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, target.y, 6, delta);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, target.z, 6, delta);

    controlsRef.current.target.set(bounds.center.x, bounds.center.y, bounds.center.z);
    controlsRef.current.update();

    if (cam.position.distanceTo(target) < 0.005) {
      cam.position.copy(target);
      isTransitioningRef.current = false;
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI / 2 - 0.02}
      autoRotate={isAutoRotating}
      autoRotateSpeed={1.2}
      enablePan
      panSpeed={0.7}
      enableZoom
      zoomSpeed={0.85}
      onStart={() => { isTransitioningRef.current = false; }}
    />
  );
}
