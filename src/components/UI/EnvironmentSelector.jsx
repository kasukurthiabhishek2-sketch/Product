import { environments } from "../../config/environments";

const ENV_TONES = {
  studio: "#222834",
  outdoor: "#c4deef",
  interior: "#3a2419",
};

export function EnvironmentSelector({
  selectedEnvironmentKey,
  onSelectEnvironment,
}) {
  return (
    <div className="control-group">
      <div className="group-header">
        <span className="group-label">ATMOSPHERE</span>
        <span className="group-value">
          {environments[selectedEnvironmentKey]?.name}
        </span>
      </div>

      <div
        className="env-segmented-row"
        role="group"
        aria-label="Scene atmosphere presets"
      >
        {Object.values(environments).map((env) => (
          <button
            key={env.id}
            type="button"
            className={`env-segmented-item ${selectedEnvironmentKey === env.id ? "active" : ""}`}
            onClick={() => onSelectEnvironment(env.id)}
            aria-pressed={selectedEnvironmentKey === env.id}
            id={`env-preset-${env.id}`}
          >
            <span
              className="env-indicator-dot"
              style={{ backgroundColor: ENV_TONES[env.id] || "#333" }}
            />
            <span className="env-item-label">{env.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
