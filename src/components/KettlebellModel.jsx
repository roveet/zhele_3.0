import React, { useEffect } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function KettlebellModel() {
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

  return <primitive object={scene} />
}

// Предзагрузка, чтобы моделька не тупила при открытии сайта
useGLTF.preload('./models/kettlebell.glb')