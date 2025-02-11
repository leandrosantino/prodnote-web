import { OeeFormType, UteKeys } from "@/entities/EfficiencyRecord"

export interface IEfficiencyRecordService {
  createRecord(efficiencyRecordData: CreateEfficiencyRecordRequestDTO): Promise<CreateEfficiencyRecordResponseDTO>
  exportToExcel(): Promise<void>
}

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
