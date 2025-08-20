import { useNavigate } from "react-router-dom";
import { inject } from "tsyringe";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, ColumnFiltersState, SortingState, Table } from "@tanstack/react-table";
import { useStateObject } from "@/lib/useStateObject";
import { tableColumns } from "./table-columns";
import { ProductionRegistry } from "@/entities/ProductionRegistry";
import { useEffect } from "react";
import { component } from "@/lib/@component";
import { ComponentController } from "@/lib/ComponentController";
import { TableView } from "./table.view";
import { ComponentView } from "@/lib/ComponentView";
import { ProcessRepository } from "@/repositories/ProcessRepository";
import { ProductionRegistryRepository } from "@/repositories/ProductionRegistryRepository";

@component(TableView)
export class TableController extends ComponentController {

  private navigate = useNavigate()
  private sorting = useStateObject<SortingState>([])
  private columnFilters = useStateObject<ColumnFiltersState>([])
  private data = useStateObject<ProductionRegistry[]>([])

  public dateFilter = useStateObject<Date | undefined>()
  public areaFilter = useStateObject<string | undefined>()
  public turnFilter = useStateObject<string | undefined>()
  public processFilter = useStateObject<string | undefined>()
  public processes = useStateObject<string[]>([])

  public areaFilterKey = useStateObject(0)
  public turnFilterKey = useStateObject(1)

  public columns = tableColumns
  public loading = useStateObject(false)

  table = useReactTable({
    data: this.data.value,
    columns: this.columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: this.sorting.set,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: this.columnFilters.set,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: this.sorting.value,
      columnFilters: this.columnFilters.value
    },
  })

  constructor(
    @inject('ProductionRegistryRepository') private readonly productionRegistryRepository: ProductionRegistryRepository,
    @inject('ProcessRepository') private readonly processRepository: ProcessRepository
  ) {
    super()
    useEffect(() => { this.table.setPageSize(this.data.value.length) }, [this.data.value])
    useEffect(() => { this.loadData() }, [])

    useEffect(() => { this.onChangeDateFilter() }, [this.dateFilter.value])
    useEffect(() => { this.onChangeTableDateFilter() }, [this.table.getColumn('created_at')?.getFilterValue()])

    useEffect(() => { this.onChangeAreaFilter() }, [this.areaFilter.value])
    useEffect(() => { this.onChangeTableAreaFilter() }, [this.table.getColumn('ute')?.getFilterValue()])

    useEffect(() => { this.onChangeTurnFilter() }, [this.turnFilter.value])
    useEffect(() => { this.onChangeTableTurnFilter() }, [this.table.getColumn('turn')?.getFilterValue()])

    useEffect(() => { this.onChangeProcessFilter() }, [this.processFilter.value])
    useEffect(() => { this.onChangeTableProcessFilter() }, [this.table.getColumn('process_id')?.getFilterValue()])

  }

  private onChangeDateFilter() {
    this.table.getColumn('created_at')?.setFilterValue(this.dateFilter.value)
  }
  private onChangeTableDateFilter() {
    this.dateFilter.set(this.table.getColumn('created_at')?.getFilterValue() as Date)
  }

  private onChangeAreaFilter() {
    this.table.getColumn('ute')?.setFilterValue(this.areaFilter.value)
  }
  private onChangeTableAreaFilter() {
    this.areaFilter.set(this.table.getColumn('ute')?.getFilterValue() as string)
  }

  private onChangeTurnFilter() {
    this.table.getColumn('turn')?.setFilterValue(this.turnFilter.value)
  }
  private onChangeTableTurnFilter() {
    this.turnFilter.set(this.table.getColumn('turn')?.getFilterValue() as string)
  }

  private onChangeProcessFilter() {
    this.table.getColumn('process_id')?.setFilterValue(this.processFilter.value)
  }
  private onChangeTableProcessFilter() {
    this.processFilter.set(this.table.getColumn('process_id')?.getFilterValue() as string)
  }

  private async loadData() {
    this.loading.set(true)
    try {
      this.data.set(await this.productionRegistryRepository.findMany());
      const processes = await this.processRepository.getAll()
      this.processes.set(processes.map(item => item.description))
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      this.loading.set(false)
    }
  }

  public handleClearFilters() {
    this.areaFilter.set('')
    this.turnFilter.set('')
    this.areaFilterKey.set((prevKey) => prevKey + 1)
    this.turnFilterKey.set((prevKey) => prevKey + 1)
    this.dateFilter.set(undefined)
    this.processFilter.set(undefined)
    this.table.reset()
    this.table.setPageSize(this.data.value.length)
  }

  public goToDashboard() {
    this.navigate('/dashboard')
  }
}

export default TableController.View as ComponentView<TableController>
