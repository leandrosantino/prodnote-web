import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EfficiencyRecord } from "@/entities/EfficiencyRecord"
import { ReactNode } from "react"

export function LossesReasonDialog({ children, efficiencyRecord }: {children: ReactNode, efficiencyRecord: EfficiencyRecord}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="md:min-w-[700px] md:min-h-[500px] max-sm:h-screen max-sm:w-screen flex flex-col">
        <DialogHeader>
          <DialogTitle>Perdas de Eficiência</DialogTitle>
          <DialogDescription>
            {efficiencyRecord.date.toLocaleDateString()} - {efficiencyRecord.hourInterval} - {efficiencyRecord.productionProcessId}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-auto max-h-[400px]">
          {efficiencyRecord.productionEfficiencyLosses.map((item, index) => (
            <Card key={index} >
              <CardHeader>
                <CardTitle>{item.classification}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{item.description}</p>
                <p>
                  {item.classification === 'Scrap + Quality Issues' ? 'Peças: ' : 'Tempo (min): '}
                  {item.lostTimeInMinutes}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
