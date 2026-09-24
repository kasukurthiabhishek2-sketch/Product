# Three.js & React Three Fiber (R3F) Technical Guide

A beginner-friendly architectural walkthrough and interview preparation guide for the **3D Product Configurator**.

---

## Architecture Overview

```text
React State (useProductConfiguration)
        │
        ├── Props ──► ConfiguratorPanel (HTML / CSS UI)
        │                 - ColorSelector (Swatches)
        │                 - EnvironmentSelector (Lighting Presets)
        │                 - Camera / Scene Tools (Reset, Rotate, Wireframe)
        │
        └── Props ──► ProductViewer (R3F Canvas)
                          - SceneEnvironment (Atmospheric Fog)
                          - Lighting (Key, Fill, Rim Lights)
                          - ProductModel (GLB Mesh & Material updates)
                          - Ground (Contact Shadows & Pedestal)
                          - CameraController (OrbitControls & Framing)
```

---

## Core Three.js Concepts Explained

### 1. How the 3D Model is Loaded
* **GLB (glTF Binary):** glTF is the open standard "JPEG of 3D". A `.glb` file packages the entire 3D asset into a single binary file, containing:
  - **Node Hierarchy (Scene Graph):** Tree structure describing parts and parent-child transforms.
  - **Geometry (Meshes):** Vertex positions, normals, UV texture coordinates, indices.
  - **Materials & Textures:** PBR parameters (albedo, roughness, metalness, normal maps).
* **`useGLTF` Hook (@react-three/drei):**
  - Wraps Three.js `GLTFLoader`.
  - Integrates with React `Suspense` for non-blocking asynchronous loading.
  - Automatically caches the asset in memory so re-renders don't re-fetch the asset.
  - We pre-load it using `useGLTF.preload('/models/product.glb')` for instant rendering.

---

### 2. How the Camera Works
* **`THREE.PerspectiveCamera`:** Simulates human optical vision where objects further away appear smaller.
* **Key Camera Parameters:**
  - **Field of View (`fov`):** Vertical viewing angle in degrees (e.g., 45°). A lower FOV resembles a telephoto lens (less distortion), while a higher FOV looks like a wide-angle lens.
  - **Aspect Ratio:** Viewport width divided by viewport height (`w / h`), preventing stretching or squishing.
  - **Near and Far Clipping Planes (`near`, `far`):** Only geometry situated between the near plane (e.g., `0.1`) and the far plane (e.g., `100`) is rasterized. Anything outside this range is clipped to conserve performance.
  - **Position & Target (`lookAt`):** The 3D coordinates where the camera is stationed in space (`[x, y, z]`) and the focal point it points towards.

---

### 3. How OrbitControls Works
* **Spherical Coordinates:** OrbitControls moves the camera along the surface of a virtual sphere around a focal pivot point (`target` vector).
* **Damping (`enableDamping = true`, `dampingFactor = 0.06`):**
  - Implements simulated inertia/friction.
  - When dragging with the mouse and releasing, the camera doesn't halt abruptly; it decelerates smoothly, providing a tactile, high-end sensation.
* **Polar Angle Clamping (`minPolarAngle`, `maxPolarAngle`):**
  - Restricts vertical camera movement (`phi` angle).
  - Setting `maxPolarAngle = Math.PI / 2` prevents the camera from dipping below the floor plane, ensuring users never look into an empty void under the ground.
* **Distance Bounds (`minDistance`, `maxDistance`):**
  - Dynamically calculated from the model's bounding box to prevent users from clipping inside the model geometry or zooming infinitely away.

---

### 4. How Lighting Works
We utilize a classic **Three-Point Studio Lighting** system adapted for real-time WebGL:
1. **Ambient Light (`<ambientLight />`):**
   - Provides omnidirectional base lighting to all surfaces.
   - Prevents shadow areas from becoming completely pitch-black.
2. **Key Light (`<directionalLight castShadow />`):**
   - The primary light source establishing dominant highlights and shadows.
   - Configured with `castShadow = true`, a `2048x2048` depth map shadow buffer, and a slight negative `shadow-bias` (`-0.0001`) to eliminate shadow acne artifacts on curved surfaces.
3. **Fill Light (`<directionalLight />`):**
   - Placed on the opposite side with lower intensity and a subtle cool/warm tint to illuminate crevices and simulate bounce light.
4. **Rim Light (`<directionalLight />`):**
   - Positioned behind the model pointing toward the camera to accentuate the chair's outer silhouette and highlight the velvet sheen.
5. **Contact Shadows (`<ContactShadows />` from Drei):**
   - Renders a ground-level depth pass generating soft, diffused ambient occlusion (AO) shadows beneath the chair legs without costly realtime raytracing.

---

