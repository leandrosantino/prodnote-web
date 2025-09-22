import { Fragment } from "react/jsx-runtime";
import { ProductionController } from "./production.controller";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


export function ProductionView(controller: ProductionController) {

  const classes = {
    cell: "border border-black p-2 border-b-[3px] border-t-[3px]",
    header: 'border border-black p-2'
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 bg-white shadow-lg rounded-md h-full flex flex-col gap-2 overflow-auto" >

      <header className="flex justify-between" >
        <h1 className="text-2xl font-bold" >Quadro Hora à Hora - Processo 1 - {controller.params?.ute}</h1>
        <Button onClick={() => controller.navigate('/form/' + controller.params?.ute)} >Laçamento</Button>
      </header>

      <section className="overflow-auto" >
          <table className="w-full table-auto text-center border border-zinc-500">
            <thead>
              <tr>
                <th className={cn(classes.header, 'min-w-28')} >Hora</th>
                <th className={cn(classes.header, 'min-w-20')} >Target</th>
                <th className={cn(classes.header, 'min-w-28')} >Produzido</th>
                <th className={cn(classes.header, 'min-w-20')} >OEE</th>
                <th className={cn(classes.header, 'min-w-80')} >Perdas</th>
                <th className={cn(classes.header, 'min-w-20')} >Tempo perdido</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(controller.data.value ?? {})?.map(([key, item], index) => (<Fragment  key={index}>
                <tr>
                  <td
                    rowSpan={item.production_losses?.length! > 0? item.production_losses?.length: 1}
                    className={cn(classes.cell)}
                  >
                    {key}
                  </td>
                  <td
                    rowSpan={item.production_losses?.length! > 0? item.production_losses?.length: 1}
                    className={cn(classes.cell)}
                  >
                    {item.process?.target}
                  </td>
                  <td
                    rowSpan={item.production_losses?.length! > 0? item.production_losses?.length: 1}
                    className={cn(classes.cell)}
                  >
                    {item.pieces_quantity}
                  </td>
                  <td
                    rowSpan={item.production_losses?.length! > 0? item.production_losses?.length: 1}
                    className={cn(classes.cell)}
                  >
                    {((item.oee || 0) * 100).toFixed(0)}%
                  </td>

                  <td className={cn(classes.cell, 'border-b-[2px] text-start')}>
                    <span className="font-bold" >{item?.production_losses?.length! > 0 ?(item?.production_losses as any)[0].cause + ':': ''}</span>
                    {item?.production_losses?.length! > 0 ?' ' + (item?.production_losses as any)[0].description: ''}
                    {item?.production_losses?.length! > 0 ?' - ' + (item?.production_losses as any)[0].time + 'min': ''}
                  </td>

                  <td
                    rowSpan={item.production_losses?.length! > 0? item.production_losses?.length: 1}
                    className={cn(classes.cell)}
                  >
                    {item?.totalReasonsTime!> 0 ? item?.totalReasonsTime +'min':''}
                  </td>
                </tr>
                {item.production_losses?.slice(1).map((item, lossIndex) => (<Fragment key={index + lossIndex}>
                  <tr>
                    <td className={cn(classes.cell, 'border-b-[2px] border-t-[2px] text-start')}>
                      <span className="font-bold" >{item.cause}: </span>
                      {item.classification} - {item.time}min
                    </td>
                  </tr>
                </Fragment >))}
              </Fragment >))}
            </tbody>
          </table>
      </section>

    </div>
  )
}
