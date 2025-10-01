import { UteKeys } from "./Ute"

export interface Process {
  id: number
  description: string
  target: number
  projects: string[]
  ute: UteKeys
  tech: string
}
