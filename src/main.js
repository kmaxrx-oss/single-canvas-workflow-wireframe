// src/main.js
// Tranche 0 Single-Canvas Reactive Specimen entry point.
// Wires: observable state, named actions, navigation (IntersectionObserver), overlays,
// renders for results / detail / checkout, sticky state panel, and action delegation.

import { demoState, subscribe, getState, resetState, logAction } from './state.js'
import {
  performSearch, selectHotel, selectRoom, setOperationState
} from './actions.js'
import { initNavigation, scrollToSection, setActiveNav, getSectionOrder } from './navigation.js'
import { initOverlays, openFocusOverlay, attachFocusHandlers, closeFocusOverlay } from './overlays.js'
import { initMotion } from './animations.js'

import mockItems from '../data/mock-items.json' with { type: 'json' }
import workflow from '../data/workflow.json' with { type: 'json' }

// --- Renderers (called on every state change) ---

function renderStatePanel() {
  const panel = document.getElementById('state-panel')
  if (!panel) return

  const s = getState()
  const log = s.__log || []

  const rows = `
    <div class="state-row"><span class="state-key">searchParams</span><span class="state-value">${s.searchParams?.destination || '—'} · ${s.searchParams?.guests || '?'} guests</span></div>
    <div class="state-row"><span class="state-key">selectedHotelId</span><span class="state-value">${s.selectedHotelId || 'null'}</span></div>
    <div class="state-row"><span class="state-key">selectedRoomId</span><span class="state-value">${s.selectedRoomId || 'null'}</span></div>
    <div class="state-row"><span class="state-key">operationState</span><span class="state-value">${s.currentOperationState}</span></div>
    <div class="state-row"><span class="state-key">filtered</span><span class="state-value">${(s.filteredHotelIds || []).length} hotels</span></div>
  `

  const logHtml = log.length
    ? log.map(e => {
        const t = new Date(e.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        return `<div class="log-entry"><span class="action">${e.action}</span> <span style="opacity:.6">${t}</span><br>${e.detail}</div>`
      }).join('')
    : '<div class="log-entry" style="opacity:.6">No actions yet. Perform a search or selection.</div>'

  panel.innerHTML = `
    <h3>DEMO STATE <span class="mock-badge" style="margin-left:6px">SPECIMEN</span></h3>
    ${rows}
    <div class="state-panel-log-title">ACTION LOG (last ${log.length})</div>
    <div class="action-log">${logHtml}</div>
    <button class="reset-btn" data-reset-demo>RESET DEMO STATE</button>
    <div style="margin-top:8px;font-size:10px;opacity:.6;line-height:1.3">
      No persistence. Reload = clean state.<br>
      All mutations via named actions.
    </div>
  `

  // Wire reset (robust)
  const resetBtn = panel.querySelector('[data-reset-demo]')
  if (resetBtn) {
    resetBtn.onclick = () => {
      resetDemoStateAndUI()
    }
  }
}

function renderResults() {
  const container = document.getElementById('results-grid')
  if (!container) return

  const s = getState()
  const ids = (s.filteredHotelIds && s.filteredHotelIds.length)
    ? s.filteredHotelIds
    : mockItems.map(h => h.id)

  const hotels = ids.map(id => mockItems.find(h => h.id === id)).filter(Boolean)

  if (!hotels.length) {
    container.innerHTML = `<p class="muted-note">No results. Try a broader search (e.g. "San Francisco").</p>`
    return
  }

  container.innerHTML = hotels.map(h => {
    const img = `https://picsum.photos/id/${(h.imageSeed % 200) + 10}/600/400`
    const isSelected = s.selectedHotelId === h.id
    return `
      <div class="card hotel-card ${isSelected ? 'selected' : ''}"
           data-focus-title="${h.name}"
           data-focus-body="<p>${h.description}</p><p class='muted-note'>${h.city} • Rating ${h.rating}</p>"
           data-focus-image="${img}">
        <div class="thumb" style="background-image:url('${img}')">
          <span class="mock-badge">MOCK</span>
        </div>
        <h4>${h.name}</h4>
        <div class="meta">${h.city} • ★ ${h.rating}</div>
        <div class="price">from $${h.priceFrom}</div>
        <button type="button"
                data-action="selectHotel"
                data-hotel-id="${h.id}"
                style="margin-top:10px;width:100%">
          Select &amp; View
        </button>
      </div>
    `
  }).join('')

  // Re-attach focus handlers for the new cards
  attachFocusHandlers(container)
}

function renderDetail() {
  const container = document.getElementById('detail-body')
  if (!container) return

  const s = getState()
  const hotel = mockItems.find(h => h.id === s.selectedHotelId)

  if (!hotel) {
    container.innerHTML = `
      <div class="card" style="background:var(--accent-weak);border-style:dashed">
        <p><strong>No hotel selected yet.</strong></p>
        <p class="muted-note">Use the Results Grid above to choose a property. The Detail / Selection surface will activate once <code>selectedHotelId</code> is written.</p>
      </div>
    `
    return
  }

  const selectedRoom = hotel.rooms.find(r => r.id === s.selectedRoomId)

  const roomHtml = hotel.rooms.map(r => {
    const sel = s.selectedRoomId === r.id
    return `
      <div class="card room-card ${sel ? 'selected' : ''}"
           data-focus-title="${r.name} — ${hotel.name}"
           data-focus-body="<p>${r.features}</p><p>Rate: <strong>$${r.rate}</strong> per night</p>">
        <h4>${r.name}</h4>
        <div class="rate">$${r.rate} / night</div>
        <div class="features">${r.features}</div>
        <button type="button"
                data-action="selectRoom"
                data-room-id="${r.id}"
                style="margin-top:10px;width:100%">
          ${sel ? 'Selected ✓' : 'Select this rate'}
        </button>
      </div>
    `
  }).join('')

  container.innerHTML = `
    <div class="specimen-banner"><strong>MOCK DATA</strong> — this surface reads selectedHotelId and renders its rooms from mock-items.json</div>
    <h3 style="margin:0 0 4px">${hotel.name}</h3>
    <div class="meta" style="margin-bottom:12px">${hotel.city} • ★ ${hotel.rating} • ${hotel.description}</div>

    <h4 style="margin-top:16px">Room &amp; Rate Options</h4>
    <div class="room-grid" id="room-grid-inner">
      ${roomHtml}
    </div>

    <div style="margin-top:16px">
      <button class="primary"
              data-action="proceedToCheckout"
              ${s.selectedRoomId ? '' : 'disabled'}>
        Continue to Checkout Preview →
      </button>
      <span class="muted-note" style="margin-left:8px">Writes selectedRoomId + advances operation state</span>
    </div>
  `

  attachFocusHandlers(container)
}

function renderCheckoutPreview() {
  const container = document.getElementById('checkout-body')
  if (!container) return

  const s = getState()
  const hotel = mockItems.find(h => h.id === s.selectedHotelId)
  const room = hotel?.rooms.find(r => r.id === s.selectedRoomId)

  const hasSelection = !!(hotel && room)

  let summary = ''
  if (hasSelection) {
    const nights = 3 // demo constant
    const total = room.rate * nights
    summary = `
      <div class="checkout-summary">
        <dl>
          <dt>Hotel</dt><dd>${hotel.name}</dd>
          <dt>Room</dt><dd>${room.name}</dd>
          <dt>Dates</dt><dd>${s.searchParams.checkIn} → ${s.searchParams.checkOut} (${nights} nights)</dd>
          <dt>Guests</dt><dd>${s.searchParams.guests}</dd>
          <dt>Est. Total</dt><dd><strong>$${total}</strong> <span class="muted-note">(demo, tax not included)</span></dd>
        </dl>
      </div>
    `
  } else {
    summary = `<p class="muted-note">No hotel + room selected yet. Complete the previous two sections to populate this preview.</p>`
  }

  const current = s.currentOperationState
  const pills = ['checkout-preview', 'checkout-valid', 'payment-pending-demo', 'payment-failed-demo']
    .map(st => `
      <button class="op-pill ${st === current ? 'current' : ''}"
              data-action="setOperationState"
              data-state="${st}">
        ${st}
      </button>
    `).join('')

  container.innerHTML = `
    <div class="specimen-banner"><strong>OPERATION STATE STUB</strong> — not a real checkout. This surface demonstrates the state machine that a future Operation Map will visualize.</div>

    <h3 style="margin-top:0">Current Selections</h3>
    ${summary}

    <h4 style="margin:16px 0 8px">Operation State (demo)</h4>
    <div class="op-state">
      ${pills}
    </div>

    <p class="muted-note" style="margin-top:8px">
      These buttons call <code>setOperationState(...)</code>. In a real system this would be driven by backend booking status.
    </p>

    <div style="margin-top:12px">
      <button data-action="setOperationState" data-state="checkout-valid">Mark checkout-valid</button>
      <button data-action="setOperationState" data-state="payment-pending-demo">Simulate payment pending</button>
      <button data-action="setOperationState" data-state="payment-failed-demo">Force payment-failed-demo</button>
    </div>
  `
}

// --- Main wiring ---

function wireActionDelegation() {
  // Single delegated listener for all data-action buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]')
    if (!btn) return

    const action = btn.getAttribute('data-action')
    const hotelId = btn.getAttribute('data-hotel-id')
    const roomId = btn.getAttribute('data-room-id')
    const opState = btn.getAttribute('data-state')

    switch (action) {
      case 'performSearch': {
        const form = btn.closest('form') || document
        const destination = form.querySelector('#destination')?.value || 'San Francisco'
        const checkIn = form.querySelector('#checkin')?.value || '2026-05-14'
        const checkOut = form.querySelector('#checkout')?.value || '2026-05-17'
        const guests = form.querySelector('#guests')?.value || '2'
        performSearch({ destination, checkIn, checkOut, guests })
        // After search, gently move user attention to results
        setTimeout(() => scrollToSection('results-grid'), 180)
        break
      }
      case 'selectHotel':
        if (hotelId) {
          selectHotel(hotelId)
          // Scroll + focus the detail section so the user sees the effect
          setTimeout(() => scrollToSection('detail-selection', true), 120)
        }
        break
      case 'selectRoom':
        if (roomId) {
          selectRoom(roomId)
          setTimeout(() => scrollToSection('checkout-preview'), 160)
        }
        break
      case 'proceedToCheckout':
        // This is a navigation + state hint action (still goes through the system)
        demoState.currentOperationState = 'checkout-preview'
        logAction('proceedToCheckout', 'user advanced from detail')
        scrollToSection('checkout-preview')
        break
      case 'setOperationState':
        if (opState) setOperationState(opState)
        break
      default:
        console.warn('Unhandled data-action:', action)
    }
  })

  // Also support form submit for the search (nice UX)
  const searchForm = document.getElementById('search-form')
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault()
      const btn = searchForm.querySelector('button[data-action="performSearch"]')
      if (btn) btn.click()
    })
  }
}

