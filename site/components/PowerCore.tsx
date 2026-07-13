"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/**
 * THE POWER CORE — rebuilt.
 * A dormant liquid-chrome sculpture holding a contained star.
 * `activation` 0 → 1 drives the awakening: inner light swells, the fresnel
 * atmosphere ignites, the chrome gyroscope quickens, energy radiates outward.
 *
 * Reads as ONE luminous object — not a scatter of edges. All effects are
 * built from three.js primitives + two tiny shaders. No extra dependencies.
 */

const CYAN = new THREE.Color("#bfe9ff");
const TEAL = new THREE.Color("#5fdccb");

/* Soft radial sprite — the atom of the faked bloom halo. */
function makeGlowTexture() {
  const size = 160;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(224,244,255,1)");
  g.addColorStop(0.18, "rgba(150,224,232,0.55)");
  g.addColorStop(0.45, "rgba(64,150,160,0.16)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

/* Fresnel atmosphere — a glowing rim that gives the orb a defined edge. */
const fresnelVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vView = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const fresnelFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  void main() {
    float f = pow(1.0 - clamp(dot(vNormal, vView), 0.0, 1.0), uPower);
    gl_FragColor = vec4(uColor * f * uIntensity, f);
  }
`;

function Core({ activation }: { activation: number }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const atmosphere = useRef<THREE.ShaderMaterial>(null);
  const rimMat = useRef<THREE.ShaderMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const halo = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const dust = useRef<THREE.Points>(null);

  const glowTex = useMemo(makeGlowTexture, []);

  const atmosphereUniforms = useMemo(
    () => ({
      uColor: { value: TEAL.clone() },
      uPower: { value: 2.6 },
      uIntensity: { value: 1.0 },
    }),
    [],
  );
  const rimUniforms = useMemo(
    () => ({
      uColor: { value: CYAN.clone() },
      uPower: { value: 3.4 },
      uIntensity: { value: 0.9 },
    }),
    [],
  );

  /* Orbiting energy field — kills the empty black around the core. */
  const dustGeo = useMemo(() => {
    const N = 2200;
    const pos = new Float32Array(N * 3);
    const rnd = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const r = 1.45 + Math.pow(Math.random(), 0.7) * 1.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * 0.78;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      rnd[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("arnd", new THREE.BufferAttribute(rnd, 1));
    return geo;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // Never fully dormant — a floor of life; scroll amplifies it.
    const a = 0.32 + activation * 0.68;
    const pulse = Math.sin(t * 1.3);

    if (group.current) {
      group.current.rotation.y += delta * (0.08 + a * 0.13);
      group.current.rotation.x = Math.sin(t * 0.12) * 0.06;
    }
    if (inner.current) {
      const mat = inner.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.1 + a * 3.6 + pulse * 0.3 * a;
      const s = 0.62 + a * 0.08 + pulse * 0.01 * a;
      inner.current.scale.setScalar(s);
    }
    if (light.current) {
      light.current.intensity = 7 + a * 26 + pulse * 1.4 * a;
    }
    if (atmosphere.current) {
      atmosphere.current.uniforms.uIntensity.value = 0.6 + a * 1.9 + pulse * 0.12 * a;
    }
    if (rimMat.current) {
      rimMat.current.uniforms.uIntensity.value = 0.5 + a * 1.1;
    }
    if (shell.current) {
      const mat = shell.current.material as THREE.MeshPhysicalMaterial;
      mat.opacity = 0.34 - a * 0.14; // the sculpture "opens" — dissolves to reveal the star
      shell.current.scale.setScalar(1 + a * 0.06);
      shell.current.rotation.y -= delta * 0.05;
      shell.current.rotation.z = Math.sin(t * 0.2) * 0.1;
    }
    if (halo.current) {
      const s = 2.4 + a * 1.6 + pulse * 0.06 * a;
      halo.current.scale.setScalar(s);
      halo.current.children.forEach((c) => {
        const m = (c as THREE.Sprite).material as THREE.SpriteMaterial;
        m.opacity = 0.18 + a * 0.5;
      });
    }
    if (ringA.current) ringA.current.rotation.z += delta * (0.14 + a * 0.22);
    if (ringB.current) ringB.current.rotation.x -= delta * (0.1 + a * 0.18);
    if (ringC.current) ringC.current.rotation.y += delta * (0.08 + a * 0.14);
    if (dust.current) {
      dust.current.rotation.y += delta * (0.03 + a * 0.06);
      dust.current.rotation.x = Math.sin(t * 0.1) * 0.1;
      const m = dust.current.material as THREE.PointsMaterial;
      m.opacity = 0.25 + a * 0.5;
      m.size = 0.016 + a * 0.01;
    }
  });

  return (
    <group ref={group}>
      {/* Contained star — smooth, high-detail, luminous */}
      <mesh ref={inner}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#0a0d10"
          emissive="#dff2ff"
          emissiveIntensity={1.1}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>
      <pointLight ref={light} intensity={7} distance={12} color="#bfe9ff" />

      {/* Inner rim light — defines the star's edge */}
      <mesh scale={0.66}>
        <sphereGeometry args={[1, 48, 48]} />
        <shaderMaterial
          ref={rimMat}
          vertexShader={fresnelVertex}
          fragmentShader={fresnelFragment}
          uniforms={rimUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Atmosphere — the glowing halo shell (defined luminous orb) */}
      <mesh scale={1.35}>
        <sphereGeometry args={[1, 48, 48]} />
        <shaderMaterial
          ref={atmosphere}
          vertexShader={fresnelVertex}
          fragmentShader={fresnelFragment}
          uniforms={atmosphereUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Liquid-chrome sculpture — faceted containment that opens on activation */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.22, 1]} />
        <meshPhysicalMaterial
          color="#c9ccd1"
          metalness={1}
          roughness={0.14}
          transparent
          opacity={0.34}
          flatShading
          depthWrite={false}
        />
      </mesh>

      {/* Faked bloom — billboarded soft glow */}
      <group ref={halo}>
        <sprite>
          <spriteMaterial
            map={glowTex}
            color="#cfeeff"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      </group>

      {/* Chrome gyroscope — precision engineering, clearly rings */}
      <mesh ref={ringA} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[1.7, 0.028, 24, 240]} />
        <meshStandardMaterial color="#d3d6db" metalness={1} roughness={0.13} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.7, 0.5, 0]}>
        <torusGeometry args={[1.98, 0.02, 20, 240]} />
        <meshStandardMaterial color="#9a9ea5" metalness={1} roughness={0.2} />
      </mesh>
      <mesh ref={ringC} rotation={[0.6, 0.2, Math.PI / 3]}>
        <torusGeometry args={[2.24, 0.014, 18, 240]} />
        <meshStandardMaterial color="#6f7378" metalness={1} roughness={0.25} />
      </mesh>

      {/* Orbiting energy field */}
      <points ref={dust} geometry={dustGeo}>
        <pointsMaterial
          map={glowTex}
          color="#bfe9ff"
          size={0.018}
          sizeAttenuation
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function Rig() {
  useFrame((state) => {
    const { pointer, camera } = state;
    camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.32 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function PowerCore({
  activation = 0,
  className = "",
}: {
  activation?: number;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 4.7], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[4, 6, 4]} intensity={1.3} color="#f5f6f7" />
          <directionalLight position={[-6, -2, -3]} intensity={0.5} color="#5fdccb" />
          <Core activation={activation} />
          <Rig />
          {/* Procedural studio lighting — no network HDRs */}
          <Environment resolution={256}>
            <Lightformer position={[0, 4, 2]} scale={[10, 3, 1]} intensity={3.2} color="#ffffff" />
            <Lightformer position={[-5, 0, 1]} scale={[2.5, 8, 1]} intensity={1.7} color="#e8eaec" />
            <Lightformer position={[5, -2, 1]} scale={[2.5, 6, 1]} intensity={1.2} color="#c9ccd1" />
            <Lightformer position={[0, -4, 2]} scale={[9, 1.5, 1]} intensity={0.9} color="#9a9ea5" />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
