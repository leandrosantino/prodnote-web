import { EfficiencyRecord } from "@/entities/EfficiencyRecord";

export interface IEfficiencyRecordRepository {
  create(data: EfficiencyRecord): Promise<void>
  getAll(): Promise<EfficiencyRecord[]>
  findMany(filters: { date: Date, operator: '<' | '>' | '==' }): Promise<EfficiencyRecord[]>
  onCreate(cb: (data: EfficiencyRecord) => void): () => void
}
