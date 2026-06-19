import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function Model() {
  const group = useRef()

  // 1. Просто загружаем гирю. Она уже внутри содержит ВСЕ твои текстуры из Сабстенса!
  const { scene } = useGLTF('./models/kettlebell.glb')

  // 2. Нам нужно только слегка поправить настройки отображения, чтобы металл не чернел
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const matName = child.material.name.toLowerCase()

        // Подкручиваем окружение для всех материалов, чтобы заиграли блики
        child.material.envMapIntensity = 2.0

        // Если это ручка, сделаем её чуть светлее за счет roughness
        if (matName.includes('metal') && !matName.includes('light')) {
          child.material.roughness = 0.25 // Металл станет мягче рассеивать свет и посветлеет
        }

        // Если это желе, пока держим его непрозрачным для теста швов
        if (matName.includes('jelly')) {
          child.material.transparent = false
          child.material.opacity = 1.0
        }

        child.material.needsUpdate = true
      }
    })
  }, [scene])

  // 3. Вращение за курсором
  useFrame((state) => {
    const { x, y } = state.mouse
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.6, 0.07)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.4, 0.07)
  })

  return <primitive ref={group} object={scene} />
}

export default function Scene3D() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111111' }}>
      <Canvas camera={{ position: [0, 0, 0.85], fov: 45 }}>
        
        {/* Родное студийное окружение для сочных отражений */}
        {/* <Environment preset="studio" intensity={1.5} /> */}
        
        <ambientLight intensity={0.7} />
        <directionalLight position={[0, 4, 5]} intensity={1.5} />

        <Center>
          <Model />
        </Center>
      </Canvas>
    </div>
  )
}

useGLTF.preload('./models/kettlebell.glb')
