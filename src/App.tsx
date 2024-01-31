import React, { useEffect, useReducer } from 'react'
import './App.css'
import Monitor from './components/monitor/Monitor.tsx'
import MidiInputDevicesSelector from './components/deviceselector/MidiInputDevicesSelector.tsx'
import MidiOutputDevicesSelector from './components/deviceselector/MidiOutputDevicesSelector.tsx'
import { compareArray } from './utils/ArrayUtils.ts'
import { checkSysExChecksum } from './utils/GsUtils.ts'
import { initialState, reducer } from './state/reducer.ts'

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
      const bsCh = 0xb0 + i
      const pcCh = 0xc0 + i
      const bankSelectLSB = state.force55Map ? 1 : state.tracks[i].bankSelectLSB
      state.activeMidiOutput.send([bsCh, 0x20, bankSelectLSB])
      state.activeMidiOutput.send([pcCh, programChangeNumber])
    }
    start()
  }, [state.force55Map])

  function onLoad (): void {
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

    const initTracks = (): void => {
      state.tracks.forEach((track, _i) => {
        track.reset()
      })
    }
    activeMidiInput.onmidimessage = (event: WebMidi.MIDIMessageEvent) => { // FIXME: Consider using addEventListener
      const data = event.data

      const gmSystemOn = [0xf0, 0x7e, 0x7f, 0x09, 0x01, 0xf7]
      if (compareArray(gmSystemOn, data)) {
        initTracks()
      }

      const gsReset = [0xf0, 0x41, 0x10, 0x42, 0x12, 0x40, 0x00, 0x7f, 0x00, 0x41, 0xf7]
      if (compareArray(gsReset, data)) {
        initTracks()
      }

      const systemModeSet1 = [0xf0, 0x41, 0x10, 0x42, 0x12, 0x00, 0x00, 0x7f, 0x00, 0x01, 0xf7]
      if (compareArray(systemModeSet1, data)) {
        initTracks()
      }

      const systemModeSet2 = [0xf0, 0x41, 0x10, 0x42, 0x12, 0x00, 0x00, 0x7f, 0x01, 0x00, 0xf7]
      if (compareArray(systemModeSet2, data)) {
        initTracks()
      }

      const xgSystemOn = [0xf0, 0x43, 0x10, 0x4c, 0x00, 0x00, 0x7e, 0x00, 0xf7]
      if (compareArray(xgSystemOn, data)) {
        initTracks()
      }

      if (data.length === 2) {
        if (data[0] >= 0xc0 && data[0] <= 0xcf) {
          const channel = data[0] - 0xc0
          const number = data[1]

          // set program number
          const track = state.tracks[channel]
          track.setProgramChange(number)
          dispatch({
            type: 'setTrack',
            payload: {
              channel,
              track
            }
          })

          // send emulated data
          // const tracks = state.tracks
          const { programChangeNumber } = track
          const pcCh = 0xc0 + channel
          const bsCh = 0xb0 + channel
          const bslParam = state.force55Map ? 1 : track.bankSelectLSB
          const bsmParam = track.emulateBankSelectMSB
          activeMidiOutput.send([bsCh, 0x20, bslParam])
          activeMidiOutput.send([bsCh, 0x00, bsmParam])
          activeMidiOutput.send([pcCh, programChangeNumber])
          console.log(`%cEmulate: Channel: ${channel + 1}, Bank Select LSB: ${bslParam}, Bank Select MSB: ${bsmParam}, Program Change: ${programChangeNumber}`, 'color: blue;')
          return
        }
      } else if (data.length === 3) {
        if (data[0] >= 0xb0 && data[0] <= 0xbf) {
          const channel = data[0] - 0xb0
          const parameter = data[2]

          const track = state.tracks[channel]
          if (data[1] === 0x00) {
            // set bank select msb
            track.setBankSelectMSB(parameter)
            dispatch({
              type: 'setTrack',
              payload: {
                channel,
                track
              }
            })
          } else if (data[1] === 0x20) {
            // set bank select lsb
            track.setBankSelectLSB(parameter)
            dispatch({
              type: 'setTrack',
              payload: {
                channel,
                track
              }
            })
          }
        }
      } else if (data.length === 11) {
        if (data[0] === 0xf0 && data[10] === 0xf7) {
          const isGsFormat = data[1] === 0x41 && data[2] === 0x10 && data[3] === 0x42 && data[4] === 0x12
          if (isGsFormat) {
            const hasChecksumError = !checkSysExChecksum(data)
            if (!hasChecksumError) {
              const a = data[5]
              const b = data[6]
              const c = data[7]
              const d = data[8]
              if (a === 0x40 && c === 0x15) {
                let dispCh
                if (b >= 0x11 && b <= 0x19) {
                  dispCh = b - 0x10
                } else if (b >= 0x1a && b <= 0x1f) {
                  dispCh = b - 0x10 + 1
                } else {
                  dispCh = 10
                }
                const channel = dispCh - 1
                const isDrum = d > 0
                // set isDrum
                const track = state.tracks[channel]
                track.setIsDrum(isDrum)
                dispatch({
                  type: 'setTrack',
                  payload: {
                    channel,
                    track
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

export default App
