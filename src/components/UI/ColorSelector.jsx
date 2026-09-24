import { productColors } from '../../config/productConfig';

/**
 * ColorSelector Component
 * 
 * Demonstrates accessible, data-driven swatch selection with micro-animations.
 * Uses semantic `<button>` elements with `aria-label` and `aria-pressed`.
 */
export function ColorSelector({ selectedColor, onSelectColor }) {
  return (
    <div className="color-selector-wrapper">
      <div className="section-header">
        <span className="section-label">Upholstery Velvet</span>
        <span className="selected-value-badge">{selectedColor.name}</span>
      </div>

      <div
        className="color-swatches-grid"
        role="group"
        aria-label="Product color options"
      >
        {productColors.map((color) => {
          const isSelected = selectedColor.id === color.id;

          return (
            <button
              key={color.id}
              type="button"
              className={`color-swatch-button ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectColor(color)}
              aria-label={`Select ${color.name}`}
              aria-pressed={isSelected}
              title={`${color.name} - ${color.description}`}
              id={`color-swatch-${color.id}`}
            >
              <span
                className="color-swatch-circle"
                style={{
                  backgroundColor: color.hex,
                  boxShadow: isSelected
                    ? `0 0 0 2px rgba(255,255,255,0.9), 0 0 16px ${color.hex}`
                    : 'none'
                }}
              />
              {isSelected && <span className="swatch-check-mark">✓</span>}
            </button>
          );
        })}
      </div>

      <p className="color-description-caption">
        {selectedColor.description}
      </p>
    </div>
  );
}
