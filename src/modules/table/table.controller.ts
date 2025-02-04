import { useNavigate } from "react-router-dom";
import { injectable } from "tsyringe";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { useStateObject } from "@/lib/useStateObject";
import { tableColumns } from "./table-columns";
import { ProductionEfficiencyRecord } from "@/entities/ProductionEfficiencyRecord";
import { useEffect } from "react";
import { getRecords } from "@/repositories";

@injectable()
export class TableController {
  private navigate = useNavigate()

  private sorting = useStateObject<SortingState>([])
  private columnFilters = useStateObject<ColumnFiltersState>([])
  private data = useStateObject<ProductionEfficiencyRecord[]>([])
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


  constructor() {
    useEffect(() => { this.table.setPageSize(this.data.value.length) }, [this.data.value])
    useEffect(() => { this.loadData() }, [])
  }

  private async loadData() {
    this.loading.set(true)
    try {
      const newData = await getRecords();
      this.data.set(newData);
      this.loading.set(false)
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  goToDashboard() {
    this.navigate('/dashboard')
  }
}
