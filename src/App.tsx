import React, { useEffect, useReducer } from 'react'
import './App.css'

// const instruments = {"1":{"0":"Piano 1","127":"Acou Piano1","drum":"STANDARD"},"2":{"0":"Piano 2","127":"Acou Piano2"},"3":{"0":"Piano 3","127":"Acou Piano3"},"4":{"0":"Honky-tonk","127":"Elec Piano1"},"5":{"0":"E.Piano 1","8":"Detuned EP1","127":"Elec Piano2"},"6":{"0":"E.Piano 2","8":"Detuned EP2","127":"Elec Piano3"},"7":{"0":"Harpsichord","8":"Coupled Hps","127":"Elec Piano4"},"8":{"0":"Clav.","127":"Honkytonk"},"9":{"0":"Celesta","127":"Elec Org 1","drum":"ROOM"},"10":{"0":"Glockenspl","127":"Elec Org 2"},"11":{"0":"Music Box","127":"Elec Org 3"},"12":{"0":"Vibraphone","127":"Elec Org 4"},"13":{"0":"Marimba","127":"Pipe Org 1"},"14":{"0":"Xylophone","127":"Pipe Org 2"},"15":{"0":"Tubularbell","8":"Church Bell","127":"Pipe Org 3"},"16":{"0":"Santur","127":"Accordion"},"17":{"0":"Organ 1","8":"Detuned Or1","127":"Harpsi 1","drum":"POWER"},"18":{"0":"Organ 2","8":"Detuned Or2","127":"Harpsi 2"},"19":{"0":"Organ 3","127":"Harpsi 3"},"20":{"0":"Church Org1","8":"Church Org2","127":"Clavi 1"},"21":{"0":"Reed Organ","127":"Clavi 2"},"22":{"0":"Accordion F","8":"Accordion I","127":"Clavi 3"},"23":{"0":"Harmonica","127":"Celesta 1"},"24":{"0":"Bandoneon","127":"Celesta 2"},"25":{"0":"Nylon Gt.","8":"Ukulele","127":"Syn Brass 1","drum":"ELECTRONIC"},"26":{"0":"Steel Gt.","8":"12-str.Gt","16":"Mandolin","127":"Syn Brass 2","drum":"TR-808"},"27":{"0":"Jazz Gt.","8":"Hawaiian Gt","127":"Syn Brass 3"},"28":{"0":"Clean Gt.","8":"Chorus Gt.","127":"Syn Brass 4"},"29":{"0":"Muted Gt.","8":"Funk Gt.","127":"Syn Bass 1"},"30":{"0":"OverdriveGt","127":"Syn Bass 2"},"31":{"0":"Dist.Gt.","8":"Feedback Gt","127":"Syn Bass 3"},"32":{"0":"Gt.Harmonix","8":"Gt.Feedback","127":"Syn Bass 4"},"33":{"0":"Acoustic Bs","127":"Fantasy","drum":"JAZZ"},"34":{"0":"Fingered Bs","127":"Harmo Pan"},"35":{"0":"Picked Bass","127":"Chorale"},"36":{"0":"Fretless Bs","127":"Glasses"},"37":{"0":"Slap Bass 1","127":"Soundtrack"},"38":{"0":"Slap Bass 2","127":"Atmosphere"},"39":{"0":"Syn.Bass 1","8":"Syn.Bass 3","127":"Warm Bell"},"40":{"0":"Syn.Bass 2","8":"Syn.Bass 4","127":"Funny Vox"},"41":{"0":"Violin","127":"Echo Bell","drum":"BRUSH"},"42":{"0":"Viola","127":"Ice Rain"},"43":{"0":"Cello","127":"Oboe 2001"},"44":{"0":"Contrabass","127":"Echo Pan"},"45":{"0":"Tremolo Str","127":"Doctor Solo"},"46":{"0":"Pizzicato","127":"School Daze"},"47":{"0":"Harp","127":"Bellsinger"},"48":{"0":"Timpani","127":"Square Wave"},"49":{"0":"Strings","8":"Orchestra","127":"Str Sect 1","drum":"ORCHESTRA"},"50":{"0":"SlowStrings","127":"Str Sect 2"},"51":{"0":"SynStrings1","8":"SynStrings3","127":"Str Sect 3"},"52":{"0":"SynStrings2","127":"Pizzicato"},"53":{"0":"Choir Aahs","127":"Violin 1"},"54":{"0":"Voice Oohs","127":"Violin 2"},"55":{"0":"SynVox","127":"Cello 1"},"56":{"0":"Orchest.Hit","127":"Cello 2"},"57":{"0":"Trumpet","127":"Contrabass","drum":"SFX"},"58":{"0":"Trombone","127":"Harp 1"},"59":{"0":"Tuba","127":"Harp 2"},"60":{"0":"MuteTrumpet","127":"Guitar 1"},"61":{"0":"French Horn","127":"Guitar 2"},"62":{"0":"Brass 1","8":"Brass 2","127":"Elec Gtr 1"},"63":{"0":"Syn.Brass 1","8":"Syn.Brass 3","127":"Elec Gtr 2"},"64":{"0":"Syn.Brass 2","8":"Syn.Brass 4","127":"Sitar"},"65":{"0":"Soprano Sax","127":"Acou Bass 1"},"66":{"0":"Alto Sax","127":"Acou Bass 2"},"67":{"0":"Tenor Sax","127":"Elec Bass 1"},"68":{"0":"BaritoneSax","127":"Elec Bass 2"},"69":{"0":"Oboe","127":"Slap Bass 1"},"70":{"0":"EnglishHorn","127":"Slap Bass 2"},"71":{"0":"Bassoon","127":"Fretless 1"},"72":{"0":"Clarinet","127":"Fretless 2"},"73":{"0":"Piccolo","127":"Flute 1"},"74":{"0":"Flute","127":"Flute 2"},"75":{"0":"Recorder","127":"Piccolo 1"},"76":{"0":"Pan Flute","127":"Piccolo 2"},"77":{"0":"Bottle Blow","127":"Recorder"},"78":{"0":"Shakuhachi","127":"Pan Pipes"},"79":{"0":"Whistle","127":"Sax 1"},"80":{"0":"Ocarina","127":"Sax 2"},"81":{"0":"Square Wave","8":"Sine Wave","127":"Sax 3"},"82":{"0":"Saw Wave","127":"Sax 4"},"83":{"0":"SynCalliope","127":"Clarinet 1"},"84":{"0":"ChifferLead","127":"Clarinet 2"},"85":{"0":"Charang","127":"Oboe"},"86":{"0":"Solo Vox","127":"Engl Horn"},"87":{"0":"5th Saw","127":"Bassoon"},"88":{"0":"Bass & Lead","127":"Harmonica"},"89":{"0":"Fantasia","127":"Trumpet 1"},"90":{"0":"Warm Pad","127":"Trumpet 2"},"91":{"0":"Polysynth","127":"Trombone 1"},"92":{"0":"Space Voice","127":"Trombone 2"},"93":{"0":"Bowed Glass","127":"Fr Horn 1"},"94":{"0":"Metal Pad","127":"Fr Horn 2"},"95":{"0":"Halo Pad","127":"Tuba"},"96":{"0":"Sweep Pad","127":"Brs Sect 1"},"97":{"0":"Ice Rain","127":"Brs Sect 2"},"98":{"0":"Soundtrack","127":"Vibe 1"},"99":{"0":"Crystal","127":"Vibe 2"},"100":{"0":"Atmosphere","127":"Syn Mallet"},"101":{"0":"Brightness","127":"Windbell"},"102":{"0":"Goblin","127":"Glock"},"103":{"0":"Echo Drops","127":"Tube Bell"},"104":{"0":"Star Theme","127":"Xylophone"},"105":{"0":"Sitar","127":"Marimba"},"106":{"0":"Banjo","127":"Koto"},"107":{"0":"Shamisen","127":"Sho"},"108":{"0":"Koto","8":"Taisho Koto","127":"Shakuhachi"},"109":{"0":"Kalimba","127":"Whistle 1"},"110":{"0":"Bagpipe","127":"Whistle 2"},"111":{"0":"Fiddle","127":"Bottleblow"},"112":{"0":"Shanai","127":"Breathpipe"},"113":{"0":"Tinkle Bell","127":"Timpani"},"114":{"0":"Agogo","127":"Melodic Tom"},"115":{"0":"Steel Drums","127":"Deep Snare"},"116":{"0":"Woodblock","8":"Castanets","127":"Elec Perc 1"},"117":{"0":"Taiko","8":"Concert BD","127":"Elec Perc 2"},"118":{"0":"Melo. Tom 1","8":"Melo. Tom 2","127":"Taiko"},"119":{"0":"Synth Drum","8":"808 Tom","127":"Taiko Rim"},"120":{"0":"Reverse Cym","127":"Cymbal"},"121":{"0":"Gt.FretNoiz","1":"Gt.CutNoise","2":"String Slap","127":"Castanets"},"122":{"0":"BreathNoise","1":"Fl.KeyClick","127":"Triangle"},"123":{"0":"Seashore","1":"Rain","2":"Thunder","3":"Wind","4":"Stream","5":"Bubble","127":"Orche Hit"},"124":{"0":"Bird","1":"Dog","2":"HorseGallop","127":"Telephone"},"125":{"0":"Telephone 1","1":"Telephone 2","2":"Creaking","3":"Door","4":"Scratch","5":"Wind Chimes","127":"Bird Tweet"},"126":{"0":"Helicopter","1":"Car-Engine","2":"Car-Stop","3":"Car-Pass","4":"Car-Crash","5":"Siren","6":"Train","7":"Jetplane","8":"Starship","9":"Burst Noise","127":"OneNote Jam"},"127":{"0":"Applause","1":"Laughing","2":"Screaming","3":"Punch","4":"Heart Beat","5":"Footsteps","127":"Water Bell"},"128":{"0":"Gun Shot","1":"Machine Gun","2":"Lasergun","3":"Explosion","127":"Jungle Tune","drum":"CM-64/32L"}} // eslint-disable-line

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

  useEffect(() => {
    start()
  }, [state.activeMidiInput, state.activeMidiOutput])

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
          // TODO: (commit('setProgramChange', { channel, number }))
          // TODO: dispatch('sendEmulatedData', channel)
          return
        }
      } else if (data.length === 3) {
        if (data[0] >= 0xB0 && data[0] <= 0xBF) {
          const channel = data[0] - 0xB0
          const parameter = data[2]
          if (data[1] === 0x00) {
            // TODO: commit('setBankSelectMSB', { channel, parameter })
          } else if (data[1] === 0x20) {
            // TODO: commit('setBankSelectLSB', { channel, parameter })
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
                // TODO: commit('setIsDrum', { channel, isDrum })
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
  }

  // function sendEmulatedData ({ getters }, channel) {
  //   const midiOutput = getters['getCurrentOutputDevice']
  //   const tracks = getters['getTracks']
  //   const track = tracks[channel]
  //   const { programChangeNumber } = track
  //   const PCCh = 0xC0 + channel
  //   const BSCh = 0xB0 + channel
  //   const BSLParam = getters['getForce55MAP'] ? 1 : 0
  //   const BSMParam = track.emulateBankSelectMSB
  //   midiOutput.send([BSCh, 0x20, BSLParam])
  //   midiOutput.send([BSCh, 0x00, BSMParam])
  //   midiOutput.send([PCCh, programChangeNumber])
  //   console.log(`%cEmulate: Channel: ${channel + 1}, Bank Select LSB: ${BSLParam}, Bank Select MSB: ${BSMParam}, Program Change: ${programChangeNumber}`, 'color: blue;')
  // }

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
