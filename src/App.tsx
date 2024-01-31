import React, { useEffect, useReducer } from 'react'
import './App.css'
import Track from './Track.ts'
import Monitor from './components/monitor/Monitor.tsx'

interface State {
  midiInputs: Array<[string, WebMidi.MIDIInput]> | null
  midiOutputs: Array<[string, WebMidi.MIDIOutput]> | null
  activeMidiInput: WebMidi.MIDIInput | null
  activeMidiOutput: WebMidi.MIDIOutput | null
  force55Map: boolean
  tracks: Track[]
}

type Action = | {
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

const initialState = {
  midiInputs: null,
  midiOutputs: null,
  activeMidiInput: null,
  activeMidiOutput: null,
  force55Map: false,
  tracks: createInitialTracks()
}

function createInitialTracks (): Track[] {
  const tracks: Track[] = []
  for (let i = 0; i < 16; i++) {
    tracks.push(Track.makePart({ bankMSB: 0, bankLSB: 0, programNumber: 0, channel: i + 1 }))
  }
  return tracks
}

const reducer = (state: State, action: Action): State => {
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
      const tracks2 = [...state.tracks]
      tracks2[action.payload.channel] = action.payload.track
      return {
        ...state,
        tracks: tracks2
      }
    default:
      return state
  }
}

