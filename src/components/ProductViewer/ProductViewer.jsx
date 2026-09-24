import { Suspense, useState, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ProductModel } from "./ProductModel";
import { CameraController } from "./CameraController";
import { Lighting } from "./Lighting";
import { SceneEnvironment } from "./Environment";
import { Loader } from "../UI/Loader";
import { ErrorBoundary } from "../UI/ErrorBoundary";

// Configures renderer tone mapping and smoothly transitions exposure between environments.
// gl property mutations are necessary — Three.js renderer is mutable by design.
/* eslint-disable react-hooks/immutability */
function ToneMapping({ exposure = 1.0 }) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
  }, [gl]);

  useFrame((_, delta) => {
    gl.toneMappingExposure = THREE.MathUtils.damp(
      gl.toneMappingExposure,
      exposure,
      4.0,
      delta
    );
  });

  return null;
}
/* eslint-enable react-hooks/immutability */

export function ProductViewer({
  selectedColor,
  environment,
  isAutoRotating,
  resetTrigger,
}) {
  const [modelBounds, setModelBounds] = useState(null);

  return (
    <div className="product-viewer-container" id="product-canvas-container">
      <ErrorBoundary>
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{
            position: [2.4, 1.8, 3.2],
            fov: 45,
            near: 0.1,
            far: 120,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <Suspense fallback={null}>
            <ToneMapping exposure={environment.exposure || 1.0} />
            <SceneEnvironment environment={environment} />
            <Lighting environment={environment} selectedColor={selectedColor} />
            <ProductModel
              selectedColorHex={selectedColor.hex}
              onLoaded={setModelBounds}
            />
            <CameraController
              isAutoRotating={isAutoRotating}
              resetTrigger={resetTrigger}
              bounds={modelBounds}
            />
          </Suspense>
        </Canvas>
        <Loader />
      </ErrorBoundary>
    </div>
  );
}
