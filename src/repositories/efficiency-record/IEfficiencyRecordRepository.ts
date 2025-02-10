import { EfficiencyLoss } from "@/entities/EfficiencyLoss";
import { EfficiencyRecord } from "@/entities/EfficiencyRecord";

export interface IEfficiencyRecordRepository {
  create(params: CreateEfficiencyRecordRepositoryDTO): Promise<void>
  getAll(): Promise<EfficiencyRecord[]>
}


export type CreateEfficiencyRecordRepositoryDTO = {
  data: Omit<EfficiencyRecord, 'process' | 'productionEfficiencyLosses'>,
  efficiencyLosses: Omit<EfficiencyLoss, 'id'>[]
}
