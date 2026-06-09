// src/state.js
// Central observable demo state for the Single-Canvas Reactive Specimen.
// Proxy-based so any top-level assignment notifies subscribers.
// All writes MUST go through actions.js — render code and event handlers only read.

import initialDemoState from '../data/demo-state.json' with { type: 'json' }

const listeners = new Set()
let internal = { ...initialDemoState }

export const demoState = new Proxy(internal, {
  set(target, key, value) {
    const prev = target[key]
    target[key] = value
    // Notify on any change
    listeners.forEach((fn) => {
      try { fn(key, value, prev) }
      catch (e) { console.error('state listener error', e) }
    })
    return true
  },
  get(target, key) {
    return target[key]
  }
})

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getState() {
  // Return a shallow snapshot so consumers don't accidentally mutate
  return { ...demoState }
}

export function resetState() {
  const fresh = { ...initialDemoState }
  // Replace top-level keys so proxy fires for each
  Object.keys(fresh).forEach(k => {
    demoState[k] = fresh[k]
  })
  // Clear any extra keys that may have been added
  Object.keys(demoState).forEach(k => {
    if (!(k in fresh)) delete demoState[k]
  })
}

export function logAction(action, detail = '') {
  const entry = {
    ts: Date.now(),
    action,
    detail: String(detail || '').slice(0, 120)
  }
  // Keep last 12 entries in a log array (not part of the contract but useful)
  if (!Array.isArray(demoState.__log)) demoState.__log = []
  demoState.__log = [entry, ...demoState.__log].slice(0, 12)
  demoState.lastAction = entry
}
