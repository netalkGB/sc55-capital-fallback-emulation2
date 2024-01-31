import type React from 'react'
import MIDIDevicesSelector from './MIDIDevicesSelector.tsx'

interface MidiInputDevicesSelectorProps {
  devices: Array<[string, WebMidi.MIDIInput]> | null
  activeDevice: WebMidi.MIDIInput | null
  onChangeActiveDevice: (device: WebMidi.MIDIInput) => void
}

export default function MidiInputDevicesSelector ({ devices, activeDevice, onChangeActiveDevice }: MidiInputDevicesSelectorProps): React.ReactNode {
  return MIDIDevicesSelector({ devices, activeDevice, onChangeActiveDevice: (device) => { onChangeActiveDevice(device as WebMidi.MIDIInput) } })
}
