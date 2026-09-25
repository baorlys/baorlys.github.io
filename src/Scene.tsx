import { Edges, Environment, Lightformer, Line, Preload, Sparkles } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { Suspense, useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react'
import { useTilt } from './Props'
import { BankCard, Loyalty, Phone } from './Worlds'
import { Color, Group, InstancedMesh, MathUtils, Mesh, Object3D, QuadraticBezierCurve3, Vector3 } from 'three'

export type Focus = 'hero' | 'bank' | 'superapp' | 'loyalty' | 'experience' | 'rest'

type Labels = RefObject<Map<string, HTMLSpanElement>>
type Cluster = { center: Vector3; core: string; services: number }

const CLUSTERS: Cluster[] = [
  { center: new Vector3(-2.5, 0.35, 0), core: 'onboarding', services: 7 },
  { center: new Vector3(2.5, -0.35, 0), core: 'identity', services: 7 },
]

const ACID = new Color('#b8f36a')
const GLOW = new Color('#b8f36a').multiplyScalar(3)
const FOG = new Color('#e8eae5')
const DIM = new Color('#3d423c')

function fibonacciSphere(count: number, radius: number) {
  const golden = Math.PI * (3 - Math.sqrt(5))
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - ((i + 0.5) / count) * 2
    const r = Math.sqrt(1 - y * y)
    return new Vector3(Math.cos(golden * i) * r, y, Math.sin(golden * i) * r).multiplyScalar(radius)
  })
}

function arc(from: Vector3, to: Vector3, bow: number) {
  const mid = from.clone().add(to).multiplyScalar(0.5)
  const normal = new Vector3().subVectors(to, from).cross(new Vector3(0, 0, 1)).normalize()
  return new QuadraticBezierCurve3(from, mid.addScaledVector(normal, bow), to)
}

const ORDER: Record<Focus, number> = { hero: 0, bank: 1, superapp: 2, loyalty: 3, experience: 4, rest: 5 }
const TRANSITION_SECONDS = 1.1

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function sideOf(slots: Focus[], focus: Focus) {
  const nearest = slots.reduce((best, slot) => (Math.abs(ORDER[slot] - ORDER[focus]) < Math.abs(ORDER[best] - ORDER[focus]) ? slot : best))
  return ORDER[nearest] <= ORDER[focus] ? 1 : -1
}

type StageProps = { slots: Focus[]; focus: Focus; wide: boolean; still: boolean; fit: number; children: ReactNode }

function Stage({ slots, focus, wide, still, fit, children }: StageProps) {
  const group = useRef<Group>(null)
  const viewport = useThree((state) => state.viewport)
  const show = slots.includes(focus)
  const progress = useRef(show ? 1 : 0)
  const side = useRef(sideOf(slots, focus))

  useFrame((_, delta) => {
    if (!show) side.current = sideOf(slots, focus)
    const target = show ? 1 : 0
    progress.current = still ? target : MathUtils.clamp(progress.current + Math.sign(target - progress.current) * (delta / TRANSITION_SECONDS), 0, 1)
    const eased = easeInOutCubic(progress.current)
    const away = 1 - eased

    const g = group.current!
    const available = wide ? viewport.width * 0.46 : viewport.width * 0.92
    const baseY = wide ? 0 : viewport.height * 0.2
    g.position.set(wide ? viewport.width * 0.25 : 0, baseY + away * viewport.height * 0.9 * side.current, 0)
    g.scale.setScalar(Math.min(1, available / fit) * (0.7 + 0.3 * eased))
    g.rotation.set(-away * 0.6 * side.current, away * 0.5, 0)
    g.visible = progress.current > 0.001
  })

  return <group ref={group}>{children}</group>
}

