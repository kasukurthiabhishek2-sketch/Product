import { useProductConfiguration } from './hooks/useProductConfiguration';
import { ProductViewer } from './components/ProductViewer/ProductViewer';
import { ConfiguratorPanel } from './components/UI/ConfiguratorPanel';
import { InteractionHint } from './components/UI/InteractionHint';
import './App.css';

/**
 * App Root Component
 * 
 * ARCHITECTURE & UNIDIRECTIONAL DATA FLOW:
 * 
 * [ useProductConfiguration Hook ]
 *              │
 *              ├──────────────────────────────────┐
 *              ▼                                  ▼
 *    [ ConfiguratorPanel (UI) ]          [ ProductViewer (3D) ]
 *    - Triggers color selection          - Consumes color hex
 *    - Triggers environment selection    - Consumes environment lighting
 *    - Toggles auto-rotate & wireframe   - Consumes camera & orbit state
 *    - Triggers camera reset signal      - Renders Canvas & ProductModel
 * 
 * WHY THIS IS INTERVIEW-GRADE ARCHITECTURE:
 * 1. Unidirectional Data Flow: UI components never mutate 3D scene objects directly.
 *    State flows down via props; user interactions flow up via callbacks.
 * 2. High Performance: The Canvas is mounted once and is never torn down or re-mounted
 *    when colors or environments switch.
 * 3. Clear Separation of Concerns: The 3D scene doesn't know about buttons, CSS,
 *    or HTML layouts. The UI panel doesn't know about WebGL contexts, matrices,
 *    or shaders.
 */
function App() {
  const {
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
  } = useProductConfiguration();

  return (
    <main
      className="app-viewport"
      style={{ background: currentEnvironment.backgroundGradient }}
    >
      {/* 1. Sleek Top Navigation Bar */}
      <header className="top-nav-bar">
        <div className="brand-logo-group">
          <div className="brand-monogram">A</div>
          <div className="brand-text-block">
            <span className="brand-name">Atelier Aero</span>
            <span className="brand-subtext">Architectural Furnishings</span>
          </div>
        </div>

        <div className="top-nav-actions">
          <span className="nav-tag-badge">Studio Configurator</span>
        </div>
      </header>

      {/* 2. WebGL 3D Product Canvas */}
      <ProductViewer
        selectedColor={selectedColor}
        environment={currentEnvironment}
        isAutoRotating={isAutoRotating}
        isWireframe={isWireframe}
        resetTrigger={resetTrigger}
      />

      {/* 3. Floating Glassmorphism Customization Panel */}
      <ConfiguratorPanel
        selectedColor={selectedColor}
        onSelectColor={handleColorChange}
        selectedEnvironmentKey={selectedEnvironmentKey}
        onSelectEnvironment={handleEnvironmentChange}
        isAutoRotating={isAutoRotating}
        onToggleAutoRotate={toggleAutoRotate}
        isWireframe={isWireframe}
        onToggleWireframe={toggleWireframe}
        onResetView={triggerResetView}
      />

      {/* 4. Interaction Helper Badge */}
      <InteractionHint />
    </main>
  );
}

export default App;
