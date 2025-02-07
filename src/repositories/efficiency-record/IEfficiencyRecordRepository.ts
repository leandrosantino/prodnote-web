import { EfficiencyRecord } from "@/entities/EfficiencyRecord";

export interface IEfficiencyRecordRepository {
  create(data: EfficiencyRecord): Promise<void>
  getAll(): Promise<EfficiencyRecord[]>
}
