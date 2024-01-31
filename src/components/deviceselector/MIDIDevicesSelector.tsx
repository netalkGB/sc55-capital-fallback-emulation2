import React from 'react'

interface MidiDevicesSelectorProps {
  devices: Array<[string, WebMidi.MIDIOutput]> | Array<[string, WebMidi.MIDIInput]> | null
  activeDevice: WebMidi.MIDIOutput | WebMidi.MIDIInput | null
  onChangeActiveDevice: (device: WebMidi.MIDIOutput | WebMidi.MIDIInput | null) => void
}

export default function MIDIDevicesSelector ({ devices, activeDevice, onChangeActiveDevice }: MidiDevicesSelectorProps): React.ReactNode {
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
