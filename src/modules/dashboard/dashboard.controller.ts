import { ProductionRegistry } from "@/entities/ProductionRegistry";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { inject } from "tsyringe";
import { LossReasonChartData } from "./components/loss-reason-chart";
import { TopFiveProcessChartData } from "./components/top-five-process-chart";
import { DailyChartData } from "./components/daily-chart";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { component } from "@/lib/@component";
import { DashboardView } from "./dashborad.view";
import { ComponentController } from "@/lib/ComponentController";
import { ComponentView } from "@/lib/ComponentView";
import { ProductionRegistryService } from "@/services/ProductionRegistryService";
import { ReportService } from "@/services/ReportService";
import { ProcessRepository } from "@/repositories/ProcessRepository";
import { ProductionRegistryRepository } from "@/repositories/ProductionRegistryRepository";
import { Process } from "@/entities/Process";

@component(DashboardView)
export class DashboardController extends ComponentController {

  private navigate = useNavigate()

  private data = this.useState<ProductionRegistry[]>([])
  private dataFiltered = this.useState<ProductionRegistry[]>([])
  private dataFilteredByMonth = this.useState<ProductionRegistry[]>([])

  public loading = this.useState(true)

  public oeeValue = this.useState('--')
  public totalOfBreakdowns = this.useState('--')
  public totalOfRework = this.useState('--')
  public totalOfScrap = this.useState('--')

  public lossReasonChartData = this.useState<LossReasonChartData[]>([])
  public topFiveProcessChartData = this.useState<TopFiveProcessChartData[]>([])
  public dailyChartData = this.useState<DailyChartData[]>([])

  public dateFilter = this.useState<Date | undefined>(new Date())
  public typeFilter = this.useState<'month' | 'day'>('day')
  public areaFilter = this.useState<string | undefined>()
  public turnFilter = this.useState<string | undefined>()
  public processFilter = this.useState<string | undefined>()
  public processes = this.useState<Process[]>([])

  public areaFilterKey = this.useState(0)
  public turnFilterKey = this.useState(1)

  public selectedMonthMame = this.useState('')

  private lossReasonChartFill = 'hsl(var(--chart-2))'
  private topFiveProcessChartFill = 'hsl(var(--chart-1))'

  constructor(
    @inject('ProductionRegistryService') private readonly productionRegistryService: ProductionRegistryService,
    @inject('ProcessRepository') private readonly processRepository: ProcessRepository,
    @inject('ProductionRegistryRepository') private readonly productionRegistryRepository: ProductionRegistryRepository,
    @inject('ReportService') private readonly reportService: ReportService
  ) {
    super()
    useEffect(() => { this.loadData() }, [])
    useEffect(() => { this.onChangeFilters() }, [this.data.value])
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
    useEffect(() => { this.onAreaFilterChange() }, [this.areaFilter.value])
    useEffect(() => {
      if (this.dateFilter.value === undefined) this.dateFilter.set(new Date())
    }, [this.dateFilter.value])
    useEffect(() => {
      if (!this.dateFilter.value) return
      this.selectedMonthMame.set(format(this.dateFilter.value, 'MMMM', { locale: ptBR }))
    }, [this.dateFilter.value])
  }

  private onAreaFilterChange() {
    if (!this.areaFilter.value) return
    this.processFilter.set(undefined)
    this.processRepository.getByUte(this.areaFilter.value)
      .then(filtered => {
        this.processes.set(filtered)
      })
  }


  private onChangeFilters() {
    if (!this.dateFilter.value) {
      this.dataFilteredByMonth.set(this.data.value)
      this.dataFiltered.set(this.data.value)
      return
    }
    const selectedMonth = this.dateFilter.value?.getMonth()
    const filteredByMonth: ProductionRegistry[] = []
    const filteredByDateRange: ProductionRegistry[] = []
    this.data.value.forEach((item) => {
      if (this.areaFilter.value && item.process.ute !== this.areaFilter.value) return
      if (this.turnFilter.value && item.turn !== this.turnFilter.value) return
      if (this.processFilter.value && item.process.description !== this.processFilter.value) return
      if (item.created_at.getMonth() === selectedMonth) filteredByMonth.push(item)
      if (this.typeFilter.value === 'day' && isSameDay(item.created_at, this.dateFilter.value as Date)) filteredByDateRange.push(item)
      if (this.typeFilter.value === 'month' && item.created_at.getMonth() === selectedMonth) filteredByDateRange.push(item)

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
    this.processRepository.getAll()
      .then(filtered => {
        this.processes.set(filtered)
      })
  }

  private async loadData() {
    this.loading.set(true)
    try {
      const data = await this.productionRegistryRepository.findMany()
      this.data.set(data)
      this.dataFiltered.set(data)
      this.dataFilteredByMonth.set(data)
      const processes = await this.processRepository.getAll()
      this.processes.set(processes)
    } catch (err) {
      console.log(err)
    } finally {
      this.loading.set(false)
    }
  }

  private caculateOeeValue() {
    const value = this.reportService.caculateoee(this.dataFiltered.value)
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
    this.totalOfBreakdowns.set(value.toFixed(1) + ' %')
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
      pieces_quantity: item.pieces_quantity,
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
    await this.productionRegistryService.exportToExcel()
  }

}

export default DashboardController.View as ComponentView<DashboardController>
