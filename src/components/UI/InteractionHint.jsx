/**
 * InteractionHint Component
 * 
 * Elegant floating micro-guide that instructs the evaluator or user on 3D interaction.
 */
export function InteractionHint() {
  return (
    <div className="interaction-hint-pill" id="interaction-hint">
      <span className="hint-item">
        <span className="hint-icon">🖱️</span> Drag to rotate
      </span>
      <span className="hint-separator">•</span>
      <span className="hint-item">
        <span className="hint-icon">🔍</span> Scroll to zoom
      </span>
      <span className="hint-separator">•</span>
      <span className="hint-item">
        <span className="hint-icon">📐</span> Right-click to pan
      </span>
    </div>
  );
}
