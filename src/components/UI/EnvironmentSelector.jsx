import { environments } from '../../config/environments';

/**
 * EnvironmentSelector Component
 * 
 * Allows users to toggle between data-driven lighting and mood environments.
 */
export function EnvironmentSelector({
  selectedEnvironmentKey,
  onSelectEnvironment
}) {
  const envList = Object.values(environments);

  // Helper icons
  const renderIcon = (type) => {
    switch (type) {
      case 'studio':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        );
      case 'sun':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
          </svg>
        );
      case 'lamp':
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21h6" />
            <path d="M12 3a6 6 0 0 0-6 6c0 2.2 1.3 4 3 5v3h6v-3c1.7-1 3-2.8 3-5a6 6 0 0 0-6-6z" />
          </svg>
        );
    }
  };

  return (
    <div className="environment-selector-wrapper">
      <div className="section-header">
        <span className="section-label">Environment Lighting</span>
        <span className="selected-value-badge">
          {environments[selectedEnvironmentKey]?.name}
        </span>
      </div>

      <div
        className="environment-buttons-grid"
        role="group"
        aria-label="Scene environment presets"
      >
        {envList.map((env) => {
          const isSelected = selectedEnvironmentKey === env.id;

          return (
            <button
              key={env.id}
              type="button"
              className={`env-card-button ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectEnvironment(env.id)}
              aria-pressed={isSelected}
              id={`env-preset-${env.id}`}
            >
              <div className="env-button-icon">
                {renderIcon(env.icon)}
              </div>
              <div className="env-button-info">
                <span className="env-button-name">{env.name}</span>
                <span className="env-button-tagline">{env.tagline}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
