import type React from 'react'
import MIDIDevicesSelector from './MIDIDevicesSelector.tsx'

interface MidiOutputDevicesSelectorProps {
  devices: Array<[string, WebMidi.MIDIOutput]> | null
  activeDevice: WebMidi.MIDIOutput | null
  onChangeActiveDevice: (device: WebMidi.MIDIOutput) => void
}

export default function MidiOutputDevicesSelector ({ devices, activeDevice, onChangeActiveDevice }: MidiOutputDevicesSelectorProps): React.ReactNode {
  return MIDIDevicesSelector({ devices, activeDevice, onChangeActiveDevice: (device) => { onChangeActiveDevice(device as WebMidi.MIDIOutput) } })
}
