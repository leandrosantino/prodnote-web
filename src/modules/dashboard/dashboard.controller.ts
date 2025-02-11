import { EfficiencyRecord } from "@/entities/EfficiencyRecord";
import { useStateObject } from "@/lib/useStateObject";
import type { IEfficiencyRecordService } from "@/services/efficiency-record/IEfficiencyRecordService";
import type { IReportService } from "@/services/report-service/IReportService";
import { ListEfficiencyRecordCached } from "@/warpers/ListEfficiencyRecordCached";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { inject, injectable } from "tsyringe";

@injectable()
export class DashboardController {

  private navigate = useNavigate()

  public data = useStateObject<EfficiencyRecord[]>([])
  public loading = useStateObject(false)

  public oeeValue = useStateObject('--')
  public totalOfProduction = useStateObject('--')
  public totalOfRework = useStateObject('--')
  public totalOfScrap = useStateObject('--')

  constructor(
    @inject('EfficiencyRecordService') private readonly efficiencyRecordService: IEfficiencyRecordService,
    @inject('ListEfficiencyRecordCached') private readonly listEfficiencyRecordCached: ListEfficiencyRecordCached,
    @inject('ReportService') private readonly reportService: IReportService
  ) {
    useEffect(() => { this.loadData() }, [])
    useEffect(() => {
      const unsubscribe = this.listEfficiencyRecordCached.onCreate()
      return unsubscribe()
    }, [])
    useEffect(() => { this.caculateOeeValue() }, [this.data.value])
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

  }

  goToTablePage() {
    this.navigate('/table')
  }

  async report() {
    await this.efficiencyRecordService.exportToExcel()
  }

}
