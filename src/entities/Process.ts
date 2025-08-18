import { UteKeys } from "./Ute"

export interface Process {
  id: number
  description: string
  target: number
  ute: UteKeys
}
