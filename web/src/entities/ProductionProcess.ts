import { UteKeys } from "./ProductionEfficiencyRecord"

export interface ProductionProcess {
  id: string
  description: string
  cycleTimeInSeconds: number
  cavitiesNumber: number
  ute: UteKeys
}
