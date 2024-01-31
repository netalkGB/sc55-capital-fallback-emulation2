import Track from '../Track.ts'
import type { Action, State } from './types.ts'

export const initialState = {
  midiInputs: null,
  midiOutputs: null,
  activeMidiInput: null,
  activeMidiOutput: null,
  force55Map: false,
  tracks: createInitialTracks()
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setMidiInputs':
      return {
        ...state,
        midiInputs: action.payload
      }
    case 'setMidiOutputs':
      return {
        ...state,
        midiOutputs: action.payload
      }
    case 'setActiveMidiInput':
      return {
        ...state,
        activeMidiInput: action.payload
      }
    case 'setActiveMidiOutput':
      return {
        ...state,
        activeMidiOutput: action.payload
      }
    case 'toggleForce55Map':
      return {
        ...state,
        force55Map: action.payload
      }
    case 'setTrack':
      // eslint-disable-next-line no-case-declarations
      const tracks = state.tracks
      tracks[action.payload.channel] = action.payload.track
      return {
        ...state,
        tracks
      }
    default:
      return state
  }
}

function createInitialTracks (): Track[] {
  const tracks: Track[] = []
  for (let i = 0; i < 16; i++) {
    tracks.push(Track.makePart({ bankMSB: 0, bankLSB: 0, programNumber: 0, channel: i + 1 }))
  }
  return tracks
}
