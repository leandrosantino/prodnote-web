import { singleton } from "tsyringe";
import { IReportService } from "./IReportService";
import { EfficiencyRecord } from "@/entities/EfficiencyRecord";

@singleton()
export class ReportService implements IReportService {

  calculateTotalOfRework(data: EfficiencyRecord[]): number {
    return 5
  }

  caculateOeeValue(data: EfficiencyRecord[]): number {
    const grouped = data.map(({ productionTimeInMinutes, oeeValue }) => ({
      usefulTimeInMunites: oeeValue * productionTimeInMinutes,
      productionTimeInMinutes
    }))
    const totalOfusefulTimeInMunites = this.sum(grouped.map(item => item.usefulTimeInMunites))
    const totalOfproductionTimeInMinutes = this.sum(grouped.map(item => item.productionTimeInMinutes))
    return totalOfusefulTimeInMunites / totalOfproductionTimeInMinutes * 100
  }

  private sum(array: number[]) {
    return array.reduce((acc, val) => acc + val, 0)
  }

}
