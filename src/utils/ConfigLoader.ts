export interface Config {
  inputDeviceName: string | undefined
  outputDeviceName: string | undefined
  force55Map: boolean
}

const CONFIG_ITEM_NAME = 'config'

export function saveConfig (config: Config): void {
  localStorage.setItem(CONFIG_ITEM_NAME, JSON.stringify(config))
}

export function loadConfig (): Config {
  const config = localStorage.getItem(CONFIG_ITEM_NAME)
  if (config === null) {
    return {
      inputDeviceName: undefined,
      outputDeviceName: undefined,
      force55Map: false
    }
  }
  return JSON.parse(config)
}

export function clearConfig (): void {
  localStorage.removeItem(CONFIG_ITEM_NAME)
}
