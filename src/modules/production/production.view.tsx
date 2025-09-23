import { Fragment } from "react/jsx-runtime";
import { ProductionController } from "./production.controller";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export function ProductionView(controller: ProductionController) {

  const classes = {
    cell: "text-center",
    header: 'text-center text-foreground'
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 bg-white shadow-lg rounded-md h-full flex flex-col gap-2 overflow-auto" >

      <header className="flex justify-between" >
        <h1 className="text-2xl font-bold" >Quadro Hora à Hora - Processo 1 - {controller.params?.ute}</h1>
        <Button onClick={() => controller.navigate('/form/' + controller.params?.ute)} >Laçamento</Button>
      </header>

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
                <TableRow
                  className={cn(
                    'hover:bg-muted/50 cursor-pointer',
                    item.id && 'bg-blue-50'
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
                    {item.process?.target}
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
              </Fragment >))}
            </TableBody>
          </Table>
      </section>

    </div>
  )
}
