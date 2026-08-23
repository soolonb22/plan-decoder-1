import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import { GUIDE_STATIONS } from "@/lib/guide-map";

function Stone({
  index,
  selected,
  color,
  reduce,
  onPick,
}: {
  index: number;
  selected: boolean;
  color: string;
  reduce: boolean;
  onPick: () => void;
}) {
  const ref = useRef<Mesh>(null);
  const angle = (index / GUIDE_STATIONS.length) * Math.PI * 2 - Math.PI / 2;
  const x = Math.cos(angle) * 1.55;
  const z = Math.sin(angle) * 1.55;
  useFrame((state) => {
    if (!ref.current || reduce) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = (selected ? 0.28 : 0.12) + Math.sin(t * 1.2 + index) * 0.03;
  });
  return (
    <mesh
      ref={ref}
      position={[x, selected ? 0.28 : 0.12, z]}
      castShadow
      onClick={(e) => {
        e.stopPropagation();
        onPick();
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <cylinderGeometry args={[selected ? 0.38 : 0.32, selected ? 0.42 : 0.36, 0.18, 8]} />
      <meshStandardMaterial
        color={selected ? color : "#efe8f4"}
        roughness={0.55}
        metalness={0.05}
        emissive={selected ? color : "#000000"}
        emissiveIntensity={selected ? 0.18 : 0}
      />
    </mesh>
  );
}

function Beacon({ talking, reduce }: { talking: boolean; reduce: boolean }) {
  const g = useRef<Group>(null);
  useFrame((state) => {
    if (!g.current || reduce) return;
    const t = state.clock.elapsedTime;
    g.current.rotation.y = t * 0.25;
    g.current.position.y = 0.55 + Math.sin(t * 1.4) * (talking ? 0.08 : 0.04);
  });
  return (
    <group ref={g} position={[0, 0.55, 0]}>
      <mesh>
        <octahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial color="#6E2C92" roughness={0.3} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#f6f3f8"
          emissive="#c4a3e0"
          emissiveIntensity={talking ? 0.8 : 0.25}
        />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
      <circleGeometry args={[2.4, 48]} />
      <meshStandardMaterial color="#f3eef6" roughness={0.9} />
    </mesh>
  );
}

export default function GuideScene({
  selected,
  talking,
  reduce,
  onSelect,
}: {
  selected: number;
  talking: boolean;
  reduce: boolean;
  onSelect: (index: number) => void;
}) {
  const stones = useMemo(() => GUIDE_STATIONS, []);
  return (
    <Canvas
      camera={{ position: [0, 2.6, 4.2], fov: 36 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      shadows={!reduce}
      frameloop={reduce ? "demand" : "always"}
      style={{ width: "100%", height: "100%", background: "transparent", touchAction: "none" }}
      aria-hidden
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow />
      <directionalLight position={[-3, 2, 2]} intensity={0.35} color="#bfa9d9" />
      <Ground />
      <Beacon talking={talking} reduce={reduce} />
      {stones.map((s, i) => (
        <Stone
          key={s.id}
          index={i}
          selected={i === selected}
          color={s.color}
          reduce={reduce}
          onPick={() => onSelect(i)}
        />
      ))}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={!reduce}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 2.15}
        rotateSpeed={0.45}
      />
    </Canvas>
  );
}
