import { useProgress } from "@react-three/drei";

export function Loader() {
  const { progress } = useProgress();

  if (progress === 100) return null;

  return (
    <div className="product-loader-overlay">
      <div className="loader-editorial-content">
        <span className="loader-brand-line">ATELIER AERO</span>
        <h2 className="loader-title-line">LOUNGE CHAIR</h2>
        <div className="loader-hairline-track">
          <div
            className="loader-hairline-bar"
            style={{ width: `${Math.max(progress, 8)}%` }}
          />
        </div>
        <div className="loader-status-line">
          {progress ? `Preparing Scene · ${Math.round(progress)}%` : "Initializing"}
        </div>
      </div>
    </div>
  );
}
