# 🪑 productVisualizer — 3D Product Configurator (Three.js & React Three Fiber)

> An interactive, production-grade 3D product configurator for the **Aero Lounge Chair**, built with **Three.js**, **React Three Fiber (R3F)**, **Drei**, and **Vite**.

This guide is specifically designed for anyone learning Three.js or inspecting this project for the first time. It clearly breaks down **where the main product is**, **where the 3D scene is**, **why each file exists**, and **how all the code connects**.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open your browser
# Navigate to http://localhost:5173
```

---

## 🧭 Project Architecture at a Glance

In this application, UI controls (HTML/CSS) and 3D rendering (WebGL Canvas) are decoupled using **Unidirectional Data Flow**:

```text
                     ┌────────────────────────────────────────┐
                     │ useProductConfiguration (Custom Hook)   │
                     │  - selectedColor                       │
                     │  - currentEnvironment                  │
                     │  - isAutoRotating, isWireframe         │
                     │  - resetTrigger                        │
                     └───────────────────┬────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
   ┌───────────────────────────┐                   ┌───────────────────────────┐
   │ ConfiguratorPanel (UI)    │                   │ ProductViewer (3D Canvas) │
   │ - ColorSelector (Swatches)│                   │ - SceneEnvironment (Fog)  │
   │ - EnvironmentSelector     │                   │ - Lighting (Three-Point)  │
   │ - Scene Controls          │                   │ - ProductModel (GLB Mesh) │
   │ - Specifications Dropdown │                   │ - Ground (Contact Shadows)│
   └───────────────────────────┘                   │ - CameraController (Orbit)│
                                                   └───────────────────────────┘
