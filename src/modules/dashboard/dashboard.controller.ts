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



@injectable()
export class DashboardController {

  private navigate = useNavigate()

  public data = useStateObject<EfficiencyRecord[]>([])
  public loading = useStateObject(false)

  public oeeValue = useStateObject('--')
  public totalOfProduction = useStateObject('--')
  public totalOfRework = useStateObject('--')
  public totalOfScrap = useStateObject('--')

  public lossReasonChartData = useStateObject<LossReasonChartData[]>([])
  public topFiveProcessChartData = useStateObject<TopFiveProcessChartData[]>([])
  public dailyChartData = useStateObject<DailyChartData[]>([])

  private lossReasonChartFill = 'hsl(var(--chart-2))'
  private topFiveProcessChartFill = 'hsl(var(--chart-1))'

  constructor(
    @inject('EfficiencyRecordService') private readonly efficiencyRecordService: IEfficiencyRecordService,
    @inject('ListEfficiencyRecordCached') private readonly listEfficiencyRecordCached: ListEfficiencyRecordCached,
    @inject('ReportService') private readonly reportService: IReportService
  ) {
    useEffect(() => { this.loadData() }, [])
    useEffect(() => this.startEfficiencyRecordListinner(), [])
    useEffect(() => { this.caculateOeeValue() }, [this.data.value])
    useEffect(() => { this.calculateTotalOfRework() }, [this.data.value])
    useEffect(() => { this.calculateTotalOfScrap() }, [this.data.value])
    useEffect(() => { this.calculateTotalOfProduction() }, [this.data.value])
    useEffect(() => { this.calculateLossReasonChartData() }, [this.data.value])
    useEffect(() => { this.calculateTopFiveProcessChartData() }, [this.data.value])
    useEffect(() => { this.calculateDailyChartData() }, [this.data.value])
  }

  private startEfficiencyRecordListinner() {
    const unsubscribe = this.listEfficiencyRecordCached.onCreate()
    return unsubscribe
  }

  private async loadData() {
    this.loading.set(true)
    try {
      this.data.set(await this.listEfficiencyRecordCached.execute())
    } catch (err) {
      console.log(err)
    }
  }

  private caculateOeeValue() {
    const value = this.reportService.caculateOeeValue(this.data.value)
    this.oeeValue.set(value.toFixed(1) + ' %')
  }

  private calculateTotalOfRework() {
    const value = this.reportService.calculateTotalOfRework(this.data.value)
    this.totalOfRework.set(value.toString())
  }

  private calculateTotalOfScrap() {
    const value = this.reportService.calculateTotalOfScrap(this.data.value)
    this.totalOfScrap.set(value.toFixed(1) + ' %')
  }

  private calculateTotalOfProduction() {
    const value = this.reportService.calculateTotalOfProduction(this.data.value)
    this.totalOfProduction.set(value.toString())
  }

  private calculateLossReasonChartData() {
    const data = this.reportService.calculatelossReasonChartData(this.data.value)
    this.lossReasonChartData.set(data.map(item => ({
      category: item.class,
      hours: item.timeInHours,
      fill: this.lossReasonChartFill
    })))
  }

  private calculateTopFiveProcessChartData() {
    const data = this.reportService.calculateTopFiveProcessChartData(this.data.value)
    this.topFiveProcessChartData.set(data.map(item => ({
      category: item.class,
      oee: item.oee,
      fill: this.topFiveProcessChartFill
    })))
  }

  private calculateDailyChartData() {
    const data = this.reportService.calculateDailyChartData(this.data.value)
    this.dailyChartData.set(data)
  }

  goToTablePage() {
    this.navigate('/table')
  }

  async report() {
    await this.efficiencyRecordService.exportToExcel()
  }

}
