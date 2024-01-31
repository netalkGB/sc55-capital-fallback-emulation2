import type Track from '../Track.ts'

export interface State {
  midiInputs: Array<[string, WebMidi.MIDIInput]> | null
  midiOutputs: Array<[string, WebMidi.MIDIOutput]> | null
  activeMidiInput: WebMidi.MIDIInput | null
  activeMidiOutput: WebMidi.MIDIOutput | null
  force55Map: boolean
  tracks: Track[]
}

export type Action = | {
  type: 'setMidiInputs'
  payload: Array<[string, WebMidi.MIDIInput]> | null
} | {
  type: 'setMidiOutputs'
  payload: Array<[string, WebMidi.MIDIOutput]> | null
} | {
  type: 'setActiveMidiInput'
  payload: WebMidi.MIDIInput | null
} | {
  type: 'setActiveMidiOutput'
  payload: WebMidi.MIDIOutput | null
} | {
  type: 'toggleForce55Map'
  payload: boolean
} | {
  type: 'setTrack'
  payload: { channel: number
    track: Track }
}
