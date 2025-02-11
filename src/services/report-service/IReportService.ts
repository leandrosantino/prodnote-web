import { EfficiencyRecord } from "@/entities/EfficiencyRecord";


export interface IReportService {
  caculateOeeValue(data: EfficiencyRecord[]): number
  calculateTotalOfRework(data: EfficiencyRecord[]): number
}
