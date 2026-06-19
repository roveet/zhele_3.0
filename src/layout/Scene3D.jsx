import React, { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, Environment, useGLTF, useTexture, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Model() {
  const { scene } = useGLTF('./models/kettlebell.glb')

  const [
    jellyColor, jellyNormal,
    metalColor, metalNormal,
    lightColor, lightNormal
  ] = useTexture([
    './textures/kettlebell/jelly_baseColor.png',
    './textures/kettlebell/jelly_normal.png',
    './textures/kettlebell/metal_baseColor.png',
    './textures/kettlebell/metal_normal.png',
    './textures/kettlebell/metal_light_baseColor.png',
    './textures/kettlebell/metal_light_normal.png',
  ])

  useEffect(() => {
    jellyColor.colorSpace = THREE.SRGBColorSpace
    metalColor.colorSpace = THREE.SRGBColorSpace
    lightColor.colorSpace = THREE.SRGBColorSpace

    const allTextures = [jellyColor, jellyNormal, metalColor, metalNormal, lightColor, lightNormal]
    allTextures.forEach((texture) => {
      texture.flipY = false
      texture.needsUpdate = true
    })
  }, [jellyColor, jellyNormal, metalColor, metalNormal, lightColor, lightNormal])

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        const matName = child.material.name.toLowerCase()
        child.material.envMapIntensity = 1.0

        

        if (matName.includes('jelly')) {
          child.material = new THREE.MeshStandardMaterial({
            map: jellyColor,
            normalMap: jellyNormal,
            roughness: 0.2,
            metalness: 0.0,
          })
        }

        if (matName.includes('metal') && !matName.includes('light')) {
          child.material = new THREE.MeshStandardMaterial({
            map: metalColor,
            normalMap: metalNormal,
            roughness: 0.3,
            metalness: 1.0,
          })
        }

        if (matName.includes('light')) {
          child.material = new THREE.MeshStandardMaterial({
            map: lightColor,
            normalMap: lightNormal,
            roughness: 0.3,
            metalness: 1.0,
          })
        }

        child.material.needsUpdate = true
      }
    })
  }, [scene, jellyColor, jellyNormal, metalColor, metalNormal, lightColor, lightNormal])

  // Автоматическое вращение за курсором убрано, чтобы не мешать OrbitControls
  return <primitive object={scene} />
}

export default function Scene3D() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111111' }}>
      <Canvas camera={{ position: [0, 0, 0.85], fov: 45 }} gl={{ antialias: true }}>
        
        <Environment preset="city" intensity={0.8} />
        
        <ambientLight intensity={0.3} />
        <directionalLight position={[2, 4, 5]} intensity={0.8} />

        <Center>
          <Model />
        </Center>

        {/* Инструмент для ручного осмотра модели */}
        <OrbitControls 
          enableDamping={true}       // Плавное торможение при вращении
          dampingFactor={0.05}
          minDistance={0.4}          // Максимальное приближение к гире
          maxDistance={2.0}          // Максимальное отдаление
        />
      </Canvas>
    </div>
  )
}

useGLTF.preload('./models/kettlebell.glb')