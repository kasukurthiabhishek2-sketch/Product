import { useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { productDetails } from '../../config/productConfig';

/**
 * ProductModel Component
 * 
 * CORE THREE.JS & REACT 19 CONCEPTS DEMONSTRATED:
 * 
 * 1. GLB Loading (`useGLTF`):
 *    glTF/GLB is the standard format for 3D transmission. It bundles nodes, meshes,
 *    materials, and textures into one compact binary.
 * 
 * 2. Scene Graph Hierarchy & Cloning:
 *    A GLB scene graph is a hierarchy of nodes. We clone the scene so multiple renders
 *    stay pure, traverse every node to enable shadows (`castShadow`, `receiveShadow`),
 *    and clone materials so our color edits are isolated.
 * 
 * 3. Bounding Box Calculation (`THREE.Box3`):
 *    Computes the exact dimensions (`size`, `center`, `maxDim`) of arbitrary 3D geometry
 *    regardless of how the asset was exported from 3D modeling tools.
 * 
 * 4. Zero-Reload Realtime Material Tuning:
 *    When `selectedColorHex` changes, we update `material.color.set(hex)` directly on the
 *    in-memory Three.js material. We NEVER reload the GLB or recreate the scene.
 * 
 * 5. Smooth Entrance Animation (`useFrame`):
 *    Interpolates the model from an offset position/rotation to resting pose on load,
 *    then sleeps once settled to keep GPU/CPU usage low.
 */
export function ProductModel({ selectedColorHex, isWireframe = false, onLoaded }) {
  // Load GLB asset via @react-three/drei
  const { scene } = useGLTF(productDetails.modelPath);

  // Group reference for the entrance animation
  const groupRef = useRef();
  const entranceFinishedRef = useRef(false);

  // References for mutable Three.js materials
  // Stored in refs and updated in useEffect to satisfy React 19 immutability guidelines
  const targetMaterialRef = useRef(null);
  const allMaterialsRef = useRef([]);

  /**
   * Parse, clone, and compute spatial bounding box in useMemo
   * Keeps renders pure without mutating refs during render.
   */
  const modelData = useMemo(() => {
    const clone = scene.clone(true);
    let targetMaterial = null;
    const allMaterials = [];

    // Traverse the 3D scene hierarchy
    clone.traverse((child) => {
      if (child.isMesh) {
        // Enable shadows for realistic light interaction
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          // Clone material to prevent global cache pollution
          child.material = child.material.clone();
          allMaterials.push(child.material);

          // Identify the customizable upholstery mesh/material
          if (productDetails.targetMeshMatcher(child)) {
            targetMaterial = child.material;
          }
        }
      }
    });

    // Fallback: assign first mesh material if matcher didn't trigger
    if (!targetMaterial && allMaterials.length > 0) {
      targetMaterial = allMaterials[0];
    }

    // Compute bounding box
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);

    return {
      scene: clone,
      targetMaterial,
      allMaterials,
      box,
      center,
      size,
      maxDim
    };
  }, [scene]);

  /**
   * Sync material references and notify CameraController once bounds are ready
   */
  useEffect(() => {
    targetMaterialRef.current = modelData.targetMaterial;
    allMaterialsRef.current = modelData.allMaterials;

    if (onLoaded) {
      onLoaded({
        box: modelData.box,
        size: modelData.size,
        center: new THREE.Vector3(0, modelData.size.y / 2, 0),
        maxDim: modelData.maxDim,
        minY: modelData.box.min.y
      });
    }
  }, [modelData, onLoaded]);

  /**
   * Realtime Material Color Update
   * 
   * Updates Three.js material uniform directly without scene reload.
   */
  useEffect(() => {
    if (targetMaterialRef.current && selectedColorHex) {
      targetMaterialRef.current.color.set(selectedColorHex);
      targetMaterialRef.current.needsUpdate = true;
    }
  }, [selectedColorHex]);

  /**
   * Wireframe Mode Toggle
   */
  useEffect(() => {
    allMaterialsRef.current.forEach((mat) => {
      mat.wireframe = isWireframe;
      mat.needsUpdate = true;
    });
  }, [isWireframe]);

  /**
   * Smooth Entrance Animation via useFrame
   */
  useFrame((_, delta) => {
    if (entranceFinishedRef.current || !groupRef.current) return;

    // Smoothly damp position towards resting y = 0
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      0,
      4,
      delta
    );

    // Smoothly damp rotation towards resting y = 0
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      0,
      3.5,
      delta
    );

    // Sleep once settled to conserve CPU/GPU
    if (
      Math.abs(groupRef.current.position.y) < 0.001 &&
      Math.abs(groupRef.current.rotation.y) < 0.001
    ) {
      groupRef.current.position.y = 0;
      groupRef.current.rotation.y = 0;
      entranceFinishedRef.current = true;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, -0.35, 0]}
      rotation={[0, -0.35, 0]}
    >
      {/* 
        Position offset centers the model at the world origin (0, 0, 0)
        and places the base flat on the ground plane (y = 0)
      */}
      <primitive
        object={modelData.scene}
        position={[
          -modelData.center.x,
          -modelData.box.min.y,
          -modelData.center.z
        ]}
      />
    </group>
  );
}

// Pre-load asset for seamless rendering
useGLTF.preload(productDetails.modelPath);