function Core({ still }: { still: boolean }) {
  const shell = useRef<Mesh>(null)
  const orbit = useRef<Group>(null)
  const heart = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (still) return
    shell.current!.rotation.x += delta * 0.15
    shell.current!.rotation.y += delta * 0.2
    orbit.current!.rotation.z += delta * 0.4
    heart.current!.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.08)
  })

  return (
    <group>
      <mesh ref={shell}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshPhysicalMaterial color={FOG} roughness={0.12} transmission={1} thickness={0.4} ior={1.3} transparent opacity={0.9} />
        <Edges color={ACID} threshold={1} transparent opacity={0.55} />
      </mesh>
      <mesh ref={heart}>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshBasicMaterial color={GLOW} toneMapped={false} />
      </mesh>
      <group ref={orbit} rotation={[1.1, 0.3, 0]}>
        <mesh>
          <torusGeometry args={[0.8, 0.008, 8, 96]} />
          <meshBasicMaterial color={ACID} transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.8, 0, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color={GLOW} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

function ClusterGraph({ cluster, focus, still, labels }: { cluster: Cluster; focus: Focus; still: boolean; labels: Labels }) {
  const curves = useMemo(
    () => fibonacciSphere(cluster.services, 1.8).map((p, i) => arc(new Vector3(), p, i % 2 ? 0.35 : -0.35)),
    [cluster],
  )
  const curvePoints = useMemo(() => curves.map((c) => c.getPoints(32)), [curves])
  const packets = useRef<InstancedMesh>(null)
  const core = useRef<Group>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const world = useMemo(() => new Vector3(), [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    curves.forEach((curve, i) => {
      for (let k = 0; k < 2; k++) {
        const t = still ? 0.5 : (time * 0.3 + i * 0.13 + k / 2) % 1
        curve.getPoint(k ? 1 - t : t, dummy.position)
        dummy.scale.setScalar(Math.sin(t * Math.PI))
        dummy.updateMatrix()
        packets.current!.setMatrixAt(i * 2 + k, dummy.matrix)
      }
    })
    packets.current!.instanceMatrix.needsUpdate = true

    const label = labels.current.get(cluster.core)
    if (!label || !core.current) return
    core.current.getWorldPosition(world).project(state.camera)
    const x = (world.x * 0.5 + 0.5) * state.size.width
    const y = (-world.y * 0.5 + 0.5) * state.size.height - 64
    label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
    label.style.opacity = focus === 'hero' ? '1' : '0'
  })

  return (
    <group position={cluster.center}>
      <group ref={core}>
        <Core still={still} />
      </group>
      {curvePoints.map((points, i) => (
        <Line key={i} points={points} color={DIM} lineWidth={1.2} transparent opacity={0.8} />
      ))}
      <instancedMesh ref={packets} args={[undefined, undefined, curves.length * 2]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color={GLOW} toneMapped={false} />
      </instancedMesh>
      {curves.map((curve, i) => (
        <mesh key={i} position={curve.v2}>
          <sphereGeometry args={[0.085, 32, 32]} />
          <meshStandardMaterial color={FOG} emissive={ACID} emissiveIntensity={0.15} roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

function Network({ focus, still, labels }: { focus: Focus; still: boolean; labels: Labels }) {
  const tilt = useTilt(still)
  const spin = useRef<Group>(null)
  const bridge = useMemo(() => arc(CLUSTERS[0].center, CLUSTERS[1].center, 1.2).getPoints(64), [])

  useFrame((state) => {
    if (!still) spin.current!.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.35
  })

  return (
    <group ref={tilt}>
      <group ref={spin}>
        <Line points={bridge} color={ACID} lineWidth={1} dashed dashSize={0.12} gapSize={0.1} transparent opacity={0.4} />
        {CLUSTERS.map((cluster) => (
          <ClusterGraph key={cluster.core} cluster={cluster} focus={focus} still={still} labels={labels} />
        ))}
      </group>
    </group>
  )
}

export default function Scene({ focus, wide, still }: { focus: Focus; wide: boolean; still: boolean }) {
  const labels = useRef(new Map<string, HTMLSpanElement>())
  return (
    <>
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }} dpr={[1, 1.75]} frameloop={still ? 'demand' : 'always'} gl={{ antialias: true }}>
        <Invalidate focus={focus} wide={wide} />
        <color attach="background" args={['#0c0d0c']} />
        <fog attach="fog" args={['#0c0d0c', 8, 17]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 6]} intensity={2.4} />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={3} position={[0, 4, -6]} scale={[10, 2, 1]} />
          <Lightformer form="rect" intensity={0.8} color="#b8f36a" position={[-6, 0, 2]} scale={[2, 8, 1]} />
          <Lightformer form="rect" intensity={2} position={[6, -1, 3]} scale={[2, 6, 1]} />
          <Lightformer form="ring" intensity={2} position={[3, 3, 5]} scale={2.5} />
        </Environment>
        <Stage slots={['hero', 'experience']} focus={focus} wide={wide} still={still} fit={8.6}>
          <Network focus={focus} still={still} labels={labels} />
        </Stage>
        <Stage slots={['bank']} focus={focus} wide={wide} still={still} fit={5}>
          <BankCard still={still} />
        </Stage>
        <Stage slots={['superapp']} focus={focus} wide={wide} still={still} fit={5.4}>
          <Suspense fallback={null}>
            <Phone still={still} />
          </Suspense>
        </Stage>
        <Stage slots={['loyalty']} focus={focus} wide={wide} still={still} fit={7.4}>
          <Suspense fallback={null}>
            <Loyalty still={still} />
          </Suspense>
        </Stage>
        {!still && <Sparkles count={90} scale={[16, 9, 8]} size={1.4} speed={0.2} opacity={0.3} color="#e8eae5" />}
        <Preload all />
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur luminanceThreshold={1.1} intensity={0.7} radius={0.6} />
          <Vignette offset={0.25} darkness={0.7} />
        </EffectComposer>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {CLUSTERS.map(({ core }) => (
          <span
            key={core}
            ref={(span) => void (span ? labels.current.set(core, span) : labels.current.delete(core))}
            className="absolute left-0 top-0 whitespace-nowrap rounded-full border border-line bg-ink/70 px-2 py-0.5 font-mono text-[12px] text-fog/90 opacity-0 backdrop-blur-sm transition-opacity duration-500"
          >
            {core}
          </span>
        ))}
      </div>
    </>
  )
}

function Invalidate({ focus, wide }: { focus: Focus; wide: boolean }) {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => invalidate(), [focus, wide, invalidate])
  return null
}
