import { z } from "zod"
import { ProductionEfficiencyLoss } from "./ProductionEfficiencyLoss"

export const uteKeysList = ['UTE-1', 'UTE-2', 'UTE-3', 'UTE-4', 'UTE-5'] as const

export type UteKeys = typeof uteKeysList[number]

export interface ProductionEfficiencyRecord {
  date: Date // Data
  turn: string // select [1, 2, 3]
  ute: UteKeys // select ['UTE-1', 'UTE-2', 'UTE-3', 'UTE-4', 'UTE-5']
  productionTimeInMinutes: number
  piecesQuantity: number
  oeeValue: number
  productionEfficiencyLosses: ProductionEfficiencyLoss[] // Multiplas respostas com os campos {Calss, descrição]}
  productionProcessId: string
}

export const oeeFormSchema = z.object({
  date: z.string().nonempty('Campo obrigatório'),
  name: z.string().nonempty('Campo obrigatório'),
  turn: z.string().nonempty('Selecione o turno'),
  ute: z.string().nonempty('Selecione a UTE'),
  process: z.string().nonempty('Selecione um processo'),
  productionTimeInMinutes: z.coerce.number().min(1, 'precisa ser > 0'),
  piecesQuantity: z.coerce.number().min(1, 'precisa ser > 0'),
  reasons: z.array(z.object({
    class: z.string().nonempty('Selecione o grupo'),
    description: z.string().nonempty('Descreva o motivo da perda'),
    time: z.coerce.number().min(1, 'precisa ser > 0')
  }))
})

export type OeeFormType = z.infer<typeof oeeFormSchema>

export type CreateEfficiencyRecordRequestDTO = OeeFormType
