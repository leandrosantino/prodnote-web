import { Fragment } from "react/jsx-runtime";
import { ProductionController } from "./production.controller";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatePicker } from "@/components/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LossesReasonDialog } from "../table/components/losses-reason-dialog";
import { CopyPlus } from "lucide-react";


export function ProductionView(controller: ProductionController) {

  const classes = {
    cell: "text-center",
    header: 'text-center text-foreground border-b-[3px] border-orange-300 border-b-orange-500'
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 bg-white shadow-lg rounded-md h-full flex flex-col gap-2 overflow-auto" >

      <header className="flex justify-between mb-2" >
        <div>
          <h1 className="text-2xl font-bold" >Filme de Produção</h1>
          {controller.selectedProcesses.value?.description && controller.selectedProcesses.value.description + ' - '}
          {controller.params?.ute}
        </div>
        <Button onClick={() => controller.navigate('/form/' + controller.params?.ute)} >
          <CopyPlus />
          Apontar
        </Button>
      </header>

      <div className="flex gap-2 items-center flex-wrap mb-2" >
        <DatePicker date={controller.dateFilter.value} setDate={controller.dateFilter.set} />

        <Select value={controller.processFilter.value} onValueChange={(value) => controller.processFilter.set(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione um processo" />
          </SelectTrigger>
          <SelectContent>
            {controller.processes.value.map(val => (
              <SelectItem key={val.id} value={val.id.toString()} >{val.description}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      <section className="rounded-md border overflow-auto" >
          <Table>
            <TableHeader className='bg-orange-200 shadow-md rounded-t-md max-md:pr-0'>
              <TableRow>
                <TableHead className={cn(classes.header, 'min-w-20')} >Hora</TableHead>
                <TableHead className={cn(classes.header, 'min-w-20')} >Meta</TableHead>
                <TableHead className={cn(classes.header, 'min-w-20')} >Produzido</TableHead>
                <TableHead className={cn(classes.header)} >OEE</TableHead>
                <TableHead className={cn(classes.header)} >Perda</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='max-h-[650px]  h-full' >
              {Object.entries(controller.data.value ?? {})?.map(([key, item], index) => (<Fragment  key={index}>
                {(index == 0 || index == 5 || index == 15) &&
                <TableRow>
                  <TableCell
                    className="bg-zinc-200 text-center p-[2px] font-bold border border-zinc-400"
                  >
                    {index == 0 && '3º Turno'}
                    {index == 5 && '1º Turno'}
                    {index == 15 && '2º Turno'}
                  </TableCell>
                </TableRow>
                }
                <LossesReasonDialog  efficiencyRecord={{...item, ...{
                  process: item.process?.description,
                  ute: item.process?.ute,
                  target: item.process?.target
                }} as any} >
                  <TableRow
                    className={cn(
                      'hover:bg-muted/50 cursor-pointer',
                      item.id && 'bg-blue-50',
                      (item.time_tag && controller.location?.state?.time_tag == item.time_tag) && 'bg-green-50'
                    )}
                  >
                    <TableCell
                      className={cn(classes.cell, 'min-w-20 max-md:!text-xs')}
                    >
                      {key}
                    </TableCell>
                    <TableCell
                      className={cn(classes.cell, 'min-w-20')}
                    >
                      {item.interval_in_minutes && item.fractionalTarget}
                    </TableCell>
                    <TableCell
                      className={cn(classes.cell, 'min-w-20')}
                    >
                      {item.pieces_quantity}
                    </TableCell>
                    <TableCell
                      className={cn(classes.cell)}
                    >
                      {item.oee && (item.oee * 100).toFixed(0) + '%'}
                    </TableCell>
                    <TableCell
                      className={cn(classes.cell)}
                    >
                      {item?.totalReasonsTime!> 0 ? item?.totalReasonsTime +'min':''}
                    </TableCell>
                  </TableRow>
                </LossesReasonDialog>
              </Fragment >))}
            </TableBody>
          </Table>
      </section>

    </div>
  )
}
