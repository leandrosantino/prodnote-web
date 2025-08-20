import { z } from "zod"
import { hourIntervals } from "./HoursIntervals"

export const oeeFormSchema = z.object({
  turn: z.string().nonempty('Selecione o turno'), //X
  hourInterval: z.enum(hourIntervals, { message: 'Selecione um intervalo de hora' }),
  process: z.string().nonempty('Selecione um processo'),
  piecesQuantity: z.coerce.number().min(0, 'precisa ser >= 0'),
  project: z.string(),
  reasons: z.array(z.object({
    class: z.string().nonempty('Selecione o grupo'),
    description: z.string().nonempty('Descreva o motivo da perda'),
    time: z.coerce.number().min(1, 'precisa ser > 0')
  }))
})

export type OeeForm = z.infer<typeof oeeFormSchema>
