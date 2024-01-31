import MidiInputDevicesSelector from '../deviceselector/MidiInputDevicesSelector.tsx'
import MidiOutputDevicesSelector from '../deviceselector/MidiOutputDevicesSelector.tsx'
import React from 'react'
import { useStateValue } from '../../state/stateContext.tsx'

export function Settings (): React.ReactNode {
  const [state, dispatch] = useStateValue()
  return (
    <>
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
    </>
  )
}
