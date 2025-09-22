import { singleton } from "tsyringe";
import { ProductionRegistry } from "@/entities/ProductionRegistry";
import { ClassificationTypes } from "@/entities/ProductionLosses";

@singleton()
export class ReportService {

  calculateDailyChartData(data: ProductionRegistry[]) {
    if (data.length < 1) return []
    const grouped: Array<{ usefulTimeInMunites: number, productionTimeInMinutes: number }> = []

    new Array(31).fill(0).forEach(() => {
      const template = { usefulTimeInMunites: 0, productionTimeInMinutes: 0 }
      grouped.push({ ...template })
    })

    data.forEach(item => {
      const day = item.created_at.getDate() - 1
      grouped[day].usefulTimeInMunites += item.oee * item.interval_in_minutes
      grouped[day].productionTimeInMinutes += item.interval_in_minutes
    })

    const formated = grouped.map(({ productionTimeInMinutes, usefulTimeInMunites }, index) => {
      let oee = usefulTimeInMunites / productionTimeInMinutes
      if (isNaN(oee)) oee = 0
      return { date: (index + 1).toString().padStart(2, '0'), oee }
    })

    return formated;
  }

  calculateTopFiveProcessChartData(data: ProductionRegistry[]) {
    if (data.length < 1) return []
    const grouped: Record<string, { pieces_quantity: number, interval_in_minutes: number, target: number }> = {}

    data.forEach(item => {
      if (item.process.description in grouped) {
        grouped[item.process.description].interval_in_minutes += item.interval_in_minutes
        grouped[item.process.description].pieces_quantity += item.pieces_quantity
        return
      }
      grouped[item.process.description] = {
        pieces_quantity: item.pieces_quantity,
        target: item.process.target,
        interval_in_minutes: item.interval_in_minutes
      }
    })

    const formated = Object.entries(grouped)
      .map(([key, { pieces_quantity, interval_in_minutes, target }]) => ({
        class: key,
        pieces_quantity,
        oee: ProductionRegistry.calculateOee({ pieces_quantity, interval_in_minutes, target })
      }))

    return formated.sort((a, b) => a.oee - b.oee).slice(0, 5)
  }

  calculatelossReasonChartData(data: ProductionRegistry[]): Array<{ class: ClassificationTypes; timeInHours: number; }> {
    if (data.length < 1) return [];
    type a = ClassificationTypes | 'Micro paradas'
    const grouped: Record<a, number> = {
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
      'Treinamento/DDS': 0,
      'Absenteísmo': 0,
      'Logística': 0,
      'Operacional': 0,
    } as any

    data.forEach(({ production_losses: productionEfficiencyLosses }) => {
      productionEfficiencyLosses.forEach((loss) => {
        if (loss.cause in grouped) {
          grouped[loss.cause as a] += loss.time
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

  calculateTotalOfBreakdowns(data: ProductionRegistry[]): number {
    if (data.length < 1) return 0;
    let count = 0
    let totalOfProductionTimeInMinutes = 0
    data.forEach(({ production_losses: productionEfficiencyLosses, interval_in_minutes: productionTimeInMinutes }) => {
      totalOfProductionTimeInMinutes += productionTimeInMinutes
      productionEfficiencyLosses.forEach(({ time: lostTimeInMinutes, ...loss }) => {
        if (loss.cause === 'Máquina quebrada') count += lostTimeInMinutes
      })
    })
    return count / totalOfProductionTimeInMinutes * 100
  }

  calculateTotalOfScrap(data: ProductionRegistry[]): number {
    if (data.length < 1) return 0;

    const scrapLossesTimes: number[] = []
    const qualityLossesTimes: number[] = []
    const usefulTimes: number[] = []

    data.forEach(({ production_losses: productionEfficiencyLosses, oee, interval_in_minutes: productionTimeInMinutes }) => {
      usefulTimes.push(oee * productionTimeInMinutes)
      productionEfficiencyLosses.forEach((loss) => {
        if (loss.cause === 'Refugo') {
          scrapLossesTimes.push(loss.time)
          qualityLossesTimes.push(loss.time)
        }
        if (loss.cause === 'Retrabalho') qualityLossesTimes.push(loss.time)
      })
    })

    const totalOfScrapLostTimeInMinutes = this.sum(scrapLossesTimes)
    const totalOfQualityLostTimeInMinutes = this.sum(qualityLossesTimes)
    const totalOfUsefulTimeInMinutes = this.sum(usefulTimes)

    return (totalOfScrapLostTimeInMinutes / (totalOfQualityLostTimeInMinutes + totalOfUsefulTimeInMinutes)) * 100
  }

  calculateTotalOfRework(data: ProductionRegistry[]): number {
    if (data.length < 1) return 0;

    const scrapLossesTimes: number[] = []
    const qualityLossesTimes: number[] = []
    const usefulTimes: number[] = []

    data.forEach(({ production_losses: productionEfficiencyLosses, oee, interval_in_minutes: productionTimeInMinutes }) => {
      usefulTimes.push(oee * productionTimeInMinutes)
      productionEfficiencyLosses.forEach((loss) => {
        if (loss.cause === 'Retrabalho') {
          scrapLossesTimes.push(loss.time)
          qualityLossesTimes.push(loss.time)
        }
        if (loss.cause === 'Refugo') qualityLossesTimes.push(loss.time)
      })
    })

    const totalOfScrapLostTimeInMinutes = this.sum(scrapLossesTimes)
    const totalOfQualityLostTimeInMinutes = this.sum(qualityLossesTimes)
    const totalOfUsefulTimeInMinutes = this.sum(usefulTimes)

    return (totalOfScrapLostTimeInMinutes / (totalOfQualityLostTimeInMinutes + totalOfUsefulTimeInMinutes)) * 100
  }

  caculateoee(data: ProductionRegistry[]): number {
    if (data.length < 1) return 0;
    const grouped = data.map(({ interval_in_minutes: productionTimeInMinutes, oee }) => ({
      usefulTimeInMunites: oee * productionTimeInMinutes,
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