### 5. How Material Color is Changed in Real Time
* **Problem to Avoid:** Re-loading the `.glb` file or remounting the `<Canvas>` when a user selects a color. Doing so causes lag, flashes, and resets the camera view.
* **Our Solution (Zero-Reload Realtime Mutation):**
  1. On initial load, we traverse the scene graph using `scene.traverse((child) => ...)`.
  2. We identify the configurable upholstery mesh (`SheenChair_fabric`) and clone its material (`material.clone()`) to prevent mutating shared cache objects.
  3. We keep a reference to this material.
  4. When the user clicks a color swatch, React triggers a lightweight `useEffect`:
     ```js
     targetMaterialRef.current.color.set(selectedColorHex);
     targetMaterialRef.current.needsUpdate = true;
     ```
  5. Three.js immediately sends the new color uniform to the GPU fragment shader on the next frame. The update is instantaneous (0ms delay), preserves camera angles, and retains all normal maps, roughness, and velvet sheen textures!

---

### 6. How Environment Switching Works
* **Data-Driven Presets (`environments.js`):**
  - Instead of hard-coding values inside JSX, environments are defined as data objects (`studio`, `outdoor`, `interior`).
  - Switching environments doesn't just change a CSS background color; it dynamically updates:
    - Ambient light color & intensity
    - Directional sun/key light position, color, and intensity
    - Fill light and rim light tints
    - Ground shadow opacity
    - Scene depth fog
    - CSS viewport gradient
* **Adding New Environments:** Simply add a new key in `environments.js` and both the UI buttons and 3D lighting update automatically.

---

### 7. How React State Controls the Three.js Scene
* **Unidirectional Data Flow:**
  - `useProductConfiguration` hook acts as the Single Source of Truth.
  - React manages high-level state: `selectedColor`, `selectedEnvironmentKey`, `isAutoRotating`, `isWireframe`, and `resetTrigger`.
  - Props flow down to the UI panel and the 3D Viewer.
* **Golden Rule for Three.js in React:**
  - **NEVER** store mutable Three.js objects (`THREE.Mesh`, `THREE.Material`, `THREE.Scene`, `THREE.Vector3`) in React state (`useState`).
  - Mutating Three.js objects does not trigger React renders, and putting them in state causes unnecessary, expensive re-renders of the WebGL canvas.
  - Store plain primitive values (strings, booleans, numbers) in React state, and hold mutable Three.js object references in `useRef`.

---

### 8. How Automatic Model Framing Works
* **Problem:** 3D models from Blender or artists come in unpredictable sizes (e.g., 0.1 units vs 1000 units) and arbitrary pivot positions.
* **Trigonometric Solution:**
  1. Compute the Axis-Aligned Bounding Box (AABB) using `THREE.Box3`:
     ```js
     const box = new THREE.Box3().setFromObject(clonedScene);
     const center = box.getCenter(new THREE.Vector3());
     const size = box.getSize(new THREE.Vector3());
     const maxDim = Math.max(size.x, size.y, size.z);
     ```
  2. Center the model at the world origin `(0, 0, 0)` with its base resting at ground level (`y = 0`):
     ```jsx
     <primitive object={scene} position={[-center.x, -box.min.y, -center.z]} />
     ```
  3. Calculate the required camera distance based on vertical Field of View (`fov`):
     ```js
     const fovInRadians = (camera.fov * Math.PI) / 180;
     const fitDistance = (maxDim / (2 * Math.tan(fovInRadians / 2))) * 1.45;
     ```
  4. Position the camera at `[fitDistance * 0.75, fitDistance * 0.4, fitDistance * 1.1]` and point `OrbitControls.target` at the center `[0, size.y / 2, 0]`.
  5. This mathematically guarantees that **any** 3D model will always be centered, properly scaled, and framed with comfortable padding.

---

## Technical Interview Q&A Cheat Sheet

| Question | Short Answer |
|---|---|
| **"How did you load the 3D model?"** | "Used `@react-three/drei`'s `useGLTF` hook with React Suspense. It caches the binary glTF asset and preloads it for smooth streaming." |
| **"How did you change product color without reloading?"** | "Traversed the glTF scene graph on load to isolate the upholstery mesh, cloned its material, and on color changes, updated `material.color.set(hex)` directly in memory. This updates the GPU shader uniform without rebuilding geometry." |
| **"How does automatic camera framing work?"** | "Calculated the model's bounding box via `THREE.Box3`, computed the maximum dimension, and used trigonometry `(maxDim / 2) / tan(fov / 2)` with a 1.45 padding factor to set camera distance and OrbitControls target." |
| **"How did you handle environment switching?"** | "Built a data-driven configuration where switching presets reconfigures Three-Point lighting (ambient, directional key, fill, and rim lights), shadow opacities, and depth fog simultaneously." |
| **"How do you keep R3F apps performant?"** | "1) Reused materials and cloned once; 2) Kept state primitive—never stored Three.js objects in React state; 3) Used `useFrame` with delta dampening for entrance animation and put it to sleep once settled; 4) Enabled OrbitControls damping instead of manual continuous frame updates; 5) Clamped pixel ratio `dpr={[1, 2]}` to protect high-DPI screens." |
