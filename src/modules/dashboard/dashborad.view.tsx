import { DashboardController } from "./dashboard.controller"
import { DataCard } from "./components/data-card"
import { Download, FilterX, OctagonX, Repeat2, Table, Target, Trash2 } from "lucide-react"
import { DailyChart } from "./components/daily-chart"
import { LossReasonChart } from "./components/loss-reason-chart"
import { TopFiveProcessChart } from "./components/top-five-process-chart"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/date-picker"
import { TypeSelector } from "./components/type-selector"
import { AreaSelector } from "@/components/area-selector"
import { TurnSelector } from "@/components/turn-selector"
import { ProcessSelector } from "@/components/process-selector"
import { ChartsSkeleton } from "./components/skeleton"

type props = {
  controller: DashboardController
}

export function DashboardView({ controller }: props) {
  return (
    <div className="max-w-[1200px] mx-auto p-4 bg-white shadow-lg rounded-md h-full flex flex-col gap-2 overflow-auto" >
      <h2 className='text-3xl font-bold max-md:text-2xl' >Dashboard - Lançamento de OEE</h2>

      <div className="w-full flex justify-between items-center py-3" >
        <div className="flex gap-2 flex-wrap" >
          <div className="flex gap-2 flex-wrap" >
            <DatePicker date={controller.dateFilter.value} setDate={controller.dateFilter.set} />
            <TypeSelector value={controller.typeFilter.value} setValue={controller.typeFilter.set} />
            <AreaSelector key={controller.areaFilterKey.value} setValue={controller.areaFilter.set} value={controller.areaFilter.value}  />
            <TurnSelector key={controller.turnFilterKey.value} setValue={controller.turnFilter.set} value={controller.turnFilter.value}  />
          </div>
          <div className="flex gap-2 flex-wrap" >
            <ProcessSelector
              processes={controller.processes.value}
              value={controller.processFilter.value}
              setValue={controller.processFilter.set}
            />
            <Button
              variant='ghost'
              className="text-red-600 hover:text-red-600 hover:bg-red-50 active:bg-red-100"
              onClick={ () => {controller.handleClearFilters()} }
            > <FilterX /> </Button>
            <Button onClick={() => controller.goToTablePage() } variant='outline'> Dados <Table /> </Button>
            <Button onClick={() => controller.report()}> Relatório <Download /> </Button>
          </div>
        </div>
      </div>

      {controller.loading.value?<>
        <ChartsSkeleton />
      </>:<>
        <div className="w-full grid gap-2 grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <div>
            <DataCard label="Breakdowns" value={controller.totalOfBreakdowns.value} Icon={OctagonX} />
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
          <DailyChart data={controller.dailyChartData.value} />
        </div>
      </>}

    </div>
  )
}
