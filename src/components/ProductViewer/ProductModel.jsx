import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { productDetails } from "../../config/productConfig";

// Tones down sheen on high-albedo colors to prevent lighting blowout
function getCalibratedSheenColor(hex) {
  const lower = (hex || "").toLowerCase();
  if (lower === "#dedede" || lower === "#ffffff") return "#666666";
  if (lower === "#991b1b" || lower === "#dc2626") return "#6b1414";
  return hex;
}

export function ProductModel({ selectedColorHex, onLoaded }) {
  const { scene } = useGLTF(productDetails.modelPath);

  const groupRef = useRef();
  const entranceFinishedRef = useRef(false);
  const targetMaterialRef = useRef(null);

  const modelData = useMemo(() => {
    const clone = scene.clone(true);
    let targetMaterial = null;

    clone.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;

      if (child.material) {
        child.material = child.material.clone();

        if (productDetails.targetMeshMatcher(child)) {
          targetMaterial = child.material;
          if (selectedColorHex) {
            targetMaterial.color.set(selectedColorHex);
            targetMaterial.sheenColor?.set(getCalibratedSheenColor(selectedColorHex));
          }
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    return {
      scene: clone,
      targetMaterial,
      box,
      center,
      size,
      maxDim: Math.max(size.x, size.y, size.z),
    };
  }, [scene, selectedColorHex]);

  useEffect(() => {
    targetMaterialRef.current = modelData.targetMaterial;
    onLoaded?.({
      box: modelData.box,
      size: modelData.size,
      center: new THREE.Vector3(0, modelData.size.y / 2, 0),
      maxDim: modelData.maxDim,
      minY: modelData.box.min.y,
    });
  }, [modelData, onLoaded]);

  useEffect(() => {
    const mat = targetMaterialRef.current;
    if (mat && selectedColorHex) {
      mat.color.set(selectedColorHex);
      mat.sheenColor?.set(getCalibratedSheenColor(selectedColorHex));
      mat.needsUpdate = true;
    }
  }, [selectedColorHex]);

  // Entrance animation
  useFrame((_, delta) => {
    if (entranceFinishedRef.current || !groupRef.current) return;

    const g = groupRef.current;
    g.position.y = THREE.MathUtils.damp(g.position.y, 0, 4, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, 0, 3.5, delta);

    if (Math.abs(g.position.y) < 0.001 && Math.abs(g.rotation.y) < 0.001) {
      g.position.y = 0;
      g.rotation.y = 0;
      entranceFinishedRef.current = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.35, 0]} rotation={[0, -0.35, 0]}>
      <primitive
        object={modelData.scene}
        position={[
          -modelData.center.x,
          -modelData.box.min.y,
          -modelData.center.z,
        ]}
      />
    </group>
  );
}

useGLTF.preload(productDetails.modelPath);