```

> **Why this matters for learners:**  
> The 3D scene **never** touches React UI state directly, and the UI buttons **never** mutate Three.js objects directly. State flows downward via props, and user actions flow upward via callbacks. The WebGL `<Canvas>` is mounted once and **never re-mounts or flashes** when options change.

---

## 📂 Where is Everything? (File-by-File Map)

Here is the exact map of where every component, asset, and config file lives and why it is there:

| File / Folder | Role | Why It Exists & What It Does |
|---|---|---|
| **`public/models/product.glb`** | **The Main 3D Model** | The binary glTF 3D asset containing the chair's geometry, hierarchy, normals, and PBR textures. |
| **`src/config/productConfig.js`** | **Product & Color Data** | Central configuration for product metadata (dimensions, weight, materials), the color palette, and the matcher rule identifying which part of the 3D chair to recolor. |
| **`src/config/environments.js`** | **Lighting Presets Data** | Defines lighting configurations (ambient, key, fill, rim lights) and background gradients for `Studio`, `Warm Daylight`, and `Warm Lounge` presets. |
| **`src/hooks/useProductConfiguration.js`** | **State Management** | Custom React hook holding the active configuration state. Ensures Three.js mutable objects are **never** stored in React state. |
| **`src/components/ProductViewer/ProductViewer.jsx`** | **The 3D Scene Root** | Renders the R3F `<Canvas>`, initializes WebGLRenderer, configures shadows (`PCFSoftShadowMap`), camera defaults, and orchestrates all 3D scene elements. |
| **`src/components/ProductViewer/ProductModel.jsx`** | **3D Model Loader & Material Controller** | Loads `product.glb` via `useGLTF`, centers the model at `(0,0,0)`, runs the entrance animation, and performs **instant real-time material recoloring without reloading the asset**. |
| **`src/components/ProductViewer/Lighting.jsx`** | **Studio Lighting Rig** | Implements standard cinematic **Three-Point Lighting** (Key light with shadows, Fill light for soft bounce, Rim light for edge specular highlights, and Ambient light). |
| **`src/components/ProductViewer/Environment.jsx`** | **Atmosphere & Fog** | Injects subtle linear depth fog (`<fog />`) that blends distant scene edges into the current background gradient. |
| **`src/components/ProductViewer/Ground.jsx`** | **Pedestal & Shadows** | Uses Drei's `<ContactShadows />` to render soft ambient occlusion shadows directly beneath the chair legs, plus a circular studio pedestal disc. |
| **`src/components/ProductViewer/CameraController.jsx`** | **Camera & Orbit Controls** | Handles smooth orbital navigation via `OrbitControls`. Features **mathematical auto-framing** using trigonometry on the 3D bounding box. |
| **`src/components/UI/ConfiguratorPanel.jsx`** | **Customization UI Panel** | Floating glassmorphism sidebar containing the color swatches, environment switcher, scene tool buttons, and product specifications. |
| **`src/components/UI/ColorSelector.jsx`** | **Color Swatches** | Accessible swatch buttons representing luxury velvet fabric colors. |
| **`src/components/UI/EnvironmentSelector.jsx`** | **Environment Switcher** | Interactive cards to switch between Studio, Outdoor, and Interior lighting setups. |
| **`src/components/UI/Loader.jsx`** | **3D Asset Loading Screen** | Animated progress bar hooked into Three.js `DefaultLoadingManager` via `useProgress`. Displays real percentage while the `.glb` downloads. |
| **`src/components/UI/ErrorBoundary.jsx`** | **WebGL Error Boundary** | Catches WebGL crashes or asset load errors gracefully with a friendly reload message instead of a white screen. |
| **`src/components/UI/InteractionHint.jsx`** | **User Interaction Pill** | Floating pill at the bottom explaining mouse controls (drag, scroll, right-click). |
| **`src/App.jsx`** | **App Layout Shell** | Wires together the custom hook, top navigation bar, 3D Canvas viewer, and the floating UI panel. |
| **`src/App.css`** | **Styling System** | Complete Vanilla CSS styling tokens, glassmorphism effects, responsive layouts, and smooth micro-animations. |

---

## 🧩 Deep Dive: Where is the Main Product?

### 1. The 3D Asset: `public/models/product.glb`
- **What is glTF/GLB?** glTF (GL Transmission Format) is the open standard "JPEG of 3D". A `.glb` file is a single binary container packaging the scene hierarchy, vertex positions, UV coordinates, normals, and PBR (Physically Based Rendering) texture maps.
- **Where it lives:** In the `public/models/` directory so Vite can serve it statically at the URL `/models/product.glb`.

### 2. Loading the Model: `src/components/ProductViewer/ProductModel.jsx`
- Uses `@react-three/drei`'s `useGLTF` hook:
  ```javascript
  const { scene } = useGLTF(productDetails.modelPath);
  ```
- **React Suspense:** R3F integrates with React `<Suspense>`, meaning the asset loads asynchronously in the background while `<Loader />` displays a progress bar.
- **Preloading:** The asset is pre-fetched via `useGLTF.preload(productDetails.modelPath)` so the 3D view renders almost immediately.

### 3. Real-Time Color Customization (Zero-Reload GPU Mutation)
- **Common beginner mistake:** Reloading the `.glb` file every time the user clicks a new color. This causes massive frame drops, UI lag, and resets the camera.
- **How this project does it:**
  1. When the GLB first loads, we traverse the scene hierarchy:
     ```javascript
     clone.traverse((child) => {
       if (child.isMesh && productDetails.targetMeshMatcher(child)) {
         child.material = child.material.clone();
         targetMaterial = child.material;
       }
     });
     ```
  2. We store a direct reference to this material in `targetMaterialRef`.
  3. When the user picks a new color swatch, a lightweight `useEffect` runs:
     ```javascript
     targetMaterialRef.current.color.set(selectedColorHex);
     targetMaterialRef.current.needsUpdate = true;
     ```
  4. Three.js immediately sends the new color value to the GPU fragment shader uniform. **The update happens in 0 milliseconds**, retaining all normal maps, fabric textures, and camera angles!

### 4. Automatic Origin Centering:
Because 3D models from Blender or 3D artists often have unpredictable pivot points or arbitrary scale, `ProductModel.jsx` computes an Axis-Aligned Bounding Box (AABB) using `THREE.Box3`:
```javascript
const box = new THREE.Box3().setFromObject(clone);
const center = new THREE.Vector3();
box.getCenter(center);

