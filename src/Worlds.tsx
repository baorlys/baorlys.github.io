import { Float, RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type ReactNode } from 'react'
import { Color, ExtrudeGeometry, Group, InstancedMesh, Object3D } from 'three'
import { createCoinGeometry, heartShape, INK, Model, MODELS, Outline, starShape, Toon, toon, useCanvasTexture, useTilt } from './Props'

const ACID = '#b8f36a'
const FOG = '#e8eae5'
const GOLD = '#ffcf4a'
const GLOW = new Color(ACID).multiplyScalar(3)
const GRAPHITE = '#1b1e1b'

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.fillStyle = fill
  ctx.fill()
}

function polygon(ctx: CanvasRenderingContext2D, points: number[][]) {
  ctx.beginPath()
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
  ctx.closePath()
  ctx.fill()
}

function starPoints(outer: number, inner: number) {
  return Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 ? inner : outer
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2
    return [Math.cos(angle) * radius, Math.sin(angle) * radius]
  })
}

type Glyph = (ctx: CanvasRenderingContext2D, tint: string) => void

const GLYPHS: Record<string, Glyph> = {
  food: (ctx) => {
    ctx.beginPath()
    ctx.arc(0, -2, 30, Math.PI, 0)
    ctx.fill()
    roundRect(ctx, -33, 4, 66, 10, 5, INK)
    roundRect(ctx, -30, 19, 60, 14, 7, INK)
  },
  ride: (ctx, tint) => {
    roundRect(ctx, -20, -24, 40, 24, 9, INK)
    roundRect(ctx, -35, -6, 70, 26, 9, INK)
    ctx.beginPath()
    ctx.arc(-18, 22, 10, 0, Math.PI * 2)
    ctx.arc(18, 22, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = tint
    ctx.beginPath()
    ctx.arc(-18, 22, 4, 0, Math.PI * 2)
    ctx.arc(18, 22, 4, 0, Math.PI * 2)
    ctx.fill()
  },
  coffee: (ctx) => {
    roundRect(ctx, -26, -10, 42, 40, 9, INK)
    ctx.strokeStyle = INK
    ctx.lineWidth = 7
    ctx.beginPath()
    ctx.arc(17, 8, 11, -Math.PI / 2, Math.PI / 2)
    ctx.stroke()
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    for (const x of [-15, -3, 9]) {
      ctx.beginPath()
      ctx.moveTo(x, -18)
      ctx.quadraticCurveTo(x - 6, -26, x, -34)
      ctx.stroke()
    }
  },
  health: (ctx) => {
    roundRect(ctx, -10, -30, 20, 60, 6, '#ffffff')
    roundRect(ctx, -30, -10, 60, 20, 6, '#ffffff')
  },
  shop: (ctx) => {
    roundRect(ctx, -27, -10, 54, 42, 9, INK)
    ctx.strokeStyle = INK
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(0, -10, 14, Math.PI, 0)
    ctx.stroke()
  },
  bills: (ctx) => {
    ctx.fillStyle = INK
    polygon(ctx, [[8, -34], [-20, 4], [-2, 4], [-8, 34], [20, -6], [2, -6]])
  },
  movies: (ctx, tint) => {
    roundRect(ctx, -32, -6, 64, 38, 7, INK)
    ctx.save()
    ctx.translate(-32, -12)
    ctx.rotate(-0.25)
    roundRect(ctx, 0, -8, 64, 14, 4, INK)
    ctx.restore()
    ctx.fillStyle = tint
    polygon(ctx, [[-6, 4], [-6, 24], [12, 14]])
  },
  rewards: (ctx) => {
    ctx.fillStyle = INK
    polygon(ctx, starPoints(32, 14))
  },
}

const APPS = [
  { name: 'Food', color: '#ffb86b', glyph: 'food' },
  { name: 'Ride', color: '#ffd84d', glyph: 'ride' },
  { name: 'Coffee', color: '#d9a878', glyph: 'coffee' },
  { name: 'Health', color: '#ff7a85', glyph: 'health' },
  { name: 'Shop', color: '#7ad7f0', glyph: 'shop' },
  { name: 'Bills', color: '#a38bff', glyph: 'bills' },
  { name: 'Movies', color: '#ff9ed1', glyph: 'movies' },
  { name: 'Rewards', color: ACID, glyph: 'rewards' },
]

const SCREEN_W = 600
const SCREEN_H = 1266

function drawAppScreen(ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(0, 0, SCREEN_W, SCREEN_H, 70)
  ctx.clip()
  ctx.fillStyle = '#10130f'
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)

  ctx.fillStyle = FOG
  ctx.font = '600 30px "Geist Variable", sans-serif'
  ctx.fillText('9:41', 56, 76)
  for (let i = 0; i < 4; i++) ctx.fillRect(450 + i * 11, 68 - i * 6, 7, 8 + i * 6)
  ctx.strokeStyle = FOG
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(503, 52, 44, 24, 6)
  ctx.stroke()
  ctx.fillRect(507, 56, 30, 16)

  ctx.fillStyle = '#9aa097'
  ctx.font = '500 30px "Geist Variable", sans-serif'
  ctx.fillText('Good morning', 56, 178)
  ctx.fillStyle = FOG
  ctx.font = '700 58px "Geist Variable", sans-serif'
  ctx.fillText('Bao Ly', 56, 242)
  ctx.fillStyle = ACID
  ctx.beginPath()
  ctx.arc(510, 206, 40, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = INK
  ctx.font = '700 30px "Geist Variable", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('BL', 510, 217)

  const wallet = ctx.createLinearGradient(40, 290, 560, 520)
  wallet.addColorStop(0, '#c8ff7a')
  wallet.addColorStop(1, '#8fd14f')
  roundRect(ctx, 40, 290, 520, 236, 38, '')
  ctx.fillStyle = wallet
  ctx.fill()
  ctx.textAlign = 'left'
  ctx.fillStyle = INK
  ctx.font = '500 26px "Geist Variable", sans-serif'
  ctx.fillText('Wallet balance', 78, 348)
  ctx.font = '700 52px "Geist Variable", sans-serif'
  ctx.fillText('12,480,000 ₫', 78, 420)
  ;['Top up', 'Transfer', 'Pay'].forEach((label, i) => {
    roundRect(ctx, 78 + i * 150, 452, 136, 48, 24, INK)
    ctx.fillStyle = ACID
    ctx.font = '600 22px "Geist Variable", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(label, 146 + i * 150, 484)
  })

  ctx.textAlign = 'left'
  ctx.fillStyle = FOG
  ctx.font = '600 34px "Geist Variable", sans-serif'
  ctx.fillText('Mini-apps', 56, 600)
  ctx.fillStyle = '#9aa097'
  ctx.font = '500 24px "Geist Variable", sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('See all', 544, 600)

  ctx.textAlign = 'center'
  APPS.forEach((app, i) => {
    const x = 48 + (i % 4) * 130
    const y = 636 + Math.floor(i / 4) * 184
    roundRect(ctx, x, y, 104, 104, 30, app.color)
    ctx.save()
    ctx.translate(x + 52, y + 54)
    ctx.fillStyle = INK
    GLYPHS[app.glyph](ctx, app.color)
    ctx.restore()
    ctx.fillStyle = FOG
    ctx.font = '500 23px "Geist Variable", sans-serif'
    ctx.fillText(app.name, x + 52, y + 142)
  })

  roundRect(ctx, 40, 1010, 520, 134, 34, '#1d221c')
  ctx.save()
  ctx.translate(108, 1077)
  ctx.fillStyle = ACID
  polygon(ctx, starPoints(34, 15))
  ctx.restore()
  ctx.textAlign = 'left'
  ctx.fillStyle = FOG
  ctx.font = '700 30px "Geist Variable", sans-serif'
  ctx.fillText('Earn 2x points', 164, 1066)
  ctx.fillStyle = '#9aa097'
  ctx.font = '500 22px "Geist Variable", sans-serif'
  ctx.fillText('at partner cafes this week', 164, 1104)

  ;[0, 1, 2, 3].forEach((i) => {
    ctx.fillStyle = i === 0 ? ACID : '#3d423c'
    ctx.beginPath()
    ctx.arc(120 + i * 120, 1206, 13, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.restore()
}

function drawCardFace(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = ACID
  ctx.font = '600 40px "Geist Variable", sans-serif'
  ctx.fillText('digital bank', 72, 108)
  ctx.fillStyle = FOG
  ctx.font = '500 52px "Geist Mono Variable", monospace'
  ctx.fillText('4921  0715  ••••  2002', 72, 440)
  ctx.fillStyle = '#9aa097'
  ctx.font = '500 30px "Geist Mono Variable", monospace'
  ctx.fillText('BAO LY', 72, 548)
  ctx.fillText('09/29', 820, 548)
}

const COINS = 42

function CoinStream({ still }: { still: boolean }) {
  const coins = useRef<InstancedMesh>(null)
  const geometry = useMemo(() => createCoinGeometry(), [])
  const dummy = useMemo(() => new Object3D(), [])

  useFrame((state) => {
    const time = still ? 0 : state.clock.elapsedTime
    for (let i = 0; i < COINS; i++) {
      const progress = (i / COINS + time * 0.04) % 1
      const angle = progress * Math.PI * 5
      const radius = 2.7 - progress * 0.5
      dummy.position.set(Math.cos(angle) * radius, progress * 5.6 - 2.8, Math.sin(angle) * radius * 0.6 - 2.2)
      dummy.rotation.set(Math.PI / 2 + time * 1.5 + i, angle, 0)
      dummy.scale.setScalar(Math.sin(progress * Math.PI) * 1.2)
      dummy.updateMatrix()
      coins.current!.setMatrixAt(i, dummy.matrix)
    }
    coins.current!.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={coins} args={[geometry, undefined, COINS]}>
      <meshStandardMaterial color={GOLD} metalness={1} roughness={0.22} envMapIntensity={1.6} />
    </instancedMesh>
  )
}

export function BankCard({ still }: { still: boolean }) {
  const face = useCanvasTexture(1024, 640, drawCardFace)
  const tilt = useTilt(still, [0.18, -0.4], 0.45)

  return (
    <group>
      <CoinStream still={still} />
      <Float speed={still ? 0 : 1.6} rotationIntensity={0.35} floatIntensity={0.6}>
        <group ref={tilt}>
          <RoundedBox args={[3.4, 2.14, 0.05]} radius={0.12} smoothness={6}>
            <meshPhysicalMaterial color={GRAPHITE} metalness={0.85} roughness={0.32} clearcoat={1} clearcoatRoughness={0.08} />
          </RoundedBox>
          <mesh position={[0, 0, 0.027]}>
            <planeGeometry args={[3.4, 2.14]} />
            <meshBasicMaterial map={face} transparent toneMapped={false} />
          </mesh>
          <RoundedBox args={[0.52, 0.4, 0.02]} radius={0.06} position={[-1.08, 0.18, 0.03]}>
            <meshStandardMaterial color={GOLD} metalness={1} roughness={0.28} />
          </RoundedBox>
          <group position={[1.25, 0.2, 0.03]}>
            {[0.12, 0.2, 0.28].map((r) => (
              <mesh key={r} rotation={[0, 0, -Math.PI / 4]}>
                <torusGeometry args={[r, 0.012, 8, 32, Math.PI / 2]} />
                <meshBasicMaterial color={FOG} transparent opacity={0.7} />
              </mesh>
            ))}
          </group>
          <mesh position={[0, -1.07, 0]}>
            <boxGeometry args={[3.1, 0.012, 0.012]} />
            <meshBasicMaterial color={GLOW} toneMapped={false} />
          </mesh>
        </group>
      </Float>
    </group>
  )
}

function HealthIcon() {
  return (
    <group>
      <RoundedBox args={[0.46, 0.15, 0.15]} radius={0.05}>
        <Toon color="#ffffff" />
        <Outline thickness={0.015} />
      </RoundedBox>
      <RoundedBox args={[0.15, 0.46, 0.15]} radius={0.05}>
        <Toon color="#ffffff" />
        <Outline thickness={0.015} />
      </RoundedBox>
    </group>
  )
}

function GiftIcon() {
  return (
    <group scale={0.9}>
      <RoundedBox args={[0.42, 0.34, 0.42]} radius={0.04} position={[0, -0.05, 0]}>
        <Toon color={ACID} />
        <Outline thickness={0.015} />
      </RoundedBox>
      <RoundedBox args={[0.48, 0.1, 0.48]} radius={0.03} position={[0, 0.16, 0]}>
        <Toon color={ACID} />
        <Outline thickness={0.015} />
      </RoundedBox>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.09, 0.38, 0.5]} />
        <Toon color="#ff7a85" />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.5, 0.38, 0.09]} />
        <Toon color="#ff7a85" />
      </mesh>
      {[-0.6, 0.6].map((tilt) => (
        <mesh key={tilt} position={[tilt * 0.12, 0.27, 0]} rotation={[0, 0, tilt]}>
          <torusGeometry args={[0.07, 0.03, 10, 24]} />
          <Toon color="#ff7a85" />
          <Outline thickness={0.01} />
        </mesh>
      ))}
    </group>
  )
}

const ORBITERS: { tile: string; icon: ReactNode }[] = [
  { tile: '#ffb86b', icon: <Model url={MODELS.burger} size={0.55} /> },
  { tile: '#ffd84d', icon: <Model url={MODELS.taxi} size={0.62} outline={0.02} /> },
  { tile: '#7ad7f0', icon: <Model url={MODELS.delivery} size={0.62} outline={0.02} /> },
  { tile: '#d9a878', icon: <Model url={MODELS.coffee} size={0.5} /> },
  { tile: '#ff7a85', icon: <HealthIcon /> },
  { tile: '#a38bff', icon: <GiftIcon /> },
]

const ORBIT_SLOTS: [number, number, number][] = [
  [-1.75, 1.15, 0.3],
  [-2.15, 0, -0.1],
  [-1.75, -1.15, 0.3],
  [1.75, 1.15, 0.3],
  [2.15, 0, -0.1],
  [1.75, -1.15, 0.3],
]

export function Phone({ still }: { still: boolean }) {
  const screen = useCanvasTexture(SCREEN_W, SCREEN_H, drawAppScreen)
  const tilt = useTilt(still, [0.06, 0], 0.4)
  const tiles = useRef<(Group | null)[]>([])
  const icons = useRef<(Group | null)[]>([])
  const pedestal = useRef<Group>(null)

  useFrame((state, delta) => {
    if (still) return
    const time = state.clock.elapsedTime
    tiles.current.forEach((tile, i) => {
      if (!tile) return
      const [x, y] = ORBIT_SLOTS[i]
      tile.position.y = y + Math.sin(time * 1.3 + i * 1.1) * 0.12
      tile.rotation.z = Math.sin(time * 0.9 + i) * 0.08
      tile.rotation.y = -Math.sign(x) * 0.35
    })
    icons.current.forEach((icon, i) => {
      if (icon) icon.rotation.y = Math.sin(time * 1.1 + i) * 0.8
    })
    pedestal.current!.rotation.y += delta * 0.4
  })

  return (
    <group ref={tilt}>
      <Float speed={still ? 0 : 1.4} rotationIntensity={0.15} floatIntensity={0.4}>
        <RoundedBox args={[1.8, 3.6, 0.18]} radius={0.24} smoothness={6}>
          <Toon color="#2a2f29" />
          <Outline thickness={0.02} />
        </RoundedBox>
        <mesh position={[0, 0, 0.092]}>
          <planeGeometry args={[1.62, 3.42]} />
          <meshBasicMaterial map={screen} transparent toneMapped={false} />
        </mesh>
        <RoundedBox args={[0.46, 0.1, 0.01]} radius={0.05} position={[0, 1.58, 0.098]}>
          <meshBasicMaterial color={INK} />
        </RoundedBox>
        <RoundedBox args={[0.05, 0.4, 0.06]} radius={0.02} position={[0.92, 0.8, 0]}>
          <Toon color="#2a2f29" />
        </RoundedBox>
      </Float>
      <group ref={pedestal} position={[0, -2.1, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.25, 0.014, 8, 128]} />
          <meshBasicMaterial color={GLOW} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.6, 0.006, 8, 128]} />
          <meshBasicMaterial color={ACID} transparent opacity={0.4} />
        </mesh>
        <mesh position={[1.25, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={GLOW} toneMapped={false} />
        </mesh>
      </group>
      {ORBITERS.map((orbiter, i) => (
        <group key={orbiter.tile} ref={(group) => void (tiles.current[i] = group)} position={ORBIT_SLOTS[i]}>
          <RoundedBox args={[0.76, 0.76, 0.16]} radius={0.2} smoothness={4}>
            <Toon color={orbiter.tile} />
            <Outline thickness={0.015} />
          </RoundedBox>
          <group ref={(group) => void (icons.current[i] = group)} position={[0, 0, 0.34]} scale={0.92}>
            {orbiter.icon}
          </group>
        </group>
      ))}
    </group>
  )
}

const LOOP_COINS = 24

function CoinLoop({ still }: { still: boolean }) {
  const coins = useRef<InstancedMesh>(null)
  const geometry = useMemo(() => createCoinGeometry(), [])
  const material = useMemo(() => toon(GOLD), [])
  const dummy = useMemo(() => new Object3D(), [])

  useFrame((state) => {
    const time = still ? 0 : state.clock.elapsedTime
    for (let i = 0; i < LOOP_COINS; i++) {
      const angle = (i / LOOP_COINS) * Math.PI * 2 + time * 0.35
      dummy.position.set(Math.cos(angle) * 3.55, Math.sin(angle) * 1.95 + 0.1, Math.sin(angle) * 1.1 - 0.4)
      dummy.rotation.set(Math.PI / 2, 0, time * 2 + i)
      dummy.rotateX(time * 1.4 + i)
      dummy.scale.setScalar(0.85)
      dummy.updateMatrix()
      coins.current!.setMatrixAt(i, dummy.matrix)
    }
    coins.current!.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={coins} args={[geometry, material, LOOP_COINS]} />
}

function HealthCluster({ still }: { still: boolean }) {
  const heart = useMemo(() => {
    const geometry = new ExtrudeGeometry(heartShape(0.34), { depth: 0.16, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4 })
    geometry.center()
    return geometry
  }, [])
  const speed = still ? 0 : 1.6

  return (
    <group>
      <Float speed={speed} floatIntensity={0.6} rotationIntensity={0.4}>
        <mesh geometry={heart} position={[0, 0.5, 0]}>
          <Toon color="#ff5c6c" />
          <Outline thickness={0.02} />
        </mesh>
      </Float>
      <Float speed={speed * 1.2} floatIntensity={0.5}>
        <group position={[-0.6, -0.55, 0.1]} rotation={[0.3, 0.4, 0.2]}>
          <RoundedBox args={[0.56, 0.56, 0.2]} radius={0.12}>
            <Toon color="#ffffff" />
            <Outline thickness={0.015} />
          </RoundedBox>
          <group position={[0, 0, 0.11]} scale={0.8}>
            <RoundedBox args={[0.42, 0.13, 0.05]} radius={0.03}>
              <Toon color="#ff5c6c" />
            </RoundedBox>
            <RoundedBox args={[0.13, 0.42, 0.05]} radius={0.03}>
              <Toon color="#ff5c6c" />
            </RoundedBox>
          </group>
        </group>
      </Float>
      {[
        { position: [0.42, -0.35, 0.2], rotation: 0.8, color: '#7ad7f0' },
        { position: [0.1, -0.9, -0.1], rotation: -0.5, color: '#ffd84d' },
      ].map((pill, i) => (
        <Float key={i} speed={speed * (1.4 + i * 0.3)} floatIntensity={0.7} rotationIntensity={0.8}>
          <group position={pill.position as [number, number, number]} rotation={[0, 0, pill.rotation]}>
            <mesh position={[0, 0.1, 0]}>
              <capsuleGeometry args={[0.1, 0.2, 8, 16]} />
              <Toon color={pill.color} />
              <Outline thickness={0.012} />
            </mesh>
            <mesh position={[0, -0.1, 0]}>
              <capsuleGeometry args={[0.1, 0.2, 8, 16]} />
              <Toon color="#ffffff" />
              <Outline thickness={0.012} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  )
}

function FoodCluster({ still }: { still: boolean }) {
  const speed = still ? 0 : 1.5
  return (
    <group>
      <Float speed={speed} floatIntensity={0.6} rotationIntensity={0.4}>
        <group position={[0, 0.5, 0]} rotation={[0.25, -0.4, 0]}>
          <Model url={MODELS.coffee} size={0.95} />
        </group>
      </Float>
      <Float speed={speed * 1.2} floatIntensity={0.5} rotationIntensity={0.6}>
        <group position={[-0.42, -0.55, 0.2]} rotation={[0.9, 0, 0.2]}>
          <Model url={MODELS.donut} size={0.75} />
        </group>
      </Float>
      <Float speed={speed * 1.4} floatIntensity={0.6} rotationIntensity={0.5}>
        <group position={[0.6, -0.55, 0]} rotation={[0.2, 0.5, 0]}>
          <Model url={MODELS.cupcake} size={0.7} />
        </group>
      </Float>
    </group>
  )
}

function Medallion({ still }: { still: boolean }) {
  const geometry = useMemo(() => createCoinGeometry(), [])
  const sparkle = useMemo(() => new ExtrudeGeometry(starShape(0.1, 0.045), { depth: 0.03, bevelEnabled: false }), [])
  const coin = useRef<Group>(null)
  const halo = useRef<Group>(null)

  useFrame((state, delta) => {
    if (still) return
    coin.current!.rotation.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.6
    halo.current!.rotation.z -= delta * 0.5
  })

  return (
    <group>
      <group ref={coin}>
        <mesh geometry={geometry} scale={4.2} rotation={[Math.PI / 2, 0, 0]}>
          <Toon color={GOLD} />
          <Outline thickness={0.006} />
        </mesh>
      </group>
      <group ref={halo}>
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i / 6) * Math.PI * 2
          return (
            <mesh key={i} geometry={sparkle} position={[Math.cos(angle) * 1.45, Math.sin(angle) * 1.45, 0]}>
              <Toon color={i % 2 ? FOG : ACID} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

export function Loyalty({ still }: { still: boolean }) {
  const tilt = useTilt(still, [0.05, 0], 0.3)
  return (
    <group ref={tilt}>
      <group position={[-2.35, 0.05, 0]}>
        <FoodCluster still={still} />
      </group>
      <Medallion still={still} />
      <group position={[2.35, 0.05, 0]}>
        <HealthCluster still={still} />
      </group>
      <CoinLoop still={still} />
    </group>
  )
}
