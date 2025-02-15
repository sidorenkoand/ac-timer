export function decimalPlusMinutes (decimal: number, newMinutes: number) {
  const converter = new TimeConverter()
  const minutes = converter.setDecimal(decimal).getMinutes()
  return converter.setMinutes(minutes + newMinutes)
}

export function decimalToTime (decimal: number) {
  const converter = new TimeConverter()
  return converter.setDecimal(decimal).getTime()
}

export function timeToDecimal (time: string) {
  const converter = new TimeConverter()
  return converter.setTime(time).getDecimal()
}

export class TimeConverter {
  private minutes: number

  constructor (minutes: number = 0) {
    this.minutes = minutes
  }

  public setMinutes (minutes: number) {
    this.minutes = minutes
    return this
  }

  public getMinutes () {
    return this.minutes
  }

  /**
   * Set time in 1:25 (1h 25m) format
   */
  public setTime (time: string) {
    const timeArr = time.split(':')

    if (timeArr[1] && Number(timeArr[1]) > 0) {
      this.minutes = Number(timeArr[1])
    } else {
      this.minutes = 0
    }

    if (timeArr[0] && Number(timeArr[0]) > 0) {
      this.minutes = this.minutes + Number(timeArr[0]) * 60
    }

    return this
  }

  /**
   * Return time in string format
   */
  public getTime () {
    const hours = Math.trunc(this.minutes / 60)
    const minutes = this.minutes - hours * 60

    let time = hours + ':'
    time = time + (minutes > 9 ? minutes.toString() : '0' + minutes)

    return time
  }

  public getDecimal () {
    return this.minutes / 60
  }

  /**
   * Set time in decimal format
   */
  public setDecimal (decimal: number) {
    const hours = Math.trunc(decimal)
    const minutesDecimal = decimal - hours
    const minutes = Math.round(60 * minutesDecimal)

    this.minutes = 60 * hours + minutes
    return this
  }
}
