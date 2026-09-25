import { ArrowDownRight, ArrowUpRight, GithubLogo, LinkedinLogo } from '@phosphor-icons/react'
import { domAnimation, LazyMotion, m, useReducedMotion } from 'motion/react'
import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import type { Focus } from './Scene'

const Scene = lazy(() => import('./Scene'))

const EMAIL = 'lygiabaokg2002@gmail.com'
const GITHUB = 'https://github.com/baorlys'
const LINKEDIN = 'https://www.linkedin.com/in/baorlys'

type Project = {
  id: 'bank' | 'superapp' | 'loyalty'
  name: string
  summary: string
  metric: { value: string; label: string }
  highlights: { title: string; body: string }[]
  stack: string[]
}

const PROJECTS: Project[] = [
  {
    id: 'bank',
    name: 'Digital Bank',
    summary: 'A licensed digital bank with 3 million customers, run by a fintech group. I work in the onboarding and eVoucher teams.',
    metric: { value: '11,000', label: 'customer IDs allocated a day, zero duplicates' },
    highlights: [
      { title: 'CIF allocation', body: 'Per-type pools with Feistel-based IDs, claimed through FOR UPDATE SKIP LOCKED so pods never queue.' },
      { title: 'eVoucher issuance', body: 'One orchestration over two partner APIs, safe to replay under retries and Kafka redelivery.' },
      { title: 'Onboarding session', body: 'KYC, ID card, NFC and face-check evidence in one DynamoDB aggregate, created idempotently.' },
      { title: 'Pool backpressure', body: 'Capped refill batches so a drained pool cannot stampede the database, plus reclaim for crashed pods.' },
    ],
    stack: ['Java', 'Spring Boot 3', 'PostgreSQL', 'Kafka', 'AWS KMS', 'EKS'],
  },
  {
    id: 'superapp',
    name: 'Super App',
    summary: 'A consumer super app hosting partner mini-apps under one login. I build the identity and session services.',
    metric: { value: 'Java 25', label: 'onboarding service built from scratch on Spring Boot 4' },
    highlights: [
      { title: 'Challenge chain', body: 'Versioned step-up authentication with assurance floors per customer tier, cached on the hot path.' },
      { title: 'Mini-app access', body: 'A Keycloak SPI that limits which mini-app APIs each client reaches, with a pseudonymous token subject.' },
      { title: 'Onboarding service', body: 'Clean Architecture, Liquibase, Kafka, OpenAPI and WireMock tests, shipped through to staging.' },
      { title: 'Satellite services', body: 'MFA, device management, configuration, partner integration and the BFF for web and mobile.' },
    ],
    stack: ['Java 25', 'Spring Boot 4', 'Keycloak', 'Kafka', 'DynamoDB', 'Argo CD'],
  },
  {
    id: 'loyalty',
    name: 'Loyalty Platform',
    summary: 'One points and rewards domain shared by F&B chains and healthcare clinics, so members earn in one place and redeem in another.',
    metric: { value: '6-8s', label: 'report exports, down from 20-30s' },
    highlights: [
      { title: 'Points ledger', body: 'Concurrency controls that keep balances correct when one transaction draws on several funding sources.' },
      { title: 'Search sync', body: 'MariaDB to Elasticsearch through a transactional outbox, strictly ordered and with no dual writes.' },
      { title: 'E-invoicing', body: 'A vendor-agnostic signing layer that keeps invoices compliant with tax authority rules.' },
      { title: 'Reporting', body: 'Rewritten queries and lower JVM allocation for the heavy Excel exports merchants run.' },
    ],
    stack: ['Java', 'Spring Boot', 'MariaDB', 'Elasticsearch', 'Docker'],
  },
]

type Milestone = {
  period: string
  title: string
  role: string
  body: string
  current?: boolean
  work?: { label: string; href: string }[]
}

