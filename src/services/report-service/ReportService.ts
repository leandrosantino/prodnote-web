import { singleton } from "tsyringe";
import { IReportService } from "./IReportService";
import { EfficiencyRecord } from "@/entities/EfficiencyRecord";
import { ClassificationTypes, EfficiencyLoss } from "@/entities/EfficiencyLoss";

@singleton()
export class ReportService implements IReportService {

  calculateDailyChartData(data: EfficiencyRecord[]): Array<{ date: string; oee: number; }> {
    if (data.length < 1) return []
    const grouped: Array<{ usefulTimeInMunites: number, productionTimeInMinutes: number }> = []

    new Array(31).fill(0).forEach(() => {
      const template = { usefulTimeInMunites: 0, productionTimeInMinutes: 0 }
      grouped.push({ ...template })
    })

    data.forEach(item => {
      const day = item.date.getDate() - 1
      grouped[day].usefulTimeInMunites += item.oeeValue * item.productionTimeInMinutes
      grouped[day].productionTimeInMinutes += item.productionTimeInMinutes
    })

    const formated = grouped.map(({ productionTimeInMinutes, usefulTimeInMunites }, index) => {
      let oee = usefulTimeInMunites / productionTimeInMinutes
      if (isNaN(oee)) oee = 0
      return { date: (index + 1).toString().padStart(2, '0'), oee }
    })

    return formated;
  }

  calculateTopFiveProcessChartData(data: EfficiencyRecord[]): Array<{ class: string; oee: number; }> {
    if (data.length < 1) return []
    const grouped: Record<string, {
      usefulTimeInMunites: number
      productionTimeInMinutes: number
    }> = {}

    data.forEach(item => {
      if (item.productionProcessId in grouped) {
        grouped[item.productionProcessId].usefulTimeInMunites += item.oeeValue * item.productionTimeInMinutes,
          grouped[item.productionProcessId].productionTimeInMinutes += item.productionTimeInMinutes
        return
      }
      grouped[item.productionProcessId] = {
        usefulTimeInMunites: item.oeeValue * item.productionTimeInMinutes,
        productionTimeInMinutes: item.productionTimeInMinutes
      }
    })

    const formated = Object.entries(grouped)
      .map(([key, { productionTimeInMinutes, usefulTimeInMunites }]) => ({
        class: key,
        oee: usefulTimeInMunites / productionTimeInMinutes
      }))

    return formated.sort((a, b) => a.oee - b.oee).slice(0, 5)
  }

  calculatelossReasonChartData(data: EfficiencyRecord[]): Array<{ class: ClassificationTypes; timeInHours: number; }> {
    if (data.length < 1) return [];
    const grouped: Record<ClassificationTypes, number> = {
      'Ajsute de Parâmetro': 0,
      'Setup': 0,
      'Máquina quebrada': 0,
      'Manutenção programada': 0,
      'Organização/Limpeza': 0,
      'Troca de material': 0,
      'Refeição': 0,
      'Retrabalho': 0,
      'Refugo': 0,
      'RH': 0,
      'Logística': 0,
      'Operacional': 0,
    }

    data.forEach(({ productionEfficiencyLosses }) => {
      productionEfficiencyLosses.forEach((loss) => {
        if (loss.cause in grouped) {
          grouped[loss.cause as ClassificationTypes] += Math.round(loss.lostTimeInMinutes / 60 * 100) / 100
        }
      })
    })

    const formated = Object.entries(grouped)
      .map(([key, value]) => ({
        class: key as ClassificationTypes,
        timeInHours: value
      }))
    return formated
  }

  calculateTotalOfProduction(data: EfficiencyRecord[]): number {
    const totalOfProduction = this.sum(data.map(({ piecesQuantity }) => piecesQuantity))
    return totalOfProduction
  }

  calculateTotalOfScrap(data: EfficiencyRecord[]): number {
    if (data.length < 1) return 0;

    const scrapLossesTimes: number[] = []
    const qualityLossesTimes: number[] = []
    const usefulTimes: number[] = []

    data.forEach(({ productionEfficiencyLosses, oeeValue, productionTimeInMinutes }) => {
      usefulTimes.push(oeeValue * productionTimeInMinutes)
      productionEfficiencyLosses.forEach((loss) => {
        if (loss.cause === 'Refugo') {
          scrapLossesTimes.push(loss.lostTimeInMinutes)
          qualityLossesTimes.push(loss.lostTimeInMinutes)
        }
        if (loss.cause === 'Retrabalho') qualityLossesTimes.push(loss.lostTimeInMinutes)
      })
    })

    const totalOfScrapLostTimeInMinutes = this.sum(scrapLossesTimes)
    const totalOfQualityLostTimeInMinutes = this.sum(qualityLossesTimes)
    const totalOfUsefulTimeInMinutes = this.sum(usefulTimes)

    return (totalOfScrapLostTimeInMinutes / (totalOfQualityLostTimeInMinutes + totalOfUsefulTimeInMinutes)) * 100
  }

  calculateTotalOfRework(data: EfficiencyRecord[]): number {
    if (data.length < 1) return 0;
    const losses: EfficiencyLoss[] = []
    data.forEach(({ productionEfficiencyLosses, oeeValue, productionTimeInMinutes, piecesQuantity }) => {
      const usefulTimeInMunites = oeeValue * productionTimeInMinutes
      productionEfficiencyLosses.forEach(({ lostTimeInMinutes, ...loss }) => {
        if (loss.cause === 'Retrabalho') {
          const calculated = lostTimeInMinutes * piecesQuantity / usefulTimeInMunites
          losses.push({
            ...loss,
            lostTimeInMinutes: calculated
          })
        }
      })
    })

    const filteredLosses = losses.map(({ lostTimeInMinutes }) => lostTimeInMinutes)

    return Math.round(this.sum(filteredLosses))
  }

  caculateOeeValue(data: EfficiencyRecord[]): number {
    if (data.length < 1) return 0;
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
