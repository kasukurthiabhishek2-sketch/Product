import { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ProductModel } from './ProductModel';
import { CameraController } from './CameraController';
import { Lighting } from './Lighting';
import { SceneEnvironment } from './Environment';
import { Ground } from './Ground';
import { Loader } from '../UI/Loader';
import { ErrorBoundary } from '../UI/ErrorBoundary';

/**
 * ProductViewer Component
 * 
 * CORE THREE.JS & R3F ARCHITECTURE CONCEPTS:
 * 
 * 1. The `<Canvas>` Component:
 *    The `<Canvas>` from @react-three/fiber is the bridge between React and Three.js.
 *    Under the hood, it performs several critical operations:
 *    - Creates an HTML5 `<canvas>` element and attaches a WebGLRenderer.
 *    - Creates the root `THREE.Scene`.
 *    - Sets up a `THREE.PerspectiveCamera`.
 *    - Starts an automated `requestAnimationFrame` loop that re-renders the scene when needed.
 *    - Automatically handles browser window resize events and camera aspect ratio recalculations.
 *    - Propagates pointer events (click, pointerover, pointerdown) down into 3D meshes using raycasting!
 * 
 * 2. Shadows Configuration:
 *    Passing `shadows` to `<Canvas>` enables `gl.shadowMap.enabled = true` and configures
 *    `PCFSoftShadowMap` for smooth antialiased shadow edges.
 * 
 * 3. React Suspense Integration:
 *    Because `useGLTF` uses React Suspense under the hood, wrapping the 3D scene in `<Suspense>`
 *    allows clean asynchronous asset streaming without blocking the UI thread.
 */
export function ProductViewer({
  selectedColor,
  environment,
  isAutoRotating,
  isWireframe,
  resetTrigger
}) {
  // Store calculated spatial bounds from ProductModel to pass to CameraController
  const [modelBounds, setModelBounds] = useState(null);

  // Callback invoked once the model's bounding box has been computed
  const handleModelLoaded = useCallback((bounds) => {
    setModelBounds(bounds);
  }, []);

  return (
    <div className="product-viewer-container" id="product-canvas-container">
      <ErrorBoundary>
        <Canvas
          shadows
          dpr={[1, 2]} // Support high-DPI Retina screens while preserving mobile battery
          camera={{
            position: [2.5, 1.8, 3.2],
            fov: 45,
            near: 0.1,
            far: 100
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          <Suspense fallback={null}>
            {/* Dynamic Environment & Atmospheric Fog */}
            <SceneEnvironment environment={environment} />

            {/* Configurable Three-Point Lighting */}
            <Lighting environment={environment} />

            {/* 3D Product Mesh with realtime material tuning */}
            <ProductModel
              selectedColorHex={selectedColor.hex}
              isWireframe={isWireframe}
              onLoaded={handleModelLoaded}
            />

            {/* Ground Plane with Contact Shadows */}
            <Ground environment={environment} />

            {/* Orbit Controls with Automatic Framing & Damping */}
            <CameraController
              isAutoRotating={isAutoRotating}
              resetTrigger={resetTrigger}
              bounds={modelBounds}
            />
          </Suspense>
        </Canvas>

        {/* Global Loading Overlay hooked into Three.js loading manager */}
        <Loader />
      </ErrorBoundary>
    </div>
  );
}
