import { z } from "zod"
import { UteKeys } from "./Ute"
import { hourIntervals } from "./HoursIntervals"

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


export type CreateEfficiencyRecordRequestDTO = OeeFormType & {
  date: Date
  ute: UteKeys
}

export type CreateEfficiencyRecordResponseDTO = {
  processName: string
  piecesQuantity: number
  totalReasonsTime: number
  totalScrap: number
  totalRework: number
  oee: number
  ute: string
}