function App (): React.ReactNode {
  const [state, dispatch] = useReducer(reducer, initialState)

  let first = true
  useEffect(() => {
    if (first) {
      first = false
      onLoad()
    }
  }, [])

  useEffect(() => {
    start()
  }, [state.activeMidiInput, state.activeMidiOutput])

  useEffect(() => {
    if (state.activeMidiInput === null || state.activeMidiOutput === null) {
      return
    }
    for (let i = 0; i < 16; i++) {
      const track = state.tracks[i]
      const { programChangeNumber } = track
      const bsCh = 0xB0 + i
      const pcCh = 0xC0 + i
      const bankSelectLSB = state.force55Map ? 1 : state.tracks[i].bankSelectLSB
      state.activeMidiOutput.send([bsCh, 0x20, bankSelectLSB])
      state.activeMidiOutput.send([pcCh, programChangeNumber])
    }
    start()
  }, [state.force55Map])

  function onLoad (): void {
    console.log('onLoad')

    if (navigator.requestMIDIAccess === undefined) {
      alert('Web MIDI API not supported')
      return
    }

    const onMIDISuccess = (midiAccess: WebMidi.MIDIAccess): void => {
      const inputs = []
      for (const entry of midiAccess.inputs) {
        inputs.push(entry)
      }
      dispatch({ type: 'setMidiInputs', payload: inputs })
      const outputs = []
      for (const entry of midiAccess.outputs) {
        outputs.push(entry)
      }
      dispatch({ type: 'setMidiOutputs', payload: outputs })
    }
    const onMIDIFailure = (): void => {
      alert('MIDI Access failure')
    }

    navigator.requestMIDIAccess({ sysex: true })
      .then(onMIDISuccess, onMIDIFailure)
  }

  function start (): void {
    if (state.activeMidiInput === null || state.activeMidiOutput === null) {
      return
    }
    const activeMidiInput = state.activeMidiInput
    const activeMidiOutput = state.activeMidiOutput

    if (state.midiInputs !== null) {
      state.midiInputs.forEach(([_id, device]) => {
        // @ts-expect-error This was fine when written in JavaScript. I think it's an issue with the type definition file.
        device.onmidimessage = null
      })
    }

    activeMidiInput.onmidimessage = (event: WebMidi.MIDIMessageEvent) => { // FIXME: Consider using addEventListener
      const data = event.data

      const gmSystemOn = [0xF0, 0x7E, 0x7F, 0x09, 0x01, 0xF7]
      if (compareArray(gmSystemOn, data)) {
        initTracks()
      }

      const gsReset = [0xF0, 0x41, 0x10, 0x42, 0x12, 0x40, 0x00, 0x7F, 0x00, 0x41, 0xF7]
      if (compareArray(gsReset, data)) {
        initTracks()
      }

      const systemModeSet1 = [0xF0, 0x41, 0x10, 0x42, 0x12, 0x00, 0x00, 0x7F, 0x00, 0x01, 0xF7]
      if (compareArray(systemModeSet1, data)) {
        initTracks()
      }

      const systemModeSet2 = [0xF0, 0x41, 0x10, 0x42, 0x12, 0x00, 0x00, 0x7F, 0x01, 0x00, 0xF7]
      if (compareArray(systemModeSet2, data)) {
        initTracks()
      }

      const xgSystemOn = [0xF0, 0x43, 0x10, 0x4C, 0x00, 0x00, 0x7E, 0x00, 0xF7]
      if (compareArray(xgSystemOn, data)) {
        initTracks()
      }

      if (data.length === 2) {
        if (data[0] >= 0xC0 && data[0] <= 0xCF) {
          const channel = data[0] - 0xC0
          const number = data[1]

          // set program number
          const part = state.tracks[channel]
          part.setProgramChange(number)
          dispatch({
            type: 'setTrack',
            payload: {
              channel,
              track: part
            }
          })

          // send emulated data
          // const tracks = state.tracks
          const track = part
          const { programChangeNumber } = track
          const pcCh = 0xC0 + channel
          const bsCh = 0xB0 + channel
          const bslParam = state.force55Map ? 1 : track.bankSelectLSB
          const bsmParam = track.emulateBankSelectMSB
          activeMidiOutput.send([bsCh, 0x20, bslParam])
          activeMidiOutput.send([bsCh, 0x00, bsmParam])
          activeMidiOutput.send([pcCh, programChangeNumber])
          console.log(`%cEmulate: Channel: ${channel + 1}, Bank Select LSB: ${bslParam}, Bank Select MSB: ${bsmParam}, Program Change: ${programChangeNumber}`, 'color: blue;')
          return
        }
      } else if (data.length === 3) {
        if (data[0] >= 0xB0 && data[0] <= 0xBF) {
          const channel = data[0] - 0xB0
          const parameter = data[2]
          if (data[1] === 0x00) {
            // set bank select msb
            const part = state.tracks[channel]
            part.setBankSelectMSB(parameter)
            dispatch({
              type: 'setTrack',
              payload: {
                channel,
                track: part
              }
            })
          } else if (data[1] === 0x20) {
            // set bank select lsb
            const part = state.tracks[channel]
            part.setBankSelectLSB(parameter)
            dispatch({
              type: 'setTrack',
              payload: {
                channel,
                track: part
              }
            })
          }
        }
      } else if (data.length === 11) {
        if (data[0] === 0xF0 && data[10] === 0xf7) {
          const hasChecksumError = !checkSysExChecksum(data)
          const isRolandGS = data[1] === 0x41 && data[2] === 0x10 && data[3] === 0x42 && data[4] === 0x12
          if (isRolandGS) {
            if (!hasChecksumError) {
              const a = data[5]
              const b = data[6]
              const c = data[7]
              const d = data[8]
              if (a === 0x40 && c === 0x15) {
                let partNum
                if (b >= 0x11 && b <= 0x19) {
                  partNum = b - 0x10
                } else if (b >= 0x1A && b <= 0x1F) {
                  partNum = b - 0x10 + 1
                } else {
                  partNum = 10
                }
                const channel = partNum - 1
                const isDrum = d > 0
                console.log('set drum', channel, isDrum)
                // set isDrum
                const part = state.tracks[channel]
                part.setIsDrum(isDrum)
                dispatch({
                  type: 'setTrack',
                  payload: {
                    channel,
                    track: part
                  }
                })
              }
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              console.log(`SysEx: ${data}`)
            } else {
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              console.log(`%c[CHECKSUM ERROR] SysEx: ${data} 'color:red;`)
            }
          }
        }
      }

      activeMidiOutput.send(data)
    }
  }

  // commitやdispatchにあったものはいったんここへ
  function initTracks (): void {
    console.log('initTracks')
    state.tracks.forEach((track, _i) => {
      track.reset()
    })
  }

  return (
    <>
      <div className={'settings'}>
        <div className={'item'}>
          <div className={'label'}>Input:</div>
          <MidiInputDevicesSelector devices={state.midiInputs} activeDevice={state.activeMidiInput}
                                    onChangeActiveDevice={(device: WebMidi.MIDIInput) => {
                                      dispatch({ type: 'setActiveMidiInput', payload: device })
                                    }}/>
        </div>
        <div className={'item'}>
          <div className={'label'}>Output:</div>
          <MidiOutputDevicesSelector devices={state.midiOutputs} activeDevice={state.activeMidiOutput}
                                     onChangeActiveDevice={(device: WebMidi.MIDIOutput) => {
                                       dispatch({ type: 'setActiveMidiOutput', payload: device })
                                     }}/>
        </div>
        <div className={'item'}>
          <label htmlFor={'f55m'}>FORCE 55MAP:</label>
          <input type={'checkbox'} id={'f55m'} checked={state.force55Map}
                 onChange={(event) => {
                   console.log(event.target.checked)
                   dispatch({ type: 'toggleForce55Map', payload: event.target.checked })
                 }}/>
        </div>
      </div>
      <div className={'tracks'}>
        <Monitor tracks={state.tracks}/>
      </div>
    </>
  )
}

