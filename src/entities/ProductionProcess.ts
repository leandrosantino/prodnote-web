import { UteKeys } from "./EfficiencyRecord"

export interface ProductionProcess {
  id: string
  description: string
  cycleTimeInSeconds: number
  cavitiesNumber: number
  area: UteKeys
}
