import React, { useState } from 'react' // ДОБАВИЛИ useState
import { Canvas } from '@react-three/fiber'
import { Center, Environment, OrbitControls} from '@react-three/drei' // ДОБАВИЛИ Html
import KettlebellModel from './KettlebellModel'

export default function Scene3D({
  transformProgress
}) {

  
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

    <KettlebellModel
      progress={transformProgress}
      jellyColor={jellyBaseColor}
    />

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

</Canvas>
    </div>
  )
}

