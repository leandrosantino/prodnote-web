import { Skeleton } from "@/components/ui/skeleton"
import { DashboardController } from "./dashboard.controller"
import { DataCard } from "./components/data-card.view"
import { Factory, Repeat2, Target, Trash2 } from "lucide-react"
import { DailyChart } from "./components/daily-chart"
import { LossReasonChart } from "./components/loss-reason-chart"
import { TopFiveProcessChart } from "./components/top-five-process-chart"


type props = {
  controller: DashboardController
}

export function DashboardView({ controller }: props) {
  return (
    <div className="max-w-[1200px] mx-auto p-4 bg-white shadow-lg rounded-md h-full flex flex-col gap-4" >
      <h2 className='text-3xl font-bold' >Dashboard - Lançamento de OEE</h2>

      <div className="w-full h-12">
        {/* Filtros */}
        <Skeleton className="w-full h-full" />
      </div>

      <div className="w-full h-[100px] flex gap-4">
        <div className="w-1/4 h-full">
          <DataCard label="Produção (pçs)" value="150" Icon={Factory} />
        </div>
        <div className="w-1/4 h-full">
          <DataCard label="Retrabalho (pçs)" value="12" Icon={Repeat2} />
        </div>
        <div className="w-1/4 h-full">
          <DataCard label="Refugo" value="3%" Icon={Trash2} />
        </div>
        <div className="w-1/4 h-full">
          <DataCard label="OEE" value="83%" Icon={Target} />
        </div>
      </div>

      <div className="w-full h-[450px] flex gap-4">
        <div className="w-1/3 h-full">
          <TopFiveProcessChart />
        </div>
        <div className="w-2/3 h-full">
          <LossReasonChart />
        </div>
      </div>

      <div className="w-full h-[250px]" >
        {/* Diário */}
        <DailyChart />
      </div>

    </div>
  )
}