function resetDemoStateAndUI() {
  resetState()
  // Re-kick an initial search so results are populated (deterministic)
  performSearch(getState().searchParams)
  // Clear visual selection classes etc by re-rendering
  renderResults()
  renderDetail()
  renderCheckoutPreview()
  renderStatePanel()
  setActiveNav('intake-search')
  // Close any open overlay
  closeFocusOverlay()
}

function onStateChange(key, value, prev) {
  // Targeted re-renders. We could be smarter, but for Tranche 0 this is transparent.
  renderStatePanel()

  if (['searchParams', 'filteredHotelIds'].includes(key)) {
    renderResults()
  }
  if (['selectedHotelId', 'selectedRoomId'].includes(key)) {
    renderDetail()
    renderCheckoutPreview()
  }
  if (key === 'currentOperationState') {
    renderCheckoutPreview()
  }
  if (key === 'lastAction' || key === '__log') {
    renderStatePanel()
  }
}

async function init() {
  // 1. Styles are linked in index.html (tokens → base → layout → components → motion)

  // 2. Initial state is already the proxy default. Seed a sensible search.
  const initialParams = getState().searchParams
  performSearch(initialParams) // this will populate filteredHotelIds via the action

  // 3. Wire UI
  initOverlays()
  initMotion()
  initNavigation((activeId) => {
    setActiveNav(activeId)
  })
  wireActionDelegation()
  attachFocusHandlers(document)

  // 4. Subscribe state → UI
  subscribe(onStateChange)

  // 5. First paint of dynamic pieces
  renderResults()
  renderDetail()
  renderCheckoutPreview()
  renderStatePanel()

  // 6. Set initial active nav (intake)
  setActiveNav('intake-search')

  // 7. Gentle hint in the action log
  setTimeout(() => {
    const panel = document.getElementById('state-panel')
    if (panel && (!getState().__log || getState().__log.length === 0)) {
      // already rendered by performSearch
    }
  }, 50)

  // 8. Keyboard hint (once)
  console.log('%c[specimen] Tranche 0 ready. Press 1-4 to jump sections. Use the Demo State panel on the right.', 'color:#6b665d')

  // Debug hooks for reviewers (console)
  window.demoState = demoState
  window.resetSpecimen = resetDemoStateAndUI
  window.__logAction = logAction // for advanced poking if needed
}

// Boot
init()
