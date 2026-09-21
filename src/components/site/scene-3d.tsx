"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Site-wide WebGL backdrop, fixed behind the content:
 * - a deep field of particles in the theme's gradient colours,
 * - a wireframe "AI core" (icosahedron + orbit rings),
 * - the camera dollies forward through the field as the page scrolls,
 *   and drifts toward the pointer for parallax.
 * One WebGL context for the whole page; paused when hidden or off-tab;
 * a single still frame under prefers-reduced-motion.
 */
export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !small, powerPreference: "low-power" });
    } catch {
      return; // No WebGL: the page still works, just without the backdrop.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    // ---- theme colours ------------------------------------------------------
    const colors = { a: new THREE.Color(), b: new THREE.Color(), c: new THREE.Color(), dark: true };
    function readTheme() {
      const css = getComputedStyle(document.documentElement);
      colors.a.set(css.getPropertyValue("--grad-1").trim() || "#22d3ee");
      colors.b.set(css.getPropertyValue("--grad-2").trim() || "#3b82f6");
      colors.c.set(css.getPropertyValue("--grad-3").trim() || "#a78bfa");
      colors.dark = document.documentElement.classList.contains("dark");
    }
    readTheme();

    // ---- particle field -----------------------------------------------------
    const COUNT = small ? 900 : 2200;
    const DEPTH = 60;
    const positions = new Float32Array(COUNT * 3);
    const tints = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = 8 - Math.random() * DEPTH;
      tints[i] = Math.random();
    }
    const colorAttr = new Float32Array(COUNT * 3);
    const fieldGeo = new THREE.BufferGeometry();
    fieldGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    fieldGeo.setAttribute("color", new THREE.BufferAttribute(colorAttr, 3));

    const dot = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d")!;
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, "rgba(255,255,255,1)");
      grd.addColorStop(0.35, "rgba(255,255,255,0.7)");
      grd.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();

    const fieldMat = new THREE.PointsMaterial({
      size: small ? 0.09 : 0.075,
      map: dot,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const field = new THREE.Points(fieldGeo, fieldMat);
    scene.add(field);

    // ---- AI core ------------------------------------------------------------
    const core = new THREE.Group();
    const icoGeo = new THREE.IcosahedronGeometry(1.7, 1);
    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(icoGeo),
      new THREE.LineBasicMaterial({ transparent: true })
    );
    core.add(wire);
    const nodes = new THREE.Points(
      icoGeo,
      new THREE.PointsMaterial({ size: 0.12, map: dot, transparent: true, depthWrite: false })
    );
    core.add(nodes);
    const inner = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.85, 0)),
      new THREE.LineBasicMaterial({ transparent: true })
    );
    core.add(inner);
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 2; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.5 + i * 0.45, 0.006, 8, 160),
        new THREE.MeshBasicMaterial({ transparent: true })
      );
      ring.rotation.x = Math.PI / 2.4 + i * 0.5;
      ring.rotation.y = i * 0.7;
      rings.push(ring);
      core.add(ring);
    }
    core.position.set(small ? 0.6 : 4.1, small ? 1.6 : 0.1, 0);
    if (small) core.scale.setScalar(0.7);
    // Behind body text on phones, so keep it faint there.
    const coreStrength = small ? 0.25 : 1;
    scene.add(core);

    // Core materials with their full-strength opacity, so the core can fade
    // out as the camera dollies toward it.
    const coreMats: { mat: THREE.Material & { opacity: number }; base: number }[] = [];

    function applyTheme() {
      coreMats.length = 0;
      const additive = colors.dark ? THREE.AdditiveBlending : THREE.NormalBlending;
      for (let i = 0; i < COUNT; i++) {
        const t = tints[i];
        const col = t < 0.5 ? colors.a.clone().lerp(colors.b, t * 2) : colors.b.clone().lerp(colors.c, (t - 0.5) * 2);
        colorAttr[i * 3] = col.r;
        colorAttr[i * 3 + 1] = col.g;
        colorAttr[i * 3 + 2] = col.b;
      }
      fieldGeo.attributes.color.needsUpdate = true;
      fieldMat.opacity = colors.dark ? 0.85 : 0.55;
      fieldMat.blending = additive;
      fieldMat.needsUpdate = true;

      const wm = wire.material as THREE.LineBasicMaterial;
      wm.color.copy(colors.b);
      wm.opacity = colors.dark ? 0.45 : 0.35;
      const nm = nodes.material as THREE.PointsMaterial;
      nm.color.copy(colors.a);
      nm.opacity = colors.dark ? 0.95 : 0.7;
      nm.blending = additive;
      nm.needsUpdate = true;
      const im = inner.material as THREE.LineBasicMaterial;
      im.color.copy(colors.c);
      im.opacity = colors.dark ? 0.55 : 0.4;
      rings.forEach((r, i) => {
        const m = r.material as THREE.MeshBasicMaterial;
        m.color.copy(i ? colors.c : colors.a);
        m.opacity = colors.dark ? 0.5 : 0.35;
        coreMats.push({ mat: m, base: m.opacity });
      });
      coreMats.push({ mat: wm, base: wm.opacity }, { mat: nm, base: nm.opacity }, { mat: im, base: im.opacity });
    }
    function setCoreFade(f: number) {
      core.visible = f > 0.01;
      for (const { mat, base } of coreMats) mat.opacity = base * f;
    }
    applyTheme();

    // ---- interaction --------------------------------------------------------
    const pointer = { x: 0, y: 0 };
    let scrollProgress = 0;
    function onPointer(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    }
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? window.scrollY / max : 0;
    }
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (reduced) renderer.render(scene, camera);
    }
    const themeObserver = new MutationObserver(() => {
      readTheme();
      applyTheme();
      if (reduced) {
        setCoreFade(coreStrength);
        renderer.render(scene, camera);
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", onResize);
    if (!reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    // ---- loop ---------------------------------------------------------------
    const clock = new THREE.Clock();
    let raf = 0;
    function frame() {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      const t = clock.getElapsedTime();

      // Dolly: the camera travels forward through the field as you scroll.
      const targetZ = 7 - scrollProgress * 38;
      camera.position.z += (targetZ - camera.position.z) * 0.06;
      camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.04;
      camera.position.y += (-pointer.y * 0.8 - camera.position.y) * 0.04;
      camera.lookAt(camera.position.x * 0.3, camera.position.y * 0.3, camera.position.z - 10);

      core.rotation.y = t * 0.18;
      core.rotation.x = Math.sin(t * 0.25) * 0.25;
      inner.rotation.y = -t * 0.5;
      rings[0].rotation.z = t * 0.3;
      rings[1].rotation.z = -t * 0.22;
      core.scale.setScalar((small ? 0.7 : 1) * (1 + Math.sin(t * 0.8) * 0.025));
      // Fully visible at the top of the page; gone before the camera reaches it.
      const gap = camera.position.z - core.position.z;
      setCoreFade(coreStrength * Math.min(1, Math.max(0, (gap - 2.5) / 3.5)));

      field.rotation.z = t * 0.01;
      renderer.render(scene, camera);
    }
    if (reduced) {
      setCoreFade(coreStrength);
      renderer.render(scene, camera);
    } else {
      frame();
    }

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      scene.traverse((obj) => {
        const o = obj as THREE.Mesh;
        o.geometry?.dispose();
        const mat = o.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      dot.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 print:hidden"
    />
  );
}
