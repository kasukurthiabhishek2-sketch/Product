import { useProgress } from '@react-three/drei';

/**
 * 3D Asset Loading Screen
 * 
 * Uses @react-three/drei's `useProgress` hook which automatically hooks into
 * Three.js DefaultLoadingManager to report asset download and parsing progress.
 */
export function Loader() {
  const { progress } = useProgress();

  if (progress === 100) return null;

  return (
    <div className="product-loader-overlay">
      <div className="product-loader-card">
        <div className="loader-spinner">
          <div className="spinner-inner"></div>
        </div>
        <div className="loader-text-group">
          <h3 className="loader-title">Loading 3D Model</h3>
          <p className="loader-subtitle">Preparing geometry, materials & textures...</p>
        </div>
        <div className="loader-progress-bar-container">
          <div
            className="loader-progress-bar-fill"
            style={{ width: `${Math.max(progress, 15)}%` }}
          ></div>
        </div>
        <span className="loader-percentage">{progress ? `${progress.toFixed(0)}%` : 'Initializing'}</span>
      </div>
    </div>
  );
}
