import { EfficiencyRecord } from "@/entities/EfficiencyRecord";
import { useStateObject } from "@/lib/useStateObject";
import type { IEfficiencyRecordService } from "@/services/efficiency-record/IEfficiencyRecordService";
import type { IReportService } from "@/services/report-service/IReportService";
import { ListEfficiencyRecordCached } from "@/warpers/ListEfficiencyRecordCached";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { inject, injectable } from "tsyringe";
import { LossReasonChartData } from "./components/loss-reason-chart";
import { TopFiveProcessChartData } from "./components/top-five-process-chart";
import { DailyChartData } from "./components/daily-chart";
import { isSameDay } from "date-fns";
import type { IProductionProcessRepository } from "@/repositories/production-process/IProductionProcessRepository";

@injectable()
export class DashboardController {

  private navigate = useNavigate()

  private data = useStateObject<EfficiencyRecord[]>([])
  private dataFiltered = useStateObject<EfficiencyRecord[]>([])
  private dataFilteredByMonth = useStateObject<EfficiencyRecord[]>([])

  public loading = useStateObject(true)

  public oeeValue = useStateObject('--')
  public totalOfBreakdowns = useStateObject('--')
  public totalOfRework = useStateObject('--')
  public totalOfScrap = useStateObject('--')

  public lossReasonChartData = useStateObject<LossReasonChartData[]>([])
  public topFiveProcessChartData = useStateObject<TopFiveProcessChartData[]>([])
  public dailyChartData = useStateObject<DailyChartData[]>([])

  public dateFilter = useStateObject<Date | undefined>(new Date())
  public typeFilter = useStateObject<'month' | 'day'>('day')
  public areaFilter = useStateObject<string | undefined>()
  public turnFilter = useStateObject<string | undefined>()
  public processFilter = useStateObject<string | undefined>()
  public processes = useStateObject<string[]>([])

  public areaFilterKey = useStateObject(0)
  public turnFilterKey = useStateObject(1)

  private lossReasonChartFill = 'hsl(var(--chart-2))'
  private topFiveProcessChartFill = 'hsl(var(--chart-1))'

  constructor(
    @inject('EfficiencyRecordService') private readonly efficiencyRecordService: IEfficiencyRecordService,
    @inject('ListEfficiencyRecordCached') private readonly listEfficiencyRecordCached: ListEfficiencyRecordCached,
    @inject('ProductionProcessRepository') private readonly productionProcessRepository: IProductionProcessRepository,
    @inject('ReportService') private readonly reportService: IReportService
  ) {
    useEffect(() => { this.loadData() }, [])
    useEffect(() => { this.onChangeFilters() }, [this.data.value])
    useEffect(() => this.startEfficiencyRecordListinner(), [])
    useEffect(() => { this.caculateOeeValue() }, [this.dataFiltered.value])
    useEffect(() => { this.calculateTotalOfRework() }, [this.dataFiltered.value])
    useEffect(() => { this.calculateTotalOfScrap() }, [this.dataFiltered.value])
    useEffect(() => { this.calculateTotalOfBreakdowns() }, [this.dataFiltered.value])
    useEffect(() => { this.calculateLossReasonChartData() }, [this.dataFiltered.value])
    useEffect(() => { this.calculateTopFiveProcessChartData() }, [this.dataFiltered.value])
    useEffect(() => { this.calculateDailyChartData() }, [this.dataFilteredByMonth.value])
    useEffect(() => { this.onChangeFilters() }, [
      this.dateFilter.value,
      this.typeFilter.value,
      this.areaFilter.value,
      this.turnFilter.value,
      this.processFilter.value,
    ])
    useEffect(() => {
      if (this.dateFilter.value === undefined) this.dateFilter.set(new Date())
    }, [this.dateFilter.value])
  }

  public async resetCache() {
    await this.listEfficiencyRecordCached.reserCache()
    await this.loadData()
  }

  private onChangeFilters() {
    if (!this.dateFilter.value) {
      this.dataFilteredByMonth.set(this.data.value)
      this.dataFiltered.set(this.data.value)
      return
    }
    const selectedMonth = this.dateFilter.value?.getMonth()
    const filteredByMonth: EfficiencyRecord[] = []
    const filteredByDateRange: EfficiencyRecord[] = []
    this.data.value.forEach((item) => {
      if (this.areaFilter.value && item.ute !== this.areaFilter.value) return
      if (this.turnFilter.value && item.turn !== this.turnFilter.value) return
      if (this.processFilter.value && item.productionProcessId !== this.processFilter.value) return
      if (item.date.getMonth() === selectedMonth) filteredByMonth.push(item)
      if (this.typeFilter.value === 'day' && isSameDay(item.date, this.dateFilter.value as Date)) filteredByDateRange.push(item)
      if (this.typeFilter.value === 'month' && item.date.getMonth() === selectedMonth) filteredByDateRange.push(item)

    })
    this.dataFilteredByMonth.set(filteredByMonth)
    this.dataFiltered.set(filteredByDateRange)
  }

  public handleClearFilters() {
    this.areaFilter.set('')
    this.turnFilter.set('')
    this.areaFilterKey.set((prevKey) => prevKey + 1)
    this.turnFilterKey.set((prevKey) => prevKey + 1)
    this.dateFilter.set(undefined)
    this.processFilter.set(undefined)
  }

  private startEfficiencyRecordListinner() {
    const unsubscribe = this.listEfficiencyRecordCached.onCreate()
    return unsubscribe
  }

  private async loadData() {
    this.loading.set(true)
    try {
      const data = await this.listEfficiencyRecordCached.execute()
      this.data.set(data)
      this.dataFiltered.set(data)
      this.dataFilteredByMonth.set(data)
      const processes = await this.productionProcessRepository.getAll()
      this.processes.set(processes.map(item => item.description))
    } catch (err) {
      console.log(err)
    } finally {
      this.loading.set(false)
    }
  }

  private caculateOeeValue() {
    const value = this.reportService.caculateOeeValue(this.dataFiltered.value)
    this.oeeValue.set(value.toFixed(1) + ' %')
  }

  private calculateTotalOfRework() {
    const value = this.reportService.calculateTotalOfRework(this.dataFiltered.value)
    this.totalOfRework.set(value.toFixed(1) + '%')
  }

  private calculateTotalOfScrap() {
    const value = this.reportService.calculateTotalOfScrap(this.dataFiltered.value)
    this.totalOfScrap.set(value.toFixed(1) + ' %')
  }

  private calculateTotalOfBreakdowns() {
    const value = this.reportService.calculateTotalOfBreakdowns(this.dataFiltered.value)
    this.totalOfBreakdowns.set(value.toString())
  }

  private calculateLossReasonChartData() {
    const data = this.reportService.calculatelossReasonChartData(this.dataFiltered.value)
    this.lossReasonChartData.set(data.map(item => ({
      category: item.class,
      hours: item.timeInHours,
      fill: this.lossReasonChartFill
    })))
  }

  private calculateTopFiveProcessChartData() {
    const data = this.reportService.calculateTopFiveProcessChartData(this.dataFiltered.value)
    this.topFiveProcessChartData.set(data.map(item => ({
      category: item.class,
      oee: item.oee,
      fill: this.topFiveProcessChartFill
    })))
  }

  private calculateDailyChartData() {
    const data = this.reportService.calculateDailyChartData(this.dataFilteredByMonth.value)
    this.dailyChartData.set(data)
  }

  goToTablePage() {
    this.navigate('/table')
  }

  async report() {
    await this.efficiencyRecordService.exportToExcel()
  }

}
