export const environments = {
  studio: {
    id: "studio",
    name: "Studio",
    exposure: 1.08,
    backgroundGradient:
      "radial-gradient(ellipse at 50% 38%, #26292F 0%, #1B1D22 45%, #121417 100%)",
    lighting: {
      ambient: { color: "#D8D0C5", intensity: 0.52 },
      hemisphere: {
        skyColor: "#F1ECE5",
        groundColor: "#3A3834",
        intensity: 0.68,
      },
      keyLight: {
        color: "#FFF2E6",
        intensity: 2.3,
        position: [2.8, 4.2, 2.6],
        castShadow: false,
      },
      fillLight: {
        color: "#E8EDF2",
        intensity: 1.2,
        position: [-2.6, 2.6, 2.0],
        castShadow: false,
      },
      rimLight: {
        color: "#DDE7F0",
        intensity: 0.8,
        position: [1.8, 2.6, -2.4],
      },
    },
    ground: {
      shadowOpacity: 0.28,
      floorColor: "#35342F",
    },
  },

  outdoor: {
    id: "outdoor",
    name: "Daylight",
    exposure: 1.0,
    backgroundGradient:
      "linear-gradient(180deg, #6ea3ce 0%, #9bc2db 45%, #dce9f2 100%)",
    lighting: {
      ambient: { color: "#cbe3f7", intensity: 0.25 },
      hemisphere: {
        skyColor: "#7ec0ee",
        groundColor: "#cfc4b0",
        intensity: 0.85,
      },
      keyLight: {
        color: "#fff8ea",
        intensity: 2.8,
        position: [7, 12, 6],
        castShadow: true,
        shadowBias: -0.0001,
      },
      fillLight: {
        color: "#b4d7f5",
        intensity: 0.5,
        position: [-6, 6, -3],
      },
      rimLight: {
        color: "#fffdfa",
        intensity: 0.4,
        position: [-4, 7, -6],
      },
    },
    ground: {
      shadowOpacity: 0.35,
      floorColor: "#d8d3c8",
    },
  },
};

export const defaultEnvironmentKey = "studio";
