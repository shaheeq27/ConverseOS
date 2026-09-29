"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function AIDataGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Graceful fallback: if WebGL is unavailable, do nothing
    let canvas: HTMLCanvasElement;
    try {
      canvas = document.createElement("canvas");
      const ctx = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!ctx) return;
    } catch {
      return;
    }

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 32;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.pointerEvents = "none";
    container.appendChild(renderer.domElement);

    // ── Globe group (rotation applied here) ──
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // ── Parallax group (subtle mouse tilt, wraps globeGroup) ──
    const parallaxGroup = new THREE.Group();
    parallaxGroup.add(globeGroup);
    scene.add(parallaxGroup);

    // ─── 1. Core inner sphere ───
    const coreGeo = new THREE.IcosahedronGeometry(9.6, 4);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x06060e,
      transparent: true,
      opacity: 0.8,
    });
    globeGroup.add(new THREE.Mesh(coreGeo, coreMat));

    // ─── 2. Primary wireframe (fine tessellation) ───
    const wireGeo1 = new THREE.IcosahedronGeometry(10, 3);
    const edges1 = new THREE.EdgesGeometry(wireGeo1);
    const wireMat1 = new THREE.LineBasicMaterial({
      color: 0x3b82f6, // Electric blue (primary brand)
      transparent: true,
      opacity: 0.12,
    });
    globeGroup.add(new THREE.LineSegments(edges1, wireMat1));

    // ─── 3. Secondary wireframe (coarser, slightly larger → depth) ───
    const wireGeo2 = new THREE.IcosahedronGeometry(10.15, 2);
    const edges2 = new THREE.EdgesGeometry(wireGeo2);
    const wireMat2 = new THREE.LineBasicMaterial({
      color: 0x8b5cf6, // Violet
      transparent: true,
      opacity: 0.09,
    });
    globeGroup.add(new THREE.LineSegments(edges2, wireMat2));

    // ─── 4. Network nodes ───
    const nodePositions = wireGeo1.getAttribute("position");
    const nodeMat = new THREE.PointsMaterial({
      color: 0x6366f1, // Blue-violet nodes
      size: 0.22,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    globeGroup.add(new THREE.Points(wireGeo1, nodeMat));

    // ─── 5. Connection lines between nearby nodes ───
    const connectionVerts: number[] = [];
    const threshold = 4.5;
    const posArr = nodePositions.array;
    const visited = new Set<string>();
    for (let i = 0; i < nodePositions.count; i++) {
      const ax = posArr[i * 3],
        ay = posArr[i * 3 + 1],
        az = posArr[i * 3 + 2];
      for (let j = i + 1; j < nodePositions.count; j++) {
        const bx = posArr[j * 3],
          by = posArr[j * 3 + 1],
          bz = posArr[j * 3 + 2];
        const d = Math.sqrt(
          (ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2
        );
        if (d < threshold) {
          const key = `${i}-${j}`;
          if (!visited.has(key)) {
            visited.add(key);
            connectionVerts.push(ax, ay, az, bx, by, bz);
          }
        }
      }
    }
    const connGeo = new THREE.BufferGeometry();
    connGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(connectionVerts, 3)
    );
    const connMat = new THREE.LineBasicMaterial({
      color: 0x3b82f6, // Blue connections
      transparent: true,
      opacity: 0.06,
    });
    globeGroup.add(new THREE.LineSegments(connGeo, connMat));

    // ─── 6. Orbital rings ───
    const orbitGroup = new THREE.Group();
    globeGroup.add(orbitGroup);

    const ring1Geo = new THREE.TorusGeometry(12, 0.015, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x6366f1, // Indigo
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    orbitGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(13.5, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6, // Blue
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 6;
    ring2.rotation.y = Math.PI / 4;
    orbitGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(11, 0.01, 16, 80);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6, // Violet
      transparent: true,
      opacity: 0.07,
      blending: THREE.AdditiveBlending,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.z = Math.PI / 5;
    orbitGroup.add(ring3);

    // ─── 7. Outer floating particles ───
    const pCount = 120;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      // Distribute in a sphere shell around the globe
      const r = 14 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
    }
    pGeo.setAttribute("position", new THREE.Float32BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x6366f1, // Indigo-blue particles
      size: 0.08,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const outerParticles = new THREE.Points(pGeo, pMat);
    scene.add(outerParticles);

    // ── Animation ──
    let animId: number;
    const clock = new THREE.Clock();
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Mouse parallax (very subtle)
    let mX = 0,
      mY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mX = (e.clientX / window.innerWidth - 0.5) * 0.15;
      mY = (e.clientY / window.innerHeight - 0.5) * 0.15;
    };
    if (!reducedMotion) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    const tick = () => {
      animId = requestAnimationFrame(tick);

      if (!reducedMotion) {
        const t = clock.getElapsedTime();

        // Continuous slow rotation on the globe
        globeGroup.rotation.y += 0.0012;
        globeGroup.rotation.x = 0.15 + Math.sin(t * 0.3) * 0.04;

        // Subtle floating bob
        globeGroup.position.y = Math.sin(t * 0.5) * 0.4;

        // Orbit rings counter-rotate
        orbitGroup.rotation.y -= 0.002;
        orbitGroup.rotation.z += 0.0008;

        // Outer particles drift
        outerParticles.rotation.y -= 0.0003;

        // Very subtle parallax tilt on the wrapper
        parallaxGroup.rotation.y += (mX - parallaxGroup.rotation.y) * 0.02;
        parallaxGroup.rotation.x += (-mY - parallaxGroup.rotation.x) * 0.02;
      }

      renderer.render(scene, camera);
    };
    tick();

    // ── Resize ──
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Cleanup ──
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();

      // Dispose all geometries & materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        }
      });
      connGeo.dispose();
      connMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[300px]"
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    />
  );
}