const EXPERIENCE: Milestone[] = [
  {
    period: 'Oct 2025 - now',
    title: 'CMC Global',
    role: 'Backend Engineer, on site at a fintech group',
    body: 'Led a three-engineer squad for six months. Rated a top performer by the client.',
    current: true,
    work: [
      { label: 'Digital Bank', href: '#bank' },
      { label: 'Super App', href: '#superapp' },
    ],
  },
  {
    period: 'Jun - Sep 2025',
    title: 'ID Solutions',
    role: 'Software Engineer, contract',
    body: 'Backend for a loyalty platform serving F&B and healthcare merchants.',
    work: [{ label: 'Loyalty Platform', href: '#loyalty' }],
  },
  {
    period: 'May 2024 - Jun 2025',
    title: 'NashTech, bbv Vietnam',
    role: 'Software Engineer Intern, full-time',
    body: 'Multi-tenant digital asset management, RabbitMQ image processing, and a notification service for voice, SMS and email.',
  },
  {
    period: '2020 - 2026',
    title: 'Ton Duc Thang University',
    role: 'B.Eng. Software Engineering',
    body: 'Competed on the ICPC regional team in 2022 and 2023.',
  },
]

const STACK = [
  ['openjdk', 'Java'],
  ['spring', 'Spring'],
  ['hibernate', 'Hibernate'],
  ['postgresql', 'PostgreSQL'],
  ['redis', 'Redis'],
  ['apachekafka', 'Kafka'],
  ['keycloak', 'Keycloak'],
  ['docker', 'Docker'],
  ['kubernetes', 'Kubernetes'],
  ['argo', 'Argo CD'],
  ['go', 'Go'],
  ['neovim', 'Neovim'],
  ['linux', 'Linux'],
]

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

const EASE = [0.16, 1, 0.3, 1] as const

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])
  return matches
}

function useActiveFocus() {
  const [focus, setFocus] = useState<Focus>('hero')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setFocus((visible.target as HTMLElement).dataset.focus as Focus)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    document.querySelectorAll('[data-focus]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  return focus
}

function useVimNavigation(reduce: boolean) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || (event.target as HTMLElement).isContentEditable) return
      if (event.key !== 'j' && event.key !== 'k') return
      const sections = [...document.querySelectorAll<HTMLElement>('[data-focus]')]
      const current = sections.findIndex((section) => section.getBoundingClientRect().bottom > window.innerHeight * 0.5)
      const next = sections[Math.min(Math.max(current + (event.key === 'j' ? 1 : -1), 0), sections.length - 1)]
      next.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [reduce])
}

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <m.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </m.div>
  )
}

