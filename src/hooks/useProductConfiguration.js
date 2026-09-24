import { useState, useCallback } from 'react';
import { defaultColor } from '../config/productConfig';
import { environments, defaultEnvironmentKey } from '../config/environments';

/**
 * useProductConfiguration Hook
 * 
 * WHY USE A CUSTOM HOOK HERE?
 * 1. Single Source of Truth: Centralizes product state (selected color, environment,
 *    camera triggers, turntable auto-rotation, wireframe mode).
 * 2. Decoupling: UI components (color selectors, environment cards) and 3D scene components
 *    do NOT need to know about each other's internal workings. They interact solely through
 *    clean, well-defined state and actions.
 * 3. Separation of Concerns: Keeps Three.js rendering code pure and free of UI logic,
 *    and keeps UI components free of Three.js object references.
 * 4. React Best Practice: Notice we only store plain primitive values (strings, booleans)
 *    and plain config objects in React state. NEVER store mutable Three.js objects
 *    (like THREE.Mesh, THREE.Material, or THREE.Scene) in React state, as that triggers
 *    excessive re-renders and breaks Three.js performance!
 */
export function useProductConfiguration() {
  // Current active color choice (initialized to defaultColor)
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  // Current active environment preset key ('studio' | 'outdoor' | 'interior')
  const [selectedEnvironmentKey, setSelectedEnvironmentKey] = useState(defaultEnvironmentKey);

  // Turntable auto-rotation state (disabled by default so user retains full manual control)
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  // Wireframe toggle (allows inspecting the 3D polygon topology)
  const [isWireframe, setIsWireframe] = useState(false);

  // Camera reset trigger counter. Incrementing this counter sends a signal to
  // CameraController to smoothly re-frame the camera without causing full re-mounts.
  const [resetTrigger, setResetTrigger] = useState(0);

  // Handler for changing color
  const handleColorChange = useCallback((color) => {
    setSelectedColor(color);
  }, []);

  // Handler for changing environment preset
  const handleEnvironmentChange = useCallback((envKey) => {
    if (environments[envKey]) {
      setSelectedEnvironmentKey(envKey);
    }
  }, []);

  // Toggle turntable rotation
  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotating((prev) => !prev);
  }, []);

  // Toggle wireframe mode
  const toggleWireframe = useCallback(() => {
    setIsWireframe((prev) => !prev);
  }, []);

  // Signal the camera to re-center onto the product
  const triggerResetView = useCallback(() => {
    setResetTrigger((prev) => prev + 1);
  }, []);

  // Derive current environment configuration object
  const currentEnvironment = environments[selectedEnvironmentKey] || environments[defaultEnvironmentKey];

  return {
    selectedColor,
    selectedEnvironmentKey,
    currentEnvironment,
    isAutoRotating,
    isWireframe,
    resetTrigger,
    handleColorChange,
    handleEnvironmentChange,
    toggleAutoRotate,
    toggleWireframe,
    triggerResetView
  };
}
