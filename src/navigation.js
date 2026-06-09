// src/navigation.js
// IntersectionObserver driven active section + smooth scroll helpers.
// Hash is used only as a non-routing anchor (per spec).

const SECTION_IDS = ['intake-search', 'results-grid', 'detail-selection', 'checkout-preview']

let observer = null
let onActiveChange = null

export function initNavigation(onActive) {
  onActiveChange = onActive

  const sections = SECTION_IDS
    .map(id => document.querySelector(`section[data-section-id="${id}"]`))
    .filter(Boolean)

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      // Pick the most visible section
      let best = null
      let maxRatio = 0
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio
          best = entry.target
        }
      }
      if (best && onActiveChange) {
        const id = best.getAttribute('data-section-id')
        onActiveChange(id)
      }
    }, {
      rootMargin: '-80px 0px -40% 0px',
      threshold: [0.25, 0.5, 0.75]
    })

    sections.forEach(s => observer.observe(s))
  }

  // Wire the top nav buttons (they exist in index.html)
  document.querySelectorAll('.section-nav [data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-nav')
      scrollToSection(target)
    })
  })

  // Keyboard support: 1-4 jumps to sections (nice for demo)
  document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '4' && !e.target.matches('input, textarea')) {
      const idx = Number(e.key) - 1
      const id = SECTION_IDS[idx]
      if (id) scrollToSection(id, true)
    }
    if (e.key.toLowerCase() === 'r' && e.target === document.body) {
      // quick reset hint (actual reset button is in panel)
      e.preventDefault()
    }
  })
}

export function scrollToSection(sectionId, focusAfter = false) {
  const el = document.querySelector(`section[data-section-id="${sectionId}"]`)
  if (!el) return

  el.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // Temporary visual focus ring so the user sees what changed
  el.classList.add('focus-highlight')
  setTimeout(() => el.classList.remove('focus-highlight'), 1600)

  // Update hash lightly (anchor only, not routing)
  history.replaceState(null, '', `#${sectionId}`)

  if (focusAfter) {
    // Move focus into the section for keyboard users
    const firstInteractive = el.querySelector('button, input, a')
    if (firstInteractive) firstInteractive.focus({ preventScroll: true })
  }
}

export function setActiveNav(sectionId) {
  document.querySelectorAll('.section-nav [data-nav]').forEach(btn => {
    const isActive = btn.getAttribute('data-nav') === sectionId
    btn.classList.toggle('is-active', isActive)
    btn.setAttribute('aria-current', isActive ? 'true' : 'false')
  })

  // Also toggle header on the section itself
  document.querySelectorAll('.flow section').forEach(sec => {
    const hdr = sec.querySelector('.section-header')
    if (!hdr) return
    const isActive = sec.getAttribute('data-section-id') === sectionId
    hdr.classList.toggle('is-active', isActive)
  })
}

export function getSectionOrder() {
  return [...SECTION_IDS]
}
