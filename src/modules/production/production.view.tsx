import { useNavigate, useParams } from "react-router-dom";
import { ProductionController } from "./production.controller";
import { UteKeys } from "@/entities/Ute";
import { Button } from "@/components/ui/button";
import { ProductionRegistry } from "@/entities/ProductionRegistry";


export function ProductionView(controller: ProductionController) {

  const {ute} = useParams<{ ute: UteKeys }>()
  const navigate = useNavigate()

  const data: ProductionRegistry[] = new Array(10).fill({
    id: 1,
    created_at: new Date(),
    process: { id: 1, description: 'Processo 1', target: 100, ute: 'UTE-1', projects:['226'] },
    process_id: 1,
    project: '226',
    turn: '1',
    pieces_quantity: 10,
    interval_in_minutes: 10,
    time_tag: '06:00-06:59',
    production_losses: [
      { id: 1, classification: 'parada', reason: 'Setup', minutes: 2, scrap: 3 },
      { id: 1, classification: 'parada', reason: 'Setup', minutes: 2, scrap: 3 },
      { id: 1, classification: 'parada', reason: 'Setup', minutes: 2, scrap: 3 },
      { id: 1, classification: 'parada', reason: 'Setup', minutes: 2, scrap: 3 },
      { id: 1, classification: 'parada', reason: 'Setup', minutes: 2, scrap: 3 },
      { id: 1, classification: 'parada', reason: 'Setup', minutes: 2, scrap: 3 },
    ],
    createData: {} as any,
    lostTime: 0,
    oee: 0.6,
    totalReasonsTime: 0,
    totalScrap: 0
  })

  return (
    <div className="max-w-[1200px] mx-auto p-4 bg-white shadow-lg rounded-md h-full flex flex-col gap-2 overflow-auto" >

      <header className="flex justify-between" >
        <h1 className="text-2xl font-bold" >Quadro Hora à Hora - Processo 1 - {ute}</h1>
        <Button onClick={() => navigate('/form/' + ute)} >Laçamento</Button>
      </header>

      <section>
          <table className="w-full table-auto text-center border border-zinc-500">
            <thead>
              <tr>
                <th className="border border-black px-4 py-2">Hora</th>
                <th className="border border-black px-4 py-2">Target</th>
                <th className="border border-black px-4 py-2">Produzido</th>
                <th className="border border-black px-4 py-2">Perdas</th>
                <th className="border border-black px-4 py-2">Tempo perdido</th>
                <th className="border border-black px-4 py-2">Peças perdidas</th>
                <th className="border border-black px-4 py-2">OEE</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (<>
                <tr key={index}>
                  <td rowSpan={item.production_losses.length} className="border border-black px-4 py-2 align-top">
                    06:29
                  </td>
                  <td rowSpan={item.production_losses.length} className="border border-black px-4 py-2 align-top">
                    10
                  </td>
                  <td rowSpan={item.production_losses.length} className="border border-black px-4 py-2 align-top">
                    10
                  </td>
                  <td className="border border-black px-4 py-2"></td>
                  <td rowSpan={item.production_losses.length} className="border border-black px-4 py-2 align-top">
                    2
                  </td>
                  <td rowSpan={item.production_losses.length} className="border border-black px-4 py-2 align-top">
                    3
                  </td>
                  <td rowSpan={item.production_losses.length} className="border border-black px-4 py-2 align-top">
                    60%
                  </td>
                </tr>
                {item.production_losses.slice(1).map((loss, lossIndex) => (<>
                  <tr key={index+ lossIndex}>
                    <td className="border border-black px-4 py-2">

                    </td>
                  </tr>
                </>))}
              </>))}
            </tbody>
          </table>
      </section>

    </div>
  )
}
