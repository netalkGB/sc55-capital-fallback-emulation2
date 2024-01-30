import instruments from './instruments'

export default class Track {
  // TODO: getter and setter configures
  public bankSelectMSB: number
  public bankSelectLSB: number
  public emulateBankSelectMSB: number
  public programChangeNumber: number
  public isDrum: boolean
  public readonly channel: number

  constructor (bmsb: number, blsb: number, program: number, channel: number) {
    this.bankSelectMSB = bmsb
    this.bankSelectLSB = blsb
    this.emulateBankSelectMSB = bmsb
    this.programChangeNumber = program
    this.isDrum = channel === 10
    this.channel = channel
  }

  reset (): void {
    this.bankSelectMSB = 0
    this.bankSelectLSB = 0
    this.programChangeNumber = 0
    this.emulateBankSelectMSB = 0
    this.isDrum = this.channel === 10
  }

  setBankSelectMSB (param: number): void {
    this.bankSelectMSB = param
    this.emulateBankSelectMSB = this.generateEmulatedBankSelectMSB()
  }

  generateEmulatedBankSelectMSB (): number {
    if (this.isDrum) {
      return 0
    }
    const name = this.getRealName()
    return (name === undefined || name === null) ? 0 : this.bankSelectMSB
  }

  getEmulatedName (): string {
    if (this.isDrum) {
      // @ts-expect-error Temporarily skipping type checking here
      return instruments[this.programChangeNumber + 1].drum
    }
    // @ts-expect-error Temporarily skipping type checking here
    return instruments[this.programChangeNumber + 1][this.generateEmulatedBankSelectMSB()]
  }

  getRealName (): string {
    const bmsb = this.bankSelectMSB
    const program = this.programChangeNumber
    if (this.isDrum) {
      // @ts-expect-error Temporarily skipping type checking here
      return instruments[program + 1].drum
    }
    // @ts-expect-error Temporarily skipping type checking here
    return instruments[program + 1][bmsb]
  }

  setBankSelectLSB (param: number): void {
    this.bankSelectLSB = param
    this.emulateBankSelectMSB = this.generateEmulatedBankSelectMSB()
  }

  setProgramChange (param: number): void {
    this.programChangeNumber = param
    this.emulateBankSelectMSB = this.generateEmulatedBankSelectMSB()
  }

  setIsDrum (param: boolean): void {
    this.isDrum = param
  }

  toString (): string {
    return `BankSelect MSB: ${this.bankSelectMSB}, BankSelect MSB[EMULATE]: ${this.emulateBankSelectMSB}, BankSelect LSB: ${this.bankSelectLSB}, ProgramNo: ${this.programChangeNumber}, isDrum?: ${this.isDrum}, RealName: ${this.getRealName()}, EmulatedName: ${this.getEmulatedName()}`
  }

  static makePart ({ bankMSB, bankLSB, programNumber, channel }: { bankMSB: number, bankLSB: number, programNumber: number, channel: number }): Track {
    return new Track(bankMSB, bankLSB, programNumber, channel)
  }
}
