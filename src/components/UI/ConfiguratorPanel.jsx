import { useState } from "react";
import { productDetails } from "../../config/productConfig";
import { ColorSelector } from "./ColorSelector";
import { EnvironmentSelector } from "./EnvironmentSelector";

export function ConfiguratorPanel({
  selectedColor,
  onSelectColor,
  selectedEnvironmentKey,
  onSelectEnvironment,
  isAutoRotating,
  onToggleAutoRotate,
  onResetView,
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          className="panel-open-trigger"
          onClick={() => setIsOpen(true)}
          aria-label="Open customization drawer"
          id="btn-open-panel"
        >
          <span>Customize</span>
        </button>
      )}

      <aside
        className={`configurator-panel ${!isOpen ? "closed" : ""}`}
        aria-label="Product customization controls"
        aria-hidden={!isOpen}
      >
        <div className="panel-scroll-container">
          <header className="panel-header">
            <div className="panel-meta-line">
              <span className="panel-collection-tag">Atelier Aero · 01</span>
              <button
                type="button"
                className="panel-close-trigger"
                onClick={() => setIsOpen(false)}
                aria-label="Collapse panel"
                id="btn-close-panel"
              >
                ✕
              </button>
            </div>
            <h1 className="panel-title">{productDetails.name}</h1>
            <p className="panel-tagline">{productDetails.tagline}</p>
          </header>

          <div className="hairline-divider" />

          <section className="panel-section">
            <ColorSelector
              selectedColor={selectedColor}
              onSelectColor={onSelectColor}
            />
          </section>

          <div className="hairline-divider" />

          <section className="panel-section">
            <EnvironmentSelector
              selectedEnvironmentKey={selectedEnvironmentKey}
              onSelectEnvironment={onSelectEnvironment}
            />
          </section>

          <div className="hairline-divider" />

          <section className="panel-section">
            <div className="control-group">
              <div className="group-header">
                <span className="group-label">VIEW</span>
              </div>

              <div className="view-tools-row">
                <button
                  type="button"
                  className={`view-tool-button ${isAutoRotating ? "active" : ""}`}
                  onClick={onToggleAutoRotate}
                  title="Toggle turntable auto rotation"
                  aria-pressed={isAutoRotating}
                  id="btn-toggle-autorotate"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                  <span>{isAutoRotating ? "Rotating" : "Auto Rotate"}</span>
                </button>

                <button
                  type="button"
                  className="view-tool-button"
                  onClick={onResetView}
                  title="Reset view to default framing"
                  id="btn-reset-camera"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
