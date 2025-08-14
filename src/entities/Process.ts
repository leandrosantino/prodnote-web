import { UteKeys } from "./Ute"

export interface Process {
  id: string
  description: string
  target: number
  ute: UteKeys
}
