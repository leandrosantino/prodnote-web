import { component } from "@/lib/@component";
import { ComponentController } from "@/lib/ComponentController";
import { ProductionView } from "./production.view";
import { ComponentView } from "@/lib/ComponentView";
import { ProductionRegistry } from "@/entities/ProductionRegistry";
import { UteKeys } from "@/entities/Ute";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { HourIntervals, hourIntervals } from "@/entities/HoursIntervals";
import { useEffect } from "react";
import { ProductionRegistryRepository } from "@/repositories/ProductionRegistryRepository";
import { inject } from "tsyringe";
import { set } from "date-fns";
import { Process } from "@/entities/Process";
import { ProcessRepository } from "@/repositories/ProcessRepository";


@component(ProductionView)
export class ProductionController extends ComponentController {

  location = useLocation() as { state: { time_tag: HourIntervals } }

  public params = useParams<{ ute: UteKeys, process_id: string }>()
  public navigate = useNavigate()
  public data = this.useState<Record<HourIntervals, Partial<ProductionRegistry>>>()

  public dateFilter = this.useState<Date | undefined>(new Date())
  public processFilter = this.useState<string | undefined>()
  public processes = this.useState<Process[]>([])
  public selectedProcesses = this.useState<Process>()


  public loading = this.useState(true)

  constructor(
    @inject('ProductionRegistryRepository') private readonly productionRegistryRepository: ProductionRegistryRepository,
    @inject('ProcessRepository') private readonly processRepository: ProcessRepository
  ) {
    super()
    useEffect(() => { this.loadProcesses() }, [])
    useEffect(() => { this.loadData() }, [])
    useEffect(() => { this.onChangeProcessFilters() }, [this.processFilter.value])
    useEffect(() => { this.onChangeDateFilters() }, [this.dateFilter.value])

  }

  private async onChangeProcessFilters() {
    this.loadData()
    const process = this.processes.value.find(item => item.id.toString() == this.processFilter.value)
    if (!process) return
    this.selectedProcesses.set(process)
  }

  private async onChangeDateFilters() {
    if (!this.dateFilter.value) {
      this.dateFilter.set(new Date())
    }
    this.loadData()
  }


  private async loadProcesses() {
    this.loading.set(true)
    const processes = await this.processRepository.getByUte(this.params?.ute!)
    this.processes.set(processes)
    if (this.params.process_id) {
      const selected_process = await this.processRepository.getById(Number(this.params.process_id))
      if (!selected_process) return
      this.processFilter.set(selected_process.id.toString())
      this.selectedProcesses.set(selected_process)
    }
    this.loading.set(false)
  }

  private async loadData() {
    this.loading.set(true)

    const temp: ProductionController['data']['value'] = {} as any
    hourIntervals.forEach(item => {
      temp[item] = {}
    })

    const process_id = this.processFilter.value ? Number(this.processFilter.value) : Number(this.params?.process_id!)
    let registries: ProductionRegistry[] = []
    if (process_id) {
      registries = await this.productionRegistryRepository.findMany({
        createdAtStart: this.dateFilter.value && set(this.dateFilter.value, { hours: 0, minutes: 0, seconds: 0 }),
        createdAtEnd: this.dateFilter.value && set(this.dateFilter.value, { hours: 23, minutes: 59, seconds: 59 }),
        process_id
      })
    }

    // console.log(registries)

    registries.forEach(item => {
      temp[item.time_tag] = item
    })

    this.data.set(temp)
    this.loading.set(false)
  }

}


export default ProductionController.View as ComponentView<ProductionController>
