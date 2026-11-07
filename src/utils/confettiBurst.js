const DURATION_MS = 1800
const GRAVITY = 0.11
const DRAG = 0.994

const COLORS = [
  '#ff4d6d',
  '#ffd166',
  '#06d6a0',
  '#4cc9f0',
  '#f72585',
  '#ffe66d',
]

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function originFromAnchor(anchorEl) {
  if (!anchorEl || typeof anchorEl.getBoundingClientRect !== 'function') {
    return { x: window.innerWidth / 2, y: window.innerHeight / 3 }
  }
  const box = anchorEl.getBoundingClientRect()
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 }
}

function createParticle(origin, reduced) {
  const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6
  const speed = reduced ? 1.2 + Math.random() * 1.4 : 8 + Math.random() * 11
  return {
    x: origin.x + (Math.random() - 0.5) * 18,
    y: origin.y - 8,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    w: 5 + Math.random() * 5,
    h: 8 + Math.random() * 8,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.35,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: Math.random() > 0.45 ? 'rect' : 'circle',
  }
}

/**
 * Plays a short confetti burst from an anchor element, then removes the canvas.
 * Returns a cleanup function that cancels animation and detaches the node.
 */
export function playConfettiBurst(anchorEl) {
  if (typeof document === 'undefined') return () => {}

  const reduced = prefersReducedMotion()
  const origin = originFromAnchor(anchorEl)
  const count = reduced ? 10 : 42

  const canvas = document.createElement('canvas')
  canvas.className = 'habit-confetti-canvas'
  canvas.setAttribute('aria-hidden', 'true')
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  function resize() {
    canvas.width = Math.floor(window.innerWidth * dpr)
    canvas.height = Math.floor(window.innerHeight * dpr)
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  resize()

  const particles = Array.from({ length: count }, () => createParticle(origin, reduced))
  const start = performance.now()
  let rafId = 0
  let finished = false

  function teardown() {
    if (finished) return
    finished = true
    cancelAnimationFrame(rafId)
    window.removeEventListener('resize', resize)
    canvas.remove()
  }

  function frame(now) {
    const elapsed = now - start
    if (elapsed >= DURATION_MS) {
      teardown()
      return
    }

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    const fade = 1 - elapsed / DURATION_MS

    for (const p of particles) {
      p.vy += GRAVITY
      p.vx *= DRAG
      p.vy *= DRAG
      p.x += p.vx
      p.y += p.vy
      p.rot += p.vr

      ctx.save()
      ctx.globalAlpha = Math.max(0, fade)
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.color
      if (p.shape === 'circle') {
        ctx.beginPath()
        ctx.arc(0, 0, p.w * 0.45, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      }
      ctx.restore()
    }

    rafId = requestAnimationFrame(frame)
  }

  window.addEventListener('resize', resize)
  rafId = requestAnimationFrame(frame)

  return teardown
}
