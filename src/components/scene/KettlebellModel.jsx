import React, { useMemo, useRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/*
==============================================================================
ШАГ 1

Простой и стабильный шум.

Специально НЕ используем simplex noise.
Сначала добиваемся рабочего эффекта трансформации.

После того как пазл заработает идеально,
можно будет вернуть красивый FBM / Simplex.
==============================================================================
*/

const puzzleShaderModifier = (material, progressRef, isMetal) => {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTransitionProgress = progressRef

    /*
    ==========================================================================
    Передаем локальную позицию во фрагментный шейдер
    ==========================================================================
    */

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>

      varying vec3 vLocalPosition;
      `
    )

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>

      vLocalPosition = position;
      `
    )

    /*
    ==========================================================================
    Добавляем простой 3D noise
    ==========================================================================
    */

    shader.fragmentShader =
      `
      uniform float uTransitionProgress;

      varying vec3 vLocalPosition;

      float hash(vec3 p) {
        p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
        p *= 17.0;

        return fract(
          p.x * p.y * p.z *
          (p.x + p.y + p.z)
        );
      }

      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);

        f = f * f * (3.0 - 2.0 * f);

        return mix(
          mix(
            mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
            f.y
          ),
          mix(
            mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
            f.y
          ),
          f.z
        );
      }
      ` + shader.fragmentShader

    /*
    ==========================================================================
    Пазл из двух материалов

    Металл:
      показывается если noise <= threshold

    Желе:
      показывается если noise > threshold

    Вместе они всегда покрывают 100% поверхности.
    ==========================================================================
    */

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <alphatest_fragment>',
      `
      #include <alphatest_fragment>

      float noiseMask = noise(vLocalPosition * 8.0);

      float threshold = clamp(
        uTransitionProgress,
        0.0,
        1.0
      );

      ${
        isMetal
          ? `
            if (noiseMask > threshold) discard;
          `
          : `
            if (noiseMask <= threshold) discard;
          `
      }
      `
    )
  }

  material.needsUpdate = true
}

export default function KettlebellModel({
  progress = 0,
  jellyColor = '#c25918'
}) {
  const { nodes } = useGLTF('/models/kettlebell.glb')

  /*
  ============================================================================
  ТЕКСТУРЫ ИЗ SUBSTANCE
  ============================================================================
  */

  const [
    baseColorMap,
    metallicMap,
    normalMap,
    roughnessMap
  ] = useTexture([
    '/textures/kettlebell/kettlebell_LP_kettlebell_BaseColor.png',
    '/textures/kettlebell/kettlebell_LP_kettlebell_Metallic.png',
    '/textures/kettlebell/kettlebell_LP_kettlebell_Normal.png',
    '/textures/kettlebell/kettlebell_LP_kettlebell_Roughness.png'
  ])

  /*
  ============================================================================
  ЕДИНЫЙ UNIFORM ДЛЯ ОБОИХ МАТЕРИАЛОВ
  ============================================================================
  */

  const progressUniform = useRef({
    value: 0
  })

  /*
  ============================================================================
  ОБЯЗАТЕЛЬНО ОБНОВЛЯЕМ UNIFORM КАЖДЫЙ КАДР
  ============================================================================
  */

  useFrame(() => {
    progressUniform.current.value = progress
  })

  /*
  ============================================================================
  НАСТРОЙКА ТЕКСТУР
  ============================================================================
  */

  useMemo(() => {
    if (baseColorMap) {
      baseColorMap.colorSpace = THREE.SRGBColorSpace
    }

    ;[
      baseColorMap,
      metallicMap,
      normalMap,
      roughnessMap
    ].forEach((texture) => {
      if (!texture) return

      texture.flipY = false
      texture.needsUpdate = true
    })
  }, [
    baseColorMap,
    metallicMap,
    normalMap,
    roughnessMap
  ])

  /*
  ============================================================================
  МЕТАЛЛ ИЗ SUBSTANCE
  ============================================================================
  */

  const metalMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map: baseColorMap,

      normalMap,

      roughnessMap,

      metalnessMap: metallicMap,

      metalness: 1.0,

      roughness: 1.0,

      envMapIntensity: 1.2
    })

    puzzleShaderModifier(
      mat,
      progressUniform.current,
      true
    )

    return mat
  }, [
    baseColorMap,
    normalMap,
    roughnessMap,
    metallicMap
  ])

/*
============================================================================
ЖЕЛЕ v1

Еще не прозрачное.

Но уже:
- влажное
- блестящее
- немного "конфетное"
- отлично дружит с нашей маской discard
============================================================================
*/

const jellyMaterial = useMemo(() => {
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(jellyColor),

    // Не металл
    metalness: 0.0,

    // Очень гладкое
    roughness: 0.03,

    // Сильный мокрый блеск
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,

    // Дополнительные мягкие блики
    sheen: 1.0,
    sheenRoughness: 0.15,

    // Главное для желе
    transmission: 0.65,

    // Толщина среды
    thickness: 1.8,

    // Почти как вода
    ior: 1.33,

    // Поглощение света внутри
    attenuationDistance: 0.8,

    // Цвет внутри объема
    attenuationColor: new THREE.Color(jellyColor),

    // Важно для красивых отражений
    envMapIntensity: 3.0
  })

  /*
  --------------------------------------------------------------------------
  Боремся с z-fighting
  --------------------------------------------------------------------------
  */

  mat.polygonOffset = true
  mat.polygonOffsetFactor = -1
  mat.polygonOffsetUnits = -1

  puzzleShaderModifier(
    mat,
    progressUniform.current,
    false
  )

  return mat
}, [jellyColor])

  /*
  ============================================================================
  МЕШИ ИЗ GLB
  ============================================================================
  */

  const jellyMesh = nodes.jelly_base_low
  const handleMesh = nodes.metal_handle_low
  const numberMesh = nodes.l_metal_number_low

  return (
    <group dispose={null}>
      {/* ============================================================= */}
      {/* РУЧКА */}
      {/* ============================================================= */}

      {handleMesh && (
        <mesh
          geometry={handleMesh.geometry}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            map={baseColorMap}
            normalMap={normalMap}
            roughnessMap={roughnessMap}
            metalnessMap={metallicMap}
            metalness={1}
            roughness={1}
            envMapIntensity={1.2}
          />
        </mesh>
      )}

      {/* ============================================================= */}
      {/* ЦИФРЫ */}
      {/* ============================================================= */}

      {numberMesh && (
        <mesh
          geometry={numberMesh.geometry}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            map={baseColorMap}
            normalMap={normalMap}
            roughnessMap={roughnessMap}
            metalnessMap={metallicMap}
            metalness={1}
            roughness={1}
            envMapIntensity={1.2}
          />
        </mesh>
      )}

      {/* ============================================================= */}
      {/* ТЕЛО ГИРИ */}
      {/* ============================================================= */}

      {jellyMesh && (
        <group>
          {/* --------------------------------------------------------- */}
          {/* МЕТАЛЛ */}
          {/* --------------------------------------------------------- */}

          <mesh
            geometry={jellyMesh.geometry}
            material={metalMaterial}
            castShadow
            receiveShadow
            renderOrder={0}
          />

          {/* --------------------------------------------------------- */}
          {/* ВРЕМЕННОЕ ЖЕЛЕ */}
          {/* --------------------------------------------------------- */}

          <mesh
            geometry={jellyMesh.geometry}
            material={jellyMaterial}
            castShadow
            receiveShadow
            renderOrder={1}
          />
        </group>
      )}
    </group>
  )
}

useGLTF.preload('/models/kettlebell.glb')