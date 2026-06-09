// src/overlays.js
// Reusable centered focus overlay. Opens on card/image clicks.
// Close via Escape, backdrop click, or explicit close button.
// Content is provided at call time so the same overlay serves hotel cards, images, or future primitives.

let overlayEl = null
let contentEl = null
let lastTrigger = null

export function initOverlays() {
  overlayEl = document.getElementById('focus-overlay')
  if (!overlayEl) return

  contentEl = overlayEl.querySelector('.overlay-content')

  // Backdrop + close button close
  overlayEl.addEventListener('click', (e) => {
    if (e.target === overlayEl || e.target.classList.contains('overlay-backdrop')) {
      closeFocusOverlay()
    }
  })

  overlayEl.querySelectorAll('.overlay-close').forEach(btn => {
    btn.addEventListener('click', closeFocusOverlay)
  })

  // Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlayEl.classList.contains('visible')) {
      e.preventDefault()
      closeFocusOverlay()
    }
  })
}

export function openFocusOverlay({ title, bodyHTML, imageUrl = null, imageAlt = '' }) {
  if (!overlayEl || !contentEl) return

  lastTrigger = document.activeElement

  const body = contentEl.querySelector('.overlay-body')
  if (!body) return

  let html = ''
  if (imageUrl) {
    html += `<img class="overlay-image" src="${imageUrl}" alt="${imageAlt || title}">`
  }
  html += `<h3 style="margin-top:0">${title}</h3>`
  html += bodyHTML || '<p class="muted-note">No additional detail provided in specimen.</p>'

  body.innerHTML = html
  contentEl.querySelector('.overlay-header span').textContent = title || 'Detail'

  overlayEl.classList.add('visible')
  overlayEl.setAttribute('aria-hidden', 'false')

  // Focus the close button for a11y
  const closeBtn = contentEl.querySelector('.overlay-close')
  if (closeBtn) closeBtn.focus({ preventScroll: true })
}

export function closeFocusOverlay() {
  if (!overlayEl) return
  overlayEl.classList.remove('visible')
  overlayEl.setAttribute('aria-hidden', 'true')

  // Restore focus
  if (lastTrigger && typeof lastTrigger.focus === 'function') {
    lastTrigger.focus({ preventScroll: true })
  }
  lastTrigger = null
}

// Convenience: attach to any element that has data-focus-title + optional data-focus-body or data-image
export function attachFocusHandlers(root = document) {
  root.querySelectorAll('[data-focus-title]').forEach(el => {
    if (el.__focusWired) return
    el.__focusWired = true

    el.addEventListener('click', (e) => {
      // Only open if not clicking an inner action button
      if (e.target.closest('button[data-action]')) return

      const title = el.getAttribute('data-focus-title') || 'Detail'
      const body = el.getAttribute('data-focus-body') || ''
      const img = el.getAttribute('data-focus-image') || null

      openFocusOverlay({
        title,
        bodyHTML: body ? `<div>${body}</div>` : '',
        imageUrl: img,
        imageAlt: title
      })
    })

    // Make it obvious these are expandable
    el.style.cursor = 'zoom-in'
  })
}
