import instruments from './instruments'

export default class Track {
  private _bankSelectMSB: number

  get bankSelectMSB (): number {
    return this._bankSelectMSB
  }

  set bankSelectMSB (param: number) {
    this.setBankSelectMSB(param)
  }

  private _bankSelectLSB: number

  get bankSelectLSB (): number {
    return this._bankSelectLSB
  }

  set bankSelectLSB (param: number) {
    this.setBankSelectLSB(param)
  }

  private _emulateBankSelectMSB: number

  get emulateBankSelectMSB (): number {
    return this._emulateBankSelectMSB
  }

  private _programChangeNumber: number

  get programChangeNumber (): number {
    return this._programChangeNumber
  }

  set programChangeNumber (param: number) {
    this.setProgramChange(param)
  }

  private _isDrum: boolean

  get isDrum (): boolean {
    return this._isDrum
  }

  set isDrum (param: boolean) {
    this.setIsDrum(param)
  }

  private readonly _channel: number

  get channel (): number {
    return this._channel
  }

  constructor (bmsb: number, blsb: number, program: number, channel: number) {
    this._bankSelectMSB = bmsb
    this._bankSelectLSB = blsb
    this._emulateBankSelectMSB = bmsb
    this._programChangeNumber = program
    this._isDrum = channel === 10
    this._channel = channel
  }

  public reset (): void {
    this._bankSelectMSB = 0
    this._bankSelectLSB = 0
    this._programChangeNumber = 0
    this._emulateBankSelectMSB = 0
    this._isDrum = this._channel === 10
  }

  private setBankSelectMSB (param: number): void {
    this._bankSelectMSB = param
    this._emulateBankSelectMSB = this.generateEmulatedBankSelectMSB()
  }

  protected generateEmulatedBankSelectMSB (): number {
    if (this._isDrum) {
      return 0
    }
    const name = this.getRealName()
    return (name === undefined || name === null) ? 0 : this._bankSelectMSB
  }

  public getEmulatedName (): string {
    if (this._isDrum) {
      // @ts-expect-error Temporarily skipping type checking here
      return instruments[this._programChangeNumber + 1].drum
    }
    // @ts-expect-error Temporarily skipping type checking here
    return instruments[this._programChangeNumber + 1][this.generateEmulatedBankSelectMSB()]
  }

  private getRealName (): string {
    const bmsb = this._bankSelectMSB
    const program = this._programChangeNumber
    if (this._isDrum) {
      // @ts-expect-error Temporarily skipping type checking here
      return instruments[program + 1].drum
    }
    // @ts-expect-error Temporarily skipping type checking here
    return instruments[program + 1][bmsb]
  }

  private setBankSelectLSB (param: number): void {
    this._bankSelectLSB = param
    this._emulateBankSelectMSB = this.generateEmulatedBankSelectMSB()
  }

  private setProgramChange (param: number): void {
    this._programChangeNumber = param
    this._emulateBankSelectMSB = this.generateEmulatedBankSelectMSB()
  }

  public setIsDrum (param: boolean): void {
    this._isDrum = param
  }

  public toString (): string {
    return `BankSelect MSB: ${this._bankSelectMSB}, BankSelect MSB[EMULATE]: ${this._emulateBankSelectMSB}, BankSelect LSB: ${this._bankSelectLSB}, ProgramNo: ${this._programChangeNumber}, isDrum?: ${this._isDrum}, RealName: ${this.getRealName()}, EmulatedName: ${this.getEmulatedName()}`
  }

  public static makePart ({ bankMSB, bankLSB, programNumber, channel }: { bankMSB: number, bankLSB: number, programNumber: number, channel: number }): Track {
    return new Track(bankMSB, bankLSB, programNumber, channel)
  }
}
