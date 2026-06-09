// src/actions.js
// Named actions are the ONLY writers of demo state.
// Every action must call logAction so the panel shows provenance.

import { demoState, logAction, getState } from './state.js'
import mockItems from '../data/mock-items.json' with { type: 'json' }

function findHotel(id) {
  return mockItems.find(h => h.id === id)
}

function findRoom(hotel, roomId) {
  if (!hotel) return null
  return hotel.rooms.find(r => r.id === roomId)
}

export function performSearch(params) {
  // params: { destination, checkIn, checkOut, guests }
  demoState.searchParams = {
    destination: params.destination || 'San Francisco',
    checkIn: params.checkIn || '2026-05-14',
    checkOut: params.checkOut || '2026-05-17',
    guests: Number(params.guests) || 2
  }

  // Simple client-side filter (the "mock API")
  const dest = demoState.searchParams.destination.toLowerCase()
  const filtered = mockItems
    .filter(h => h.city.toLowerCase().includes(dest) || h.name.toLowerCase().includes(dest))
    .map(h => h.id)

  demoState.filteredHotelIds = filtered.length ? filtered : mockItems.map(h => h.id)

  logAction('performSearch', `${demoState.searchParams.destination} · ${demoState.searchParams.guests} guests`)
}

export function selectHotel(hotelId) {
  const hotel = findHotel(hotelId)
  if (!hotel) return

  demoState.selectedHotelId = hotelId
  // Clear previous room selection when changing hotel
  demoState.selectedRoomId = null
  demoState.currentOperationState = 'detail'

  logAction('selectHotel', hotel.name)

  // Auto-scroll is handled by the caller (navigation) so the action stays pure
}

export function selectRoom(roomId) {
  const state = getState()
  const hotel = findHotel(state.selectedHotelId)
  const room = findRoom(hotel, roomId)
  if (!room) return

  demoState.selectedRoomId = roomId
  demoState.currentOperationState = 'checkout-preview'

  logAction('selectRoom', `${hotel?.name} — ${room.name} ($${room.rate})`)
}

export function setOperationState(newState) {
  const valid = [
    'intake', 'results', 'detail', 'checkout-preview',
    'checkout-valid', 'payment-pending-demo', 'payment-failed-demo'
  ]
  if (!valid.includes(newState)) return

  demoState.currentOperationState = newState
  logAction('setOperationState', newState)
}

// resetDemo is intentionally not implemented here — the specimen uses the resetState
// exported from state.js directly inside main.js (resetDemoStateAndUI).
// This keeps the action surface clean for Tranche 0.
