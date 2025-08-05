import React, { Component, ReactNode } from "react";
import { Icon } from "./Icon";

interface LocationErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface LocationErrorBoundaryProps {
  children: ReactNode;
}

export default class LocationErrorBoundary extends Component<
  LocationErrorBoundaryProps,
  LocationErrorBoundaryState
> {
  constructor(props: LocationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): LocationErrorBoundaryState {
    // Check if this is a location-related error
    if (error.message.includes("Location is not available")) {
      return { hasError: true, error };
    }
    // Re-throw non-location errors to be handled by other error boundaries
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log location errors for debugging
    if (error.message.includes("Location is not available")) {
      console.error(
        "LocationErrorBoundary caught a location error:",
        error,
        errorInfo
      );
    }
  }

  private handleRetry = () => {
    // Reset error boundary state and trigger a re-render
    this.setState({ hasError: false, error: null });

    // Reload the page to restart the location loading process
    window.location.reload();
  };

  private handleAllowLocation = () => {
    // Guide user to enable location permissions
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // If successful, retry
          this.handleRetry();
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Still retry to let the app fall back to default location
          this.handleRetry();
        }
      );
    } else {
      this.handleRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            padding: "2rem",
            textAlign: "center",
            gap: "1.5rem",
          }}
        >
          <Icon name="location" size="xl" />

          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "var(--color-text-primary)",
              }}
            >
              Location Required
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--color-text-secondary)",
                maxWidth: "400px",
                lineHeight: "1.5",
              }}
            >
              This app needs your location to show accurate Milky Way visibility
              times. Please allow location access or the app will use Los
              Angeles as the default location.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={this.handleAllowLocation}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "var(--color-accent)",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "opacity 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Allow Location Access
            </button>

            <button
              onClick={this.handleRetry}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "transparent",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border)",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--color-surface-hover)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Use Default Location
            </button>
          </div>

          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-tertiary)",
              fontStyle: "italic",
            }}
          >
            You can change your location anytime using the location button in
            the app.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
