import { useState } from "react";
import { defaultColor } from "../config/productConfig";
import { environments, defaultEnvironmentKey } from "../config/environments";

export function useProductConfiguration() {
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [selectedEnvironmentKey, setSelectedEnvironmentKey] =
    useState(defaultEnvironmentKey);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  const currentEnvironment =
    environments[selectedEnvironmentKey] || environments[defaultEnvironmentKey];

  return {
    selectedColor,
    selectedEnvironmentKey,
    currentEnvironment,
    isAutoRotating,
    resetTrigger,
    handleColorChange: setSelectedColor,
    handleEnvironmentChange: (key) => {
      if (environments[key]) setSelectedEnvironmentKey(key);
    },
    toggleAutoRotate: () => setIsAutoRotating((prev) => !prev),
    triggerResetView: () => setResetTrigger((prev) => prev + 1),
  };
}