function compareArray (arrA: Uint8Array | number[], arrB: Uint8Array | number[]): boolean {
  if (arrA.length !== arrB.length) {
    return false
  }
  let result = true
  for (let i = 0; i < arrA.length; i++) {
    if (arrA[i] !== arrB[i]) {
      result = false
      break
    }
  }
  return result
}

function calcChecksum (d: Uint8Array | number[]): number {
  const a = d[5]
  const b = d[6]
  const c = d[7]
  const data = d[8]
  return 0x80 - (a + b + c + data) % 0x80
}

function checkSysExChecksum (d: Uint8Array | number[]): boolean {
  const checksum = d[9]
  return checksum === calcChecksum(d)
}

interface MidiInputDevicesSelectorProps {
  devices: Array<[string, WebMidi.MIDIInput]> | null
  activeDevice: WebMidi.MIDIInput | null
  onChangeActiveDevice: (device: WebMidi.MIDIInput) => void
}

function MidiInputDevicesSelector ({ devices, activeDevice, onChangeActiveDevice }: MidiInputDevicesSelectorProps): React.ReactNode {
  return MIDIDevicesSelector({ devices, activeDevice, onChangeActiveDevice: (device) => { onChangeActiveDevice(device as WebMidi.MIDIInput) } })
}

interface MidiOutputDevicesSelectorProps {
  devices: Array<[string, WebMidi.MIDIOutput]> | null
  activeDevice: WebMidi.MIDIOutput | null
  onChangeActiveDevice: (device: WebMidi.MIDIOutput) => void
}

function MidiOutputDevicesSelector ({ devices, activeDevice, onChangeActiveDevice }: MidiOutputDevicesSelectorProps): React.ReactNode {
  return MIDIDevicesSelector({ devices, activeDevice, onChangeActiveDevice: (device) => { onChangeActiveDevice(device as WebMidi.MIDIOutput) } })
}

interface MidiDevicesSelectorProps {
  devices: Array<[string, WebMidi.MIDIOutput]> | Array<[string, WebMidi.MIDIInput]> | null
  activeDevice: WebMidi.MIDIOutput | WebMidi.MIDIInput | null
  onChangeActiveDevice: (device: WebMidi.MIDIOutput | WebMidi.MIDIInput | null) => void
}

function MIDIDevicesSelector ({ devices, activeDevice, onChangeActiveDevice }: MidiDevicesSelectorProps): React.ReactNode {
  return (
    <>
      <select value={activeDevice?.id ?? ''} onChange={handleChangeSelect}>
        <option value=''>------</option>
        {devices?.map(([id, device]) => (
          <option key={id} value={id}>{device.name}</option>
        ))}
      </select>
    </>
  )
  function handleChangeSelect (event: React.ChangeEvent<HTMLSelectElement>): void {
    const selectedId = event.target.value
    const device = devices?.find(([id, _device]) => id === selectedId)?.[1]
    onChangeActiveDevice(device ?? null)
  }
}

export default App
