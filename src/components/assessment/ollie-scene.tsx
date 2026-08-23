import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";

function FileCharacter({ talking, reduce }: { talking: boolean; reduce: boolean }) {
  const g = useRef<Group>(null);
  const mouth = useRef<Mesh>(null);
  const paper = useRef<Mesh>(null);
  useFrame((state) => {
    if (reduce) return;
    const t = state.clock.elapsedTime;
    if (g.current) {
      g.current.rotation.y = Math.sin(t * 0.65) * 0.2;
      g.current.position.y = Math.sin(t * 1.35) * 0.045;
    }
    if (mouth.current) {
      mouth.current.scale.y = talking ? 1 + Math.abs(Math.sin(t * 11)) * 0.7 : 1;
    }
    if (paper.current && talking) {
      paper.current.position.y = 0.12 + Math.sin(t * 9) * 0.02;
    }
  });
  return (
    <group ref={g} position={[0, -0.15, 0]}>
      <mesh position={[0, 0.62, 0.02]} rotation={[0, 0, 0.04]}>
        <boxGeometry args={[0.55, 0.18, 0.12]} />
        <meshStandardMaterial color="#5a2378" roughness={0.55} />
      </mesh>
      <mesh>
        <boxGeometry args={[1.22, 1.48, 0.16]} />
        <meshStandardMaterial color="#6e2c92" roughness={0.45} />
      </mesh>
      <mesh ref={paper} position={[0.04, 0.1, 0.12]}>
        <boxGeometry args={[1.02, 1.22, 0.04]} />
        <meshStandardMaterial color="#f6f3f8" roughness={0.8} />
      </mesh>
      <mesh position={[0.38, 0.48, 0.16]}>
        <circleGeometry args={[0.12, 20]} />
        <meshStandardMaterial color="#8bc541" />
      </mesh>
      <mesh position={[-0.22, 0.22, 0.16]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.22, 0.22, 0.16]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.22, 0.2, 0.25]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#3a2a45" />
      </mesh>
      <mesh position={[0.22, 0.2, 0.25]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#3a2a45" />
      </mesh>
      <mesh ref={mouth} position={[0, -0.12, 0.16]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.28, 0.05, 0.04]} />
        <meshStandardMaterial color="#4b1c68" />
      </mesh>
    </group>
  );
}

export default function OllieScene({
  talking,
  reduce,
}: {
  talking: boolean;
  reduce: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 3.4], fov: 32 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      aria-hidden
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[2.4, 3, 4]} intensity={1.15} />
      <directionalLight position={[-2, 1, 2]} intensity={0.35} color="#bfa9d9" />
      <FileCharacter talking={talking} reduce={reduce} />
    </Canvas>
  );
}