function PillLink({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-medium transition duration-300 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid ${
        primary ? 'bg-acid text-ink hover:bg-fog' : 'border border-line text-fog hover:border-fog/60'
      }`}
    >
      {children}
    </a>
  )
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-ink/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="font-mono text-sm font-semibold tracking-tight">
          bao<span className="text-acid">.</span>ly
        </a>
        <div className="flex items-center gap-6 text-sm text-mute">
          <a href="#bank" className="hidden transition hover:text-fog sm:block">Work</a>
          <a href="#experience" className="hidden transition hover:text-fog sm:block">Experience</a>
          <a href="#approach" className="hidden transition hover:text-fog sm:block">Approach</a>
          <a href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub" className="transition hover:text-fog">
            <GithubLogo size={20} />
          </a>
          <PillLink href={`mailto:${EMAIL}`}>Email me</PillLink>
        </div>
      </nav>
    </header>
  )
}

function Hero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease: EASE },
  })
  return (
    <section id="top" data-focus="hero" className="mx-auto flex min-h-[100dvh] max-w-7xl items-end px-5 pb-20 pt-24 md:items-center md:px-8 md:pb-0">
      <div className="max-w-xl">
        <m.p {...rise(0.1)} className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-acid">
          Bao Ly, Backend Engineer
        </m.p>
        <m.h1 {...rise(0.2)} className="text-5xl font-semibold leading-[1.02] tracking-tighter md:text-6xl lg:text-7xl">
          I build the backend that moves money.
        </m.h1>
        <m.p {...rise(0.35)} className="mt-6 max-w-md text-lg leading-relaxed text-mute">
          Two years building onboarding and identity backends for a 3-million-customer digital bank and a fintech super app.
        </m.p>
        <m.div {...rise(0.5)} className="mt-10 flex flex-wrap gap-3">
          <PillLink href="#bank" primary>
            See the work <ArrowDownRight size={16} weight="bold" />
          </PillLink>
          <PillLink href={`mailto:${EMAIL}`}>Email me</PillLink>
        </m.div>
      </div>
    </section>
  )
}

function ProjectSection({ project }: { project: Project }) {
  return (
    <section id={project.id} data-focus={project.id} className="mx-auto flex min-h-[100dvh] max-w-7xl items-start px-5 pb-24 pt-[48dvh] md:items-center md:px-8 md:py-24">
      <div className="max-w-xl rounded-2xl bg-ink/90 p-6 md:max-w-[50%] md:bg-transparent md:p-0 lg:max-w-xl">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-tighter md:text-5xl">{project.name}</h2>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-mute">{project.summary}</p>
          <p className="mt-8 flex items-baseline gap-4">
            <span className="whitespace-nowrap font-mono text-4xl font-medium tracking-tight text-acid md:text-5xl">{project.metric.value}</span>
            <span className="max-w-[22ch] text-sm leading-snug text-mute">{project.metric.label}</span>
          </p>
        </Reveal>
        <dl className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {project.highlights.map((item, i) => (
            <Reveal key={item.title} delay={0.08 * i}>
              <dt className="font-medium">{item.title}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-mute">{item.body}</dd>
            </Reveal>
          ))}
        </dl>
        <Reveal delay={0.3}>
          <ul className="mt-10 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li key={tech} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-mute">
                {tech}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience" data-focus="experience" className="mx-auto flex min-h-[100dvh] max-w-7xl items-start px-5 pb-24 pt-[48dvh] md:items-center md:px-8 md:py-24">
      <div className="max-w-xl rounded-2xl bg-ink/90 p-6 md:max-w-[50%] md:bg-transparent md:p-0 lg:max-w-xl">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-tighter md:text-5xl">Experience</h2>
        </Reveal>
        <ol className="relative mt-12 border-l border-line pl-8">
          {EXPERIENCE.map((item, i) => (
            <Reveal key={item.title} delay={0.08 * i} className="relative pb-9 last:pb-0">
              <li>
                <span
                  aria-hidden
                  className={`absolute -left-[38px] top-1.5 size-3 rounded-full ${item.current ? 'bg-acid ring-4 ring-acid/20' : 'border border-mute bg-ink'}`}
                />
                <p className="font-mono text-xs text-mute">{item.period}</p>
                <h3 className="mt-2 text-xl font-medium">{item.title}</h3>
                <p className="mt-0.5 text-sm text-mute">{item.role}</p>
                <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-fog/80">{item.body}</p>
                {item.work && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.work.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-fog transition hover:border-acid hover:text-acid"
                      >
                        {link.label} <ArrowUpRight size={12} weight="bold" />
                      </a>
                    ))}
                  </div>
                )}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function StackGrid() {
  return (
    <ul className="grid grid-cols-4 gap-x-2 gap-y-5">
      {STACK.map(([slug, name]) => (
        <li key={slug} className="flex flex-col items-center gap-2 text-center">
          <img src={`https://cdn.simpleicons.org/${slug}/e8eae5`} alt="" width={26} height={26} loading="lazy" className="size-6 opacity-80" />
          <span className="font-mono text-[11px] text-mute">{name}</span>
        </li>
      ))}
    </ul>
  )
}

