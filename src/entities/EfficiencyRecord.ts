import { z } from "zod"
import { EfficiencyLoss } from "./EfficiencyLoss"
import { ProductionProcess } from "./ProductionProcess"

export const uteKeysList = ['UTE-1', 'UTE-2', 'UTE-3', 'UTE-4', 'UTE-5'] as const

export const utePattern = /^UTE-[1-5]$/

export type UteKeys = typeof uteKeysList[number]

export interface EfficiencyRecord {
  date: Date
  turn: string
  productionTimeInMinutes: number
  piecesQuantity: number
  oeeValue: number
  productionEfficiencyLosses: { efficiencyLoss: EfficiencyLoss }[]
  hourInterval: typeof hourIntervals[number]
  processId: number
  process: Pick<ProductionProcess, 'description' | 'area'>
}

export const hourIntervals = [
  // 3º turno
  '01:00-01:59',
  '02:00-02:59',
  '03:00-03:59',
  '04:00-04:59',
  '05:00-05:59',
  // 1º turno
  '06:00-06:59',
  '07:00-07:59',
  '08:00-08:59',
  '09:00-09:59',
  '10:00-10:59',
  '11:00-11:59',
  '12:00-12:59',
  '13:00-13:59',
  '14:00-14:59',
  '15:00-15:48',
  // 2º turno
  '15:49-15:59',
  '16:00-16:59',
  '17:00-17:59',
  '18:00-18:59',
  '19:00-19:59',
  '20:00-20:59',
  '21:00-21:59',
  '22:00-22:59',
  '23:00-23:59',
  '00:00-00:59',
] as const


export const oeeFormSchema = z.object({
  turn: z.string().nonempty('Selecione o turno'), //X
  hourInterval: z.enum(hourIntervals, { message: 'Selecione um intervalo de hora' }),
  process: z.string().nonempty('Selecione um processo'),
  piecesQuantity: z.coerce.number().min(0, 'precisa ser >= 0'),
  reasons: z.array(z.object({
    class: z.string().nonempty('Selecione o grupo'),
    description: z.string().nonempty('Descreva o motivo da perda'),
    time: z.coerce.number().min(1, 'precisa ser > 0')
  }))
})

export type OeeFormType = z.infer<typeof oeeFormSchema>


