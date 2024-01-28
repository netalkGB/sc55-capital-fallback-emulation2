import React, { useEffect, useReducer } from 'react'
import './App.css'

interface State {
  midiInputs: Array<[string, WebMidi.MIDIInput]> | null
  midiOutputs: Array<[string, WebMidi.MIDIOutput]> | null
  activeMidiInput: WebMidi.MIDIInput | null
  activeMidiOutput: WebMidi.MIDIOutput | null
  force55Map: boolean
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
}

const initialState = {
  midiInputs: null,
  midiOutputs: null,
  activeMidiInput: null,
  activeMidiOutput: null,
  force55Map: false
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

  return (
    <>
      <label>Input:&nbsp;</label>
      <MidiInputDevicesSelector devices={state.midiInputs} activeDevice={state.activeMidiInput}
                                onChangeActiveDevice={(device: WebMidi.MIDIInput) => {
                                  dispatch({ type: 'setActiveMidiInput', payload: device })
                                }}/>

      <label>Output:&nbsp;</label>
      <MidiOutputDevicesSelector devices={state.midiOutputs} activeDevice={state.activeMidiOutput}
                                onChangeActiveDevice={(device: WebMidi.MIDIOutput) => {
                                  dispatch({ type: 'setActiveMidiOutput', payload: device })
                                }}/>
    </>
  )
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
        <option value=''>--- Select a device ---</option>
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
