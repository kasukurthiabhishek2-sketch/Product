import React from 'react';

/**
 * ErrorBoundary for 3D Viewer
 * 
 * Catches WebGL, shader compilation, or GLB asset network errors gracefully
 * so the entire React application does not crash to a blank screen.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Product Configurator Error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback-container">
          <div className="error-fallback-card">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Unable to load 3D Product</h2>
            <p className="error-description">
              There was an issue loading the 3D model asset or initializing WebGL.
              Please ensure WebGL is enabled in your browser.
            </p>
            <p className="error-detail-text">
              {this.state.error?.message || 'Check the model file path in /models/product.glb'}
            </p>
            <button
              type="button"
              className="error-retry-button"
              onClick={this.handleReload}
            >
              Retry Loading
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
