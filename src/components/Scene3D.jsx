import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, Environment, OrbitControls } from '@react-three/drei'
// Импортируем нашу модель из папки компонентов
import KettlebellModel from './KettlebellModel'

export default function Scene3D() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111111' }}>
      <Canvas camera={{ position: [0, 0, 0.85], fov: 45 }} gl={{ antialias: true }}>
        
        <Environment preset="city" intensity={0.8} />
        
        <ambientLight intensity={0.3} />
        <directionalLight position={[2, 4, 5]} intensity={0.8} />

        <Center>
          {/* Вставляем сюда нашу модель */}
          <KettlebellModel />
        </Center>

        <OrbitControls 
          enableDamping={true}       
          dampingFactor={0.05}
          minDistance={0.4}          
          maxDistance={2.0}          
        />
      </Canvas>
    </div>
  )
}