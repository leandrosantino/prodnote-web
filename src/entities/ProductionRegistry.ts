import { ProductionLosses } from "./ProductionLosses"
import { Process } from "./Process"
import { HourIntervals } from "./HoursIntervals"

const MINUTES_IN_HOUR = 60

type CalculateVariables = {
  pieces_quantity: number
  target: number
  interval_in_minutes: number
}

export class ProductionRegistry {

  id!: number
  process_id!: string
  project!: string
  created_at!: Date
  turn!: string
  pieces_quantity!: number
  interval_in_minutes!: number
  time_tag!: HourIntervals
  production_losses!: ProductionLosses[]
  process!: Process

  constructor(data: Omit<Partial<ProductionRegistry>, 'oee' | 'lostTime'>) {
    Object.assign(this, data);
  }

  getCreateData(): Omit<ProductionRegistry, 'id' | 'created_at' | 'oee' | 'lostTime' | 'process' | 'production_losses'> {
    return {
      process_id: this.process_id,
      project: this.project,
      turn: this.turn,
      pieces_quantity: this.pieces_quantity,
      interval_in_minutes: this.interval_in_minutes,
      time_tag: this.time_tag,
    }
  }

  get oee() {
    return ProductionRegistry.calculateOee({
      pieces_quantity: this.pieces_quantity,
      interval_in_minutes: this.interval_in_minutes,
      target: this.process.target
    })
  }

  get lostTime() {
    return ProductionRegistry.calculateLostTime({
      pieces_quantity: this.pieces_quantity,
      interval_in_minutes: this.interval_in_minutes,
      target: this.process.target
    })
  }

  static calculateOee({ pieces_quantity, interval_in_minutes, target }: CalculateVariables) {
    return (MINUTES_IN_HOUR * pieces_quantity) / (target * interval_in_minutes)
  }

  static calculateLostTime({ pieces_quantity, interval_in_minutes, target }: CalculateVariables) {
    return interval_in_minutes - (MINUTES_IN_HOUR * pieces_quantity) / target
  }

}




