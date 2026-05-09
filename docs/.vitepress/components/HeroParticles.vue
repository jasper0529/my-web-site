<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let particles: Particle[] = []

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  color: string
}

const isClient = typeof window !== 'undefined'
const prefersReducedMotion = isClient && window.matchMedia("(prefers-reduced-motion: reduce)").matches
const PARTICLE_COUNT = 60
const CONNECTION_DISTANCE = 150
const COLORS = ['#2563EB', '#3B82F6', '#F97316', '#1D4ED8', '#60A5FA']

const initParticles = (width: number, height: number) => {
  particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    radius: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]
  }))
}

const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.clearRect(0, 0, width, height)

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < CONNECTION_DISTANCE) {
        const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15
        ctx.beginPath()
        ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`
        ctx.lineWidth = 0.5
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }

  // Draw particles
  for (const p of particles) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = p.color.replace(')', `, ${p.opacity})`).replace('rgb', 'rgba').replace('#', '')

    // Convert hex to rgba
    const r = parseInt(p.color.slice(1, 3), 16)
    const g = parseInt(p.color.slice(3, 5), 16)
    const b = parseInt(p.color.slice(5, 7), 16)
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`
    ctx.fill()

    // Glow effect
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2)
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3)
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.3})`)
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
    ctx.fillStyle = gradient
    ctx.fill()
  }
}

const update = (width: number, height: number) => {
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy

    // Bounce off edges
    if (p.x < 0 || p.x > width) p.vx *= -1
    if (p.y < 0 || p.y > height) p.vy *= -1

    // Keep within bounds
    p.x = Math.max(0, Math.min(width, p.x))
    p.y = Math.max(0, Math.min(height, p.y))
  }
}

const animate = () => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  const width = canvas.value.width
  const height = canvas.value.height

  update(width, height)
  draw(ctx, width, height)
  animationId = requestAnimationFrame(animate)
}

const resize = () => {
  if (!canvas.value) return
  const parent = canvas.value.parentElement
  if (!parent) return

  const dpr = window.devicePixelRatio || 1
  const rect = parent.getBoundingClientRect()

  canvas.value.width = rect.width * dpr
  canvas.value.height = rect.height * dpr
  canvas.value.style.width = `${rect.width}px`
  canvas.value.style.height = `${rect.height}px`

  const ctx = canvas.value.getContext('2d')
  if (ctx) ctx.scale(dpr, dpr)

  // Re-init particles for new dimensions
  initParticles(rect.width, rect.height)
}

onMounted(() => {
  if (!isClient || prefersReducedMotion) return
  resize()
  animate()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (isClient) window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas ref="canvas" class="hero-particles" aria-hidden="true" />
</template>

<style scoped>
.hero-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
</style>
