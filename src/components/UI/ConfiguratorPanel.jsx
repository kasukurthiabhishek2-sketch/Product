import { useState } from 'react';
import { productDetails } from '../../config/productConfig';
import { ColorSelector } from './ColorSelector';
import { EnvironmentSelector } from './EnvironmentSelector';

/**
 * ConfiguratorPanel Component
 * 
 * Floating glassmorphism control panel presenting:
 * - Product branding & specifications
 * - Dynamic color swatch selectors
 * - Dynamic environment selectors
 * - Interactive camera and scene tools (Reset view, Auto-rotate, Wireframe mode)
 */
export function ConfiguratorPanel({
  selectedColor,
  onSelectColor,
  selectedEnvironmentKey,
  onSelectEnvironment,
  isAutoRotating,
  onToggleAutoRotate,
  isWireframe,
  onToggleWireframe,
  onResetView 
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [showSpecs, setShowSpecs] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          className="panel-open-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open customization panel"
          id="btn-open-panel"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6" />
          </svg>
          <span>Customize</span>
        </button>
      )}

      <aside
        className={`configurator-panel ${!isOpen ? 'closed' : ''}`}
        aria-label="3D Product Customization Panel"
        aria-hidden={!isOpen}
      >
        <div className="panel-inner-scroll">
          {/* Product Header */}
          <header className="panel-header">
            <div className="brand-badge-row">
              <div className="brand-badge-group">
                <span className="live-3d-badge">3D Product viewer</span>
              </div>
              <button
                type="button"
                className="panel-close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close customization panel"
                id="btn-close-panel"
                title="Close panel"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <h1 className="product-title">{productDetails.name}</h1>
            <p className="product-subtitle">{productDetails.subtitle}</p>
          </header>

        {/* Divider */}
        <div className="panel-divider" />

        {/* 1. Color Customization Section */}
        <section className="config-section" aria-labelledby="section-color-title">
          <h2 id="section-color-title" className="visually-hidden">Color Selection</h2>
          <ColorSelector
            selectedColor={selectedColor}
            onSelectColor={onSelectColor}
          />
        </section>

        {/* Divider */}
        <div className="panel-divider" />

        {/* 2. Environment Lighting Section */}
        <section className="config-section" aria-labelledby="section-env-title">
          <h2 id="section-env-title" className="visually-hidden">Environment Selection</h2>
          <EnvironmentSelector
            selectedEnvironmentKey={selectedEnvironmentKey}
            onSelectEnvironment={onSelectEnvironment}
          />
        </section>

        {/* Divider */}
        <div className="panel-divider" />

        {/* 3. 3D Camera & Scene Tools */}
        <section className="config-section">
          <div className="section-header">
            <span className="section-label">Scene & Camera Controls</span>
          </div>

          <div className="scene-tools-row">
            {/* Reset Camera button */}
            <button
              type="button"
              className="scene-tool-button"
              onClick={onResetView}
              title="Reset camera back to default framed angle"
              id="btn-reset-camera"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>Reset View</span>
            </button>

            {/* Turntable Auto-Rotate button */}
            <button
              type="button"
              className={`scene-tool-button ${isAutoRotating ? 'active' : ''}`}
              onClick={onToggleAutoRotate}
              title="Toggle automatic turntable rotation"
              aria-pressed={isAutoRotating}
              id="btn-toggle-autorotate"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <span>{isAutoRotating ? 'Stop Spin' : 'Auto Rotate'}</span>
            </button>

            {/* Wireframe Mesh Inspection button */}
            <button
              type="button"
              className={`scene-tool-button ${isWireframe ? 'active' : ''}`}
              onClick={onToggleWireframe}
              title="Toggle wireframe rendering to inspect polygon geometry"
              aria-pressed={isWireframe}
              id="btn-toggle-wireframe"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span>{isWireframe ? 'Solid' : 'Wireframe'}</span>
            </button>
          </div>
        </section>

        {/* Divider */}
        <div className="panel-divider" />

        {/* 4. Specifications Collapsible */}
        <section className="specs-section">
          <button
            type="button"
            className="specs-toggle-button"
            onClick={() => setShowSpecs((prev) => !prev)}
            aria-expanded={showSpecs}
          >
            <span>Product Specifications</span>
            <span className={`specs-chevron ${showSpecs ? 'open' : ''}`}>▼</span>
          </button>

          {showSpecs && (
            <div className="specs-content-grid">
              <div className="spec-item">
                <span className="spec-label">Dimensions</span>
                <span className="spec-value">{productDetails.dimensions}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Weight</span>
                <span className="spec-value">{productDetails.weight}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Upholstery</span>
                <span className="spec-value">{productDetails.materials.upholstery}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Wood Frame</span>
                <span className="spec-value">{productDetails.materials.frame}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Hardware</span>
                <span className="spec-value">{productDetails.materials.hardware}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Designer</span>
                <span className="spec-value">{productDetails.designer}</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </aside>
    </>
  );
}
