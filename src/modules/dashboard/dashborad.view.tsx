import { DashboardController } from "./dashboard.controller"
import { DataCard } from "./components/data-card"
import { Download, Factory, Repeat2, Table, Target, Trash2 } from "lucide-react"
import { DailyChart } from "./components/daily-chart"
import { LossReasonChart } from "./components/loss-reason-chart"
import { TopFiveProcessChart } from "./components/top-five-process-chart"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "./components/date-range-picker"

type props = {
  controller: DashboardController
}

export function DashboardView({ controller }: props) {
  return (
    <div className="max-w-[1200px] mx-auto p-4 bg-white shadow-lg rounded-md h-full flex flex-col gap-2 overflow-auto" >
      <h2 className='text-3xl font-bold max-md:text-2xl' >Dashboard - Lançamento de OEE</h2>

      <div className="w-full h-12 flex justify-between items-center">
        <div>
          <DateRangePicker />
        </div>
        <div className="flex gap-2" >
          <Button onClick={() => controller.goToTablePage() } variant='outline'> Dados <Table /> </Button>
          <Button onClick={() => controller.report()}> Relatório <Download /> </Button>
        </div>
      </div>

      <div className="w-full grid gap-2 grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <div>
          <DataCard label="Produção (pçs)" value={controller.totalOfProduction.value} Icon={Factory} />
        </div>
        <div>
          <DataCard label="Retrabalho (pçs)" value={controller.totalOfRework.value} Icon={Repeat2} />
        </div>
        <div>
          <DataCard label="Refugo" value={controller.totalOfScrap.value} Icon={Trash2} />
        </div>
        <div>
          <DataCard label="OEE" value={controller.oeeValue.value} Icon={Target} />
        </div>
      </div>

      <div className="w-full grid grid-cols-[43%_auto] grid-rows-[380px] gap-2 max-lg:grid-cols-1">
        <div className="">
          <TopFiveProcessChart data={controller.topFiveProcessChartData.value} />
        </div>
        <div className="">
          <LossReasonChart data={controller.lossReasonChartData.value} />
        </div>
      </div>

      <div className="w-full h-[250px]" >
        {/* Diário */}
        <DailyChart data={controller.dailyChartData.value} />
      </div>

    </div>
  )
}
