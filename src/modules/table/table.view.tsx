import { Button } from "@/components/ui/button"
import { TableController } from "./table.controller"
import { ArrowLeft, FilterX } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { flexRender } from "@tanstack/react-table"
import { Loading } from "@/components/Loading"
import { LossesReasonDialog } from "./components/losses-reason-dialog"
import { DatePicker } from "@/components/date-picker"
import { AreaSelector } from "../../components/area-selector"
import { TurnSelector } from "../../components/turn-selector"
import { ProcessSelector } from "../../components/process-selector"

type props = {
  controller: TableController
}

export function TableView({ controller }: props){
  return (
    <div className="max-w-[1200px] mx-auto p-4 bg-white shadow-lg rounded-md h-full flex flex-col gap-4 overflow-auto" >
      <div className="flex gap-2 items-center justify-between" >
        <h2 className='text-3xl font-bold max-md:text-2xl' >Historico Lançamento de OEE</h2>
        <Button variant='ghost' onClick={() => controller.goToDashboard()} > <ArrowLeft /> voltar </Button>
      </div>
      <div className="flex gap-2 items-center flex-wrap" >
        <DatePicker date={controller.dateFilter.value} setDate={controller.dateFilter.set} />
        <AreaSelector key={controller.areaFilterKey.value} setValue={controller.areaFilter.set} value={controller.areaFilter.value}  />
        <TurnSelector key={controller.turnFilterKey.value} setValue={controller.turnFilter.set} value={controller.turnFilter.value}  />
        <ProcessSelector
          processes={controller.processes.value}
          value={controller.processFilter.value}
          setValue={controller.processFilter.set}
        />
        <Button
          variant='ghost'
          className="text-red-600 hover:text-red-600 hover:bg-red-50 active:bg-red-100"
          onClick={ () => {controller.handleClearFilters()} }
        >
          <FilterX />
        </Button>
      </div>
      <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className='bg-accent shadow-md rounded-t-md'>
          {controller.table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className='text-center text-foreground' key={header.id}>
                    {header.isPlaceholder || flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className='max-h-[600px] min-h-[600px] h-full'>

          {controller.table.getRowModel().rows?.length? (
            controller.table.getRowModel().rows.map((row) => (
              <LossesReasonDialog key={row.id} efficiencyRecord={row.original} >
                <TableRow
                  className='hover:bg-muted/50 cursor-pointer'
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className='text-center' key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </LossesReasonDialog>
            ))
          ) : (
            <tr>
              <td
                colSpan={controller.columns.length}
                className="h-24 w-full text-center relative"
              >
                <div className="absolute inset-0 w-[958px]  flex justify-center pt-4" >
                  {!controller.loading.value?(
                    <span className="font-medium text-muted-foreground" >No more Results</span>
                  ):(
                    <Loading />
                  )}
                </div>
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}
