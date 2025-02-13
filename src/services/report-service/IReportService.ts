import { ClassificationTypes } from "@/entities/EfficiencyLoss";
import { EfficiencyRecord } from "@/entities/EfficiencyRecord";


export interface IReportService {
  caculateOeeValue(data: EfficiencyRecord[]): number
  calculateTotalOfRework(data: EfficiencyRecord[]): number
  calculateTotalOfScrap(data: EfficiencyRecord[]): number
  calculateTotalOfBreakdowns(data: EfficiencyRecord[]): number
  calculatelossReasonChartData(data: EfficiencyRecord[]): Array<{
    class: ClassificationTypes,
    timeInHours: number
  }>
  calculateTopFiveProcessChartData(data: EfficiencyRecord[]): Array<{
    class: string,
    oee: number
  }>
  calculateDailyChartData(data: EfficiencyRecord[]): Array<{
    date: string,
    oee: number
  }>
}