function Approach() {
  const cell = 'rounded-2xl border border-line p-7 md:p-8'
  return (
    <section id="approach" data-focus="rest" className="flex min-h-[100dvh] items-center bg-ink-2">
      <div className="mx-auto w-full max-w-7xl px-5 py-24 md:px-8">
        <div className="grid gap-4 md:grid-cols-6">
          <Reveal className={`${cell} bg-[radial-gradient(120%_120%_at_0%_0%,rgba(184,243,106,0.12),transparent_55%)] md:col-span-4`}>
            <h2 className="max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tighter md:text-5xl">
              Banking code gets one chance to be <span className="text-acid">right</span>.
            </h2>
            <p className="mt-6 max-w-[52ch] leading-relaxed text-mute">
              Money and identity flows get idempotency, clear error codes and tests on real config before any tuning.
            </p>
          </Reveal>
          <Reveal delay={0.06} className={`${cell} flex flex-col justify-between border-acid bg-acid text-ink md:col-span-2`}>
            <p className="font-mono text-6xl font-medium tracking-tight">14</p>
            <p className="mt-8 leading-relaxed">
              skills in the team&rsquo;s Claude Code plugin I wrote, turning our conventions into checks that run on every change.
            </p>
          </Reveal>
          <Reveal delay={0.1} className={`${cell} bg-ink md:col-span-2`}>
            <h3 className="text-xl font-medium">Profile, then cache</h3>
            <p className="mt-3 leading-relaxed text-mute">The challenge chain got a cache only after profiling showed three queries per start and five per switch.</p>
          </Reveal>
          <Reveal delay={0.14} className={`${cell} bg-ink md:col-span-2`}>
            <h3 className="text-xl font-medium">Write it down</h3>
            <p className="mt-3 leading-relaxed text-mute">A design doc for every cross-service decision, so the next engineer does not have to guess.</p>
          </Reveal>
          <Reveal delay={0.18} className={`${cell} bg-ink md:col-span-2`}>
            <h3 className="sr-only">Tech stack</h3>
            <StackGrid />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section data-focus="rest" className="flex min-h-[100dvh] flex-col bg-ink">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-28 md:px-8">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tighter text-mute md:text-4xl">Building something that has to hold?</h2>
          <a
            href={`mailto:${EMAIL}`}
            className="group mt-6 inline-flex max-w-full items-center gap-4 break-all text-3xl font-semibold tracking-tighter transition hover:text-acid sm:text-5xl lg:text-7xl"
          >
            {EMAIL}
            <ArrowUpRight className="shrink-0 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" weight="bold" />
          </a>
        </Reveal>
        <div className="mt-16 flex flex-wrap gap-3">
          <PillLink href={LINKEDIN}>
            <LinkedinLogo size={18} /> LinkedIn
          </PillLink>
          <PillLink href={GITHUB}>
            <GithubLogo size={18} /> GitHub
          </PillLink>
        </div>
      </div>
      <footer className="mx-auto flex w-full max-w-7xl flex-wrap justify-between gap-4 border-t border-line px-5 py-8 text-sm text-mute md:px-8">
        <span>© 2026 Bao Ly</span>
        <span className="hidden md:block">
          Press <kbd className="font-mono text-fog">j</kbd> / <kbd className="font-mono text-fog">k</kbd> to move between sections
        </span>
      </footer>
    </section>
  )
}

export default function App() {
  const reduce = useReducedMotion() ?? false
  const wide = useMediaQuery('(min-width: 768px)')
  const focus = useActiveFocus()
  useVimNavigation(reduce)

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="grain">
        <div
          aria-hidden
          className={`fixed inset-0 transition-opacity duration-700 ${focus === 'rest' ? 'opacity-0' : wide ? 'opacity-100' : 'opacity-70'}`}
        >
          <SceneBoundary>
            <Suspense fallback={null}>
              <Scene focus={focus} wide={wide} still={reduce} />
            </Suspense>
          </SceneBoundary>
        </div>
        <Nav />
        <main className="relative">
          <Hero />
          {PROJECTS.map((project) => (
            <ProjectSection key={project.id} project={project} />
          ))}
          <Experience />
          <Approach />
          <Contact />
        </main>
      </div>
    </LazyMotion>
  )
}
