import { productColors } from "../../config/productConfig";

export function ColorSelector({ selectedColor, onSelectColor }) {
  return (
    <div className="control-group">
      <div className="group-header">
        <span className="group-label">COLOR</span>
        <span className="group-value">{selectedColor.name}</span>
      </div>

      <div className="swatch-row" role="group" aria-label="Color options">
        {productColors.map((color) => (
          <button
            key={color.id}
            type="button"
            className={`swatch-item ${selectedColor.id === color.id ? "active" : ""}`}
            onClick={() => onSelectColor(color)}
            aria-label={`Select ${color.name}`}
            aria-pressed={selectedColor.id === color.id}
            id={`color-swatch-${color.id}`}
          >
            <span
              className="swatch-disc"
              style={{ backgroundColor: color.hex }}
            />
            <span className="swatch-label">{color.name}</span>
          </button>
        ))}
      </div>

      <p className="material-narrative">{selectedColor.description}</p>
    </div>
  );
}
