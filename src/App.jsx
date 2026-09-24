import { useProductConfiguration } from "./hooks/useProductConfiguration";
import { ProductViewer } from "./components/ProductViewer/ProductViewer";
import { ConfiguratorPanel } from "./components/UI/ConfiguratorPanel";
import { InteractionHint } from "./components/UI/InteractionHint";
import "./App.css";

function App() {
  const {
    selectedColor,
    selectedEnvironmentKey,
    currentEnvironment,
    isAutoRotating,
    resetTrigger,
    handleColorChange,
    handleEnvironmentChange,
    toggleAutoRotate,
    triggerResetView,
  } = useProductConfiguration();

  return (
    <main
      className={`app-viewport theme-${selectedEnvironmentKey}`}
      style={{ background: currentEnvironment.backgroundGradient }}
    >
      <ProductViewer
        selectedColor={selectedColor}
        environment={currentEnvironment}
        isAutoRotating={isAutoRotating}
        resetTrigger={resetTrigger}
      />

      <ConfiguratorPanel
        selectedColor={selectedColor}
        onSelectColor={handleColorChange}
        selectedEnvironmentKey={selectedEnvironmentKey}
        onSelectEnvironment={handleEnvironmentChange}
        isAutoRotating={isAutoRotating}
        onToggleAutoRotate={toggleAutoRotate}
        onResetView={triggerResetView}
      />

      <InteractionHint />
    </main>
  );
}

export default App;