// Offset position so model center is at (0, 0, 0) and bottom sits flat on ground (y = 0)
<primitive object={modelData.scene} position={[-center.x, -box.min.y, -center.z]} />
```

---

## 🎬 Deep Dive: Where is the 3D Scene?

The entire 3D scene is declared inside `src/components/ProductViewer/ProductViewer.jsx` within the `<Canvas>` component:

```jsx
<Canvas
  shadows
  dpr={[1, 2]} // Crisp rendering on Retina displays without draining battery
  camera={{ position: [2.5, 1.8, 3.2], fov: 45, near: 0.1, far: 100 }}
  gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
>
  <Suspense fallback={null}>
    <SceneEnvironment environment={environment} />
    <Lighting environment={environment} />
    <ProductModel selectedColorHex={selectedColor.hex} isWireframe={isWireframe} onLoaded={handleModelLoaded} />
    <Ground environment={environment} />
    <CameraController isAutoRotating={isAutoRotating} resetTrigger={resetTrigger} bounds={modelBounds} />
  </Suspense>
</Canvas>
```

### What does `<Canvas>` do under the hood?
1. **Creates WebGLRenderer:** Mounts an HTML `<canvas>` element and configures WebGL2 context.
2. **Creates `THREE.Scene`:** The root of the 3D scene graph.
3. **Creates `THREE.PerspectiveCamera`:** Configured with 45° FOV and proper aspect ratio.
4. **Starts the Animation Loop:** Automatically runs `requestAnimationFrame` and re-renders the scene only when state or camera changes.
5. **Raycasting & Window Resizing:** Listens to window resize events to keep the aspect ratio intact and handles 3D pointer raycasting.

---

## 💡 Lighting, Shadows & Grounding

Located in `src/components/ProductViewer/Lighting.jsx` and `Ground.jsx`:

### 1. Three-Point Lighting Setup
- **Ambient Light (`<ambientLight>`):** Uniform base light so shadowed sides don't become pure black.
- **Key Light (`<directionalLight castShadow>`):** The primary light source (sun/studio lamp). Configured with `2048x2048` shadow map resolution and a slight negative shadow bias (`-0.0001`) to eliminate shadow acne.
- **Fill Light (`<directionalLight>`):** Positioned opposite the key light to soften harsh shadows with a subtle cool/warm tint.
- **Rim Light (`<directionalLight>`):** Positioned behind the chair pointing towards the camera, grazing the outer edges to separate the dark chair silhouette from the background.

### 2. Contact Shadows (`<ContactShadows />` from Drei)
Traditional directional shadows can look hard or float awkwardly. `Ground.jsx` uses `<ContactShadows />`, which renders a dedicated ground depth pass creating soft, diffuse ambient occlusion (AO) shadows directly beneath the chair legs.

---

## 🎥 Camera & Controls (`CameraController.jsx`)

Located in `src/components/ProductViewer/CameraController.jsx`:

### 1. Mathematical Auto-Framing
To guarantee **any** 3D model fits comfortably inside the screen regardless of its size:
1. We compute the model's bounding box and get its maximum dimension (`maxDim`).
2. We convert camera vertical FOV to radians: `fovRad = camera.fov * (Math.PI / 180)`.
3. We calculate the exact distance needed to fit the sphere inside the frustum:
   $$\text{distance} = \frac{\text{maxDim} / 2}{\tan(\text{fovRad} / 2)} \times 1.45$$
   *(The 1.45 multiplier provides comfortable visual padding).*
4. We aim the camera at the calculated center of the chair and position it at an attractive 3/4 isometric perspective.

### 2. OrbitControls Polish
- **Damping (`enableDamping = true`, `dampingFactor = 0.06`):** Adds physical inertia so dragging decelerates smoothly.
- **Polar Angle Clamping (`maxPolarAngle = Math.PI / 2`):** Prevents the camera from dipping below the floor plane so the user never sees an awkward empty void under the ground.
- **Dynamic Distance Limits:** Automatically sets `minDistance` and `maxDistance` based on model size so the user can't zoom into the inside of the mesh or zoom out infinitely.

---

## 🧠 The Golden Rule for Three.js in React

If you learn only one concept from this project, let it be this:

> ⚠️ **NEVER store mutable Three.js objects (`THREE.Mesh`, `THREE.Material`, `THREE.Scene`, `THREE.Vector3`) in React `useState`.**

### Why?
- Mutating a Three.js property (like `mesh.position.x = 2`) does **not** trigger a React re-render.
- Calling `setMesh(newMesh)` triggers expensive React component re-renders that can tear down and rebuild WebGL pipelines, causing massive stutter.
- **Correct approach (used here):**
  - Store **primitive values** (strings, hex colors, booleans) in React `useState`.
  - Store **Three.js objects** in `useRef` or `useMemo`.
  - Mutate Three.js properties inside `useEffect` or `useFrame`.

---

## 🛠️ How to Experiment & Learn with this Project

### 1. How to Add a New Color Option
Open `src/config/productConfig.js` and add a new object to the `productColors` array:
```javascript
{
  id: 'sapphire',
  name: 'Royal Sapphire',
  hex: '#1d4ed8',
  accent: '#3b82f6',
  description: 'Vibrant cobalt blue with radiant reflections.'
}
```
The color swatch and 3D material updates automatically!

### 2. How to Add a New Lighting Environment
Open `src/config/environments.js` and add a new preset under `environments`:
```javascript
cyberpunk: {
  id: 'cyberpunk',
  name: 'Neon Cyberpunk',
  tagline: 'Futuristic Violet & Cyan Glow',
  icon: 'lamp',
  backgroundGradient: 'radial-gradient(ellipse at 50% 35%, #2e1065 0%, #030712 100%)',
  lighting: {
    ambient: { color: '#581c87', intensity: 0.8 },
    keyLight: { color: '#06b6d4', intensity: 2.5, position: [5, 6, 4], castShadow: true },
    fillLight: { color: '#ec4899', intensity: 1.5, position: [-5, 2, -3] },
    rimLight: { color: '#a855f7', intensity: 2.0, position: [0, 4, -5] }
  },
  ground: { shadowOpacity: 0.7, pedestalColor: '#1e1b4b' }
}
```
A new button automatically appears in the UI and the 3D scene responds instantly!

### 3. How to Use Your Own 3D Model
1. Place your `.glb` file inside `public/models/your-model.glb`.
2. In `src/config/productConfig.js`, update:
   ```javascript
   modelPath: '/models/your-model.glb'
   ```
3. Update `targetMeshMatcher` in `src/config/productConfig.js` to match the name of the mesh in your model that you want to recolor.
4. The auto-framing system in `CameraController.jsx` will automatically measure your new model, center it, and frame it properly!

---

## 📚 Technical Stack

- **React 19** — Core UI framework
- **Three.js** (`r186`) — Underlying WebGL 3D graphics library
- **@react-three/fiber** (`v9`) — Declarative React wrapper for Three.js
- **@react-three/drei** (`v10`) — Helper collection (`useGLTF`, `OrbitControls`, `ContactShadows`, `useProgress`)
- **Vite 8** — Fast bundler & development server
- **Vanilla CSS** — Custom glassmorphism design system without third-party CSS dependencies

---

## 📖 Additional Reading
For an interview preparation guide and deep-dive Q&A cheat sheet on the math and algorithms used here, see [`THREE_GUIDE.md`](./THREE_GUIDE.md).
>>>>>>> cf80b3c (Initial commit: 3D Product Configurator with Three.js & React Three Fiber)
