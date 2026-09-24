export const productDetails = {
  name: "LOUNGE CHAIR",
  tagline: "Signature Edition",
  modelPath: "/models/product.glb",
  targetMeshMatcher: (mesh) => {
    const name = (mesh.name || "").toLowerCase();
    const matName = (mesh.material?.name || "").toLowerCase();
    return (
      name.includes("fabric") ||
      matName.includes("fabric") ||
      name === "sheenchair_fabric"
    );
  },
};

export const productColors = [
  {
    id: "white",
    name: "White",
    hex: "#dedede",
    description: "Pure, radiant white with luminous, high-key clarity.",
  },
  {
    id: "red",
    name: "Red",
    hex: "#991b1b",
    description: "Vibrant, bold crimson red with deep luxury undertones.",
  },
  {
    id: "green",
    name: "Green",
    hex: "#16a34a",
    description: "Rich botanical emerald green with organic warmth.",
  },
  {
    id: "blue",
    name: "Blue",
    hex: "#2563eb",
    description: "Striking royal cobalt blue with sophisticated depth.",
  },
];

export const defaultColor = productColors[0];
