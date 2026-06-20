import React, { useState } from 'react' // ДОБАВИЛИ useState
import { Canvas } from '@react-three/fiber'
import { Center, Environment, OrbitControls, Html } from '@react-three/drei' // ДОБАВИЛИ Html
import KettlebellModel from './KettlebellModel'

export default function Scene3D() {
  // 1. ДОБАВИЛИ: Стейт для хранения прогресса трансформации (от 0 до 1)
  const [transformProgress, setTransformProgress] = useState(0)

  // 2. ДОБАВИЛИ: Управляющий цвет желе (фиолетовый, как в Substance)
  const jellyBaseColor = '#228797'

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111111', position: 'relative' }}>
<Canvas
  camera={{
    position: [0, 0.05, 1.25],
    fov: 30
  }}
  gl={{
    antialias: true
  }}
>
  {/* ===================================================================== */}
  {/* HDRI */}
  {/* ===================================================================== */}

  <Environment
    preset="sunset"
    intensity={1.0}
    blur={0.35}
  />

  {/* ===================================================================== */}
  {/* ОСНОВНОЙ СВЕТ */}
  {/* ===================================================================== */}

  <ambientLight intensity={0.2} />

  {/* Key Light */}
  <directionalLight
    position={[3, 5, 4]}
    intensity={1.5}
  />

  {/* Fill Light */}
  <directionalLight
    position={[-4, 1, -2]}
    intensity={0.35}
  />

  {/* Rim Light */}
  <directionalLight
    position={[0, 2, -5]}
    intensity={0.6}
  />

  {/* ===================================================================== */}
  {/* МОДЕЛЬ */}
  {/* ===================================================================== */}

  <Center>
    <KettlebellModel
      progress={transformProgress}
      jellyColor={jellyBaseColor}
    />
  </Center>

  {/* ===================================================================== */}
  {/* КОНТРОЛЫ */}
  {/* ===================================================================== */}

  <OrbitControls
    enableDamping
    dampingFactor={0.08}
    enablePan={false}

    minDistance={0.8}
    maxDistance={1.8}

    minPolarAngle={Math.PI / 2.4}
    maxPolarAngle={Math.PI / 1.8}
  />

  {/* ===================================================================== */}
  {/* UI */}
  {/* ===================================================================== */}

  <Html
    position={[0, -0.42, 0]}
    transform={false}
  >
    <div
      style={{
        width: '340px',
        background: 'rgba(25,25,25,0.75)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '18px 22px',
        borderRadius: '16px',
        backdropFilter: 'blur(20px)',
        color: '#fff',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <div
        style={{
          marginBottom: '12px',
          fontSize: '14px',
          fontWeight: 600
        }}
      >
        Трансформация «ЖЕЛЕ 3.0»
      </div>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={transformProgress}
        onChange={(e) =>
          setTransformProgress(
            parseFloat(e.target.value)
          )
        }
        style={{
          width: '100%',
          cursor: 'pointer'
        }}
      />
    </div>
  </Html>
</Canvas>
    </div>
  )
}