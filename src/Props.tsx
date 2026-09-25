import { Outlines, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  Box3,
  CanvasTexture,
  Color,
  DataTexture,
  ExtrudeGeometry,
  Group,
  LatheGeometry,
  MathUtils,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  MeshToonMaterial,
  NearestFilter,
  RedFormat,
  Shape,
  SRGBColorSpace,
  Vector2,
  Vector3,
  type BufferGeometry,
  type Texture,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export const INK = '#0c0d0c'

const toonRamp = (() => {
  const ramp = new DataTexture(new Uint8Array([80, 165, 255]), 3, 1, RedFormat)
  ramp.minFilter = NearestFilter
  ramp.magFilter = NearestFilter
  ramp.needsUpdate = true
  return ramp
})()

export function toon(color: Color | string, map: Texture | null = null) {
  return new MeshToonMaterial({ color, map, gradientMap: toonRamp })
}

export function Toon({ color }: { color: string }) {
  return <meshToonMaterial color={color} gradientMap={toonRamp} />
}

export function Outline({ thickness = 0.02 }: { thickness?: number }) {
  return <Outlines thickness={thickness} color={INK} />
}

export function useTilt(still: boolean, base: [number, number] = [0, 0], strength = 0.35) {
  const group = useRef<Group>(null)
  useFrame((state) => {
    if (still) return
    const g = group.current!
    g.rotation.y = MathUtils.lerp(g.rotation.y, base[1] + state.pointer.x * strength, 0.05)
    g.rotation.x = MathUtils.lerp(g.rotation.x, base[0] - state.pointer.y * strength * 0.6, 0.05)
  })
  return group
}

export function useCanvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    draw(canvas.getContext('2d')!)
    const map = new CanvasTexture(canvas)
    map.colorSpace = SRGBColorSpace
    map.anisotropy = 8
    return map
  }, [width, height, draw])

  useEffect(() => {
    document.fonts.ready.then(() => {
      const canvas = texture.image as HTMLCanvasElement
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, width, height)
      draw(ctx)
      texture.needsUpdate = true
    })
    return () => texture.dispose()
  }, [texture, width, height, draw])

  return texture
}

export function starShape(outer: number, inner: number) {
  const shape = new Shape()
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 ? inner : outer
    const angle = (i / 10) * Math.PI * 2 + Math.PI / 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  return shape
}

export function heartShape(size: number) {
  const s = size
  const shape = new Shape()
  shape.moveTo(0, -s * 0.9)
  shape.bezierCurveTo(s * 0.2, -s * 0.6, s, -s * 0.2, s, s * 0.25)
  shape.bezierCurveTo(s, s * 0.75, s * 0.4, s * 0.95, 0, s * 0.45)
  shape.bezierCurveTo(-s * 0.4, s * 0.95, -s, s * 0.75, -s, s * 0.25)
  shape.bezierCurveTo(-s, -s * 0.2, -s * 0.2, -s * 0.6, 0, -s * 0.9)
  return shape
}

export function createCoinGeometry(): BufferGeometry {
  const radius = 0.26
  const half = 0.03
  const profile = [
    [0, -half * 0.5],
    [radius * 0.76, -half * 0.5],
    [radius * 0.8, -half],
    [radius * 0.95, -half],
    [radius, -half * 0.6],
    [radius, half * 0.6],
    [radius * 0.95, half],
    [radius * 0.8, half],
    [radius * 0.76, half * 0.5],
    [0, half * 0.5],
  ].map(([x, y]) => new Vector2(x, y))
  const body = new LatheGeometry(profile, 32).toNonIndexed()
  const star = new ExtrudeGeometry(starShape(0.13, 0.055), { depth: 0.01, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 1, curveSegments: 1 })
  star.rotateX(-Math.PI / 2)
  star.translate(0, half * 0.5, 0)
  const back = star.clone().rotateX(Math.PI)
  return mergeGeometries([body, star, back])!
}

type Part = { geometry: BufferGeometry; material: MeshToonMaterial; matrix: Matrix4 }

export function Model({ url, size, outline = 0.03 }: { url: string; size: number; outline?: number }) {
  const { scene } = useGLTF(url)
  const parts = useMemo(() => {
    scene.updateMatrixWorld(true)
    const box = new Box3().setFromObject(scene)
    const center = box.getCenter(new Vector3())
    const scale = size / Math.max(...box.getSize(new Vector3()).toArray())
    const fit = new Matrix4().makeScale(scale, scale, scale).multiply(new Matrix4().makeTranslation(-center.x, -center.y, -center.z))
    const list: Part[] = []
    scene.traverse((object) => {
      const mesh = object as Mesh
      if (!mesh.isMesh) return
      const source = mesh.material as MeshStandardMaterial
      list.push({ geometry: mesh.geometry, material: toon(source.color, source.map), matrix: fit.clone().multiply(mesh.matrixWorld) })
    })
    return list
  }, [scene, size])

  return (
    <group>
      {parts.map((part, i) => (
        <mesh key={i} geometry={part.geometry} material={part.material} matrix={part.matrix} matrixAutoUpdate={false}>
          {outline > 0 && <Outlines thickness={outline} color={INK} />}
        </mesh>
      ))}
    </group>
  )
}

export const MODELS = {
  burger: '/models/food/burger.glb',
  coffee: '/models/food/cup-coffee.glb',
  donut: '/models/food/donut-sprinkles.glb',
  cupcake: '/models/food/cupcake.glb',
  iceCream: '/models/food/ice-cream.glb',
  taxi: '/models/car/taxi.glb',
  delivery: '/models/car/delivery.glb',
}

Object.values(MODELS).forEach((url) => useGLTF.preload(url))
