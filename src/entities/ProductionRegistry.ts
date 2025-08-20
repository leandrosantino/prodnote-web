import { HourIntervals } from "./HoursIntervals"
import { OeeForm } from "./OeeForm"
import { Process } from "./Process"
import { ClassificationTypes, classificationTypesMap, ProductionLosses } from "./ProductionLosses"

const MINUTES_IN_HOUR = 60

export class ProductionRegistry {

  id!: number
  created_at!: Date
  process!: Process

  process_id!: number
  project!: string
  turn!: string
  pieces_quantity!: number
  interval_in_minutes!: number
  time_tag!: HourIntervals
  production_losses!: ProductionLosses[]

  constructor(data: Omit<
    ProductionRegistry,
    'totalReasonsTime' | 'oee' | 'lostTime' | 'createData' | 'id' |
    'created_at' | 'process' | 'totalScrap'
  >) {
    Object.assign(this, data);
  }

  get createData() {
    return {
      registryData: {
        process_id: this.process_id,
        project: this.project,
        turn: this.turn,
        pieces_quantity: this.pieces_quantity,
        interval_in_minutes: this.interval_in_minutes,
        time_tag: this.time_tag,
      },
      production_losses: this.production_losses
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

  get totalReasonsTime() {
    return this.production_losses
      .map(item => item.time)
      .reduce((acc, time) => {
        acc += time;
        return acc;
      })
  }

  get totalScrap() {
    const lost_time = this.production_losses
      .filter(item => item.classification === 'Scrap + Quality Issues')
      .map(item => item.time)
      .reduce((acc, time) => {
        acc += time;
        return acc;
      })
    return ProductionRegistry.convertLostTimeToPieces({ lost_time, target: this.process.target })
  }

  static calculateOee({ pieces_quantity, interval_in_minutes, target }: CalculateVariables) {
    return (MINUTES_IN_HOUR * pieces_quantity) / (target * interval_in_minutes)
  }

  static calculateLostTime({ pieces_quantity, interval_in_minutes, target }: CalculateVariables) {
    return interval_in_minutes - (MINUTES_IN_HOUR * pieces_quantity) / target
  }

  static convertPiecesToLostTime({ pieces_quantity, target }: { pieces_quantity: number, target: number }) {
    return Math.round((pieces_quantity * MINUTES_IN_HOUR) / target)
  }

  static convertLostTimeToPieces({ lost_time, target }: { lost_time: number, target: number }) {
    return Math.round(lost_time * target / MINUTES_IN_HOUR)
  }

  static fromOeeForm(formData: OeeForm) {
    let interval_in_minutes = 60;
    if (formData.hourInterval === '15:00-15:48') interval_in_minutes = 48
    if (formData.hourInterval === '15:49-15:59') interval_in_minutes = 10

    return new ProductionRegistry({
      process_id: Number(formData.process),
      interval_in_minutes,
      pieces_quantity: formData.piecesQuantity,
      project: formData.project,
      time_tag: formData.hourInterval,
      turn: formData.turn,
      production_losses: formData.reasons
        .map(item => ({
          classification: classificationTypesMap[item.class as ClassificationTypes],
          description: item.description,
          cause: item.class,
          time: item.time
        }))
    })
  }

}

type CalculateVariables = {
  pieces_quantity: number
  target: number
  interval_in_minutes: number
}

export type ProductionRegistryCreateDto = ProductionRegistry['createData']
