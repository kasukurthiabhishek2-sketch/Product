import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

/**
 * CameraController Component
 * 
 * CORE THREE.JS CAMERA & CONTROLS CONCEPTS:
 * 
 * 1. PerspectiveCamera:
 *    Simulates human eye perception where objects farther away appear smaller.
 *    Key parameters:
 *    - Field of View (FOV): The vertical visual angle in degrees (e.g., 45°).
 *    - Aspect Ratio: viewport width / height.
 *    - Near & Far clipping planes: only objects between near (0.1) and far (1000) are rendered.
 * 
 * 2. Mathematical Automatic Model Framing:
 *    How do we ensure any 3D model (whether 10 cm or 10 meters) fits perfectly in view?
 *    Using basic trigonometry on the camera's frustum:
 *    - `fovInRadians = camera.fov * (Math.PI / 180)`
 *    - `distance = (maxDimension / 2) / Math.tan(fovInRadians / 2)`
 *    Multiplying by a 1.4-1.6 framing factor leaves comfortable visual breathing room around the product.
 * 
 * 3. OrbitControls & Damping:
 *    OrbitControls rotates the camera in spherical coordinates (radius, theta, phi) around a `target` vector.
 *    - Damping (`enableDamping = true`): adds simulated physical inertia so rotation decelerates
 *      organically instead of stopping abruptly.
 *    - Polar Angle Clamping: `maxPolarAngle = Math.PI / 2` prevents the camera from dipping beneath
 *      the ground plane, ensuring the viewer never sees an awkward underside void.
 *    - Distance Clamping: `minDistance` and `maxDistance` prevent the user from zooming infinitely
 *      into the mesh or losing the product into outer space.
 */
export function CameraController({
  isAutoRotating = false,
  resetTrigger = 0,
  bounds = null
}) {
  const { camera } = useThree();
  const controlsRef = useRef();

  /**
   * Automatic Framing Effect
   * 
   * Triggers whenever the model finishes loading (bounds ready)
   * or when the user clicks the "Reset View" button.
   */
  useEffect(() => {
    if (!bounds || !controlsRef.current) return;

    const { center, maxDim } = bounds;

    // Convert camera vertical Field Of View (FOV) from degrees to radians
    const fovInRadians = (camera.fov * Math.PI) / 180;

    // Calculate ideal distance to fit the bounding sphere inside the camera frustum
    // We add a 1.45 padding factor so the product is comfortably framed
    const fitDistance = (maxDim / (2 * Math.tan(fovInRadians / 2))) * 1.45;

    // Set OrbitControls target to the center of the model (orbit pivot)
    controlsRef.current.target.set(center.x, center.y, center.z);

    // Position camera at an attractive 3/4 isometric perspective:
    // Slightly elevated (0.4 * distance), angled diagonally
    const targetCamX = center.x + fitDistance * 0.75;
    const targetCamY = center.y + fitDistance * 0.4;
    const targetCamZ = center.z + fitDistance * 1.1;

    camera.position.set(targetCamX, targetCamY, targetCamZ);
    camera.lookAt(center.x, center.y, center.z);

    // Dynamic zoom boundaries based on calculated model scale
    controlsRef.current.minDistance = fitDistance * 0.45;
    controlsRef.current.maxDistance = fitDistance * 3.0;

    controlsRef.current.update();
  }, [bounds, resetTrigger, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      // Inertial damping creates a smooth, premium weight when dragging
      enableDamping={true}
      dampingFactor={0.06}
      // Prevent flipping upside down or dipping beneath the floor plane
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2 + 0.04}
      // Turntable presentation rotation
      autoRotate={isAutoRotating}
      autoRotateSpeed={1.4}
      // Pan controls with right-click or two fingers
      enablePan={true}
      panSpeed={0.8}
      // Zoom controls with wheel or pinch
      enableZoom={true}
      zoomSpeed={0.9}
    />
  );
}
