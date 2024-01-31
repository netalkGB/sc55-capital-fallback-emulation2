import MidiInputDevicesSelector from '../deviceselector/MidiInputDevicesSelector.tsx'
import MidiOutputDevicesSelector from '../deviceselector/MidiOutputDevicesSelector.tsx'
import React from 'react'
import { useStateValue } from '../../state/stateContext.tsx'
import { loadConfig, saveConfig } from '../../utils/ConfigLoader.ts'

export function Settings (): React.ReactNode {
  const [state, dispatch] = useStateValue()

  function saveInputConfig (activeInput: string | undefined): void {
    const config = loadConfig()
    config.inputDeviceName = activeInput
    saveConfig(config)
  }

  function saveOutputConfig (activeOutput: string | undefined): void {
    const config = loadConfig()
    config.outputDeviceName = activeOutput
    saveConfig(config)
  }

  function saveForce55Config (force55: boolean): void {
    const config = loadConfig()
    config.force55Map = force55
    saveConfig(config)
  }

  return (
    <>
      <div className={'item'}>
        <div className={'label'}>Input:</div>
        <MidiInputDevicesSelector devices={state.midiInputs} activeDevice={state.activeMidiInput}
                                  onChangeActiveDevice={(device: WebMidi.MIDIInput) => {
                                    dispatch({ type: 'setActiveMidiInput', payload: device })
                                    saveInputConfig(device?.name)
                                  }}/>
      </div>
      <div className={'item'}>
        <div className={'label'}>Output:</div>
        <MidiOutputDevicesSelector devices={state.midiOutputs} activeDevice={state.activeMidiOutput}
                                   onChangeActiveDevice={(device: WebMidi.MIDIOutput) => {
                                     dispatch({ type: 'setActiveMidiOutput', payload: device })
                                     saveOutputConfig(device?.name)
                                   }}/>
      </div>
      <div className={'item'}>
        <label htmlFor={'f55m'}>FORCE 55MAP:</label>
        <input type={'checkbox'} id={'f55m'} checked={state.force55Map}
               onChange={(event) => {
                 dispatch({ type: 'toggleForce55Map', payload: event.target.checked })
                 saveForce55Config(event.target.checked)
               }}/>
      </div>
    </>
  )
}
