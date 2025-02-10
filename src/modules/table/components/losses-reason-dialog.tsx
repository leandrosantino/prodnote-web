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
      <DialogContent className="md:min-w-[700px] md:min-h-[400px] max-sm:h-screen max-sm:w-screen flex flex-col">
        <DialogHeader>
          <DialogTitle>Perdas de Eficiência</DialogTitle>
          <DialogDescription>
            {new Date(efficiencyRecord.date).toLocaleDateString()} - {efficiencyRecord.hourInterval} - {efficiencyRecord.process.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-auto max-h-[300px]">
          {
            (efficiencyRecord?.productionEfficiencyLosses?.length ?? 0) === 0 ?
            <>
              <span className="text-muted-foreground w-full h-[200px] flex justify-center items-center" >Nenhuma perda apontada...</span>
            </> :
            efficiencyRecord.productionEfficiencyLosses.map(({efficiencyLoss: item}, index) => (
                <Card key={index} >
                  <CardHeader>
                    <CardTitle>{item.cause ?? item.classification}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{item.description}</p>
                    <p>
                      {item.classification === 'Scrap + Quality Issues' ? 'Peças: ' : 'Tempo (min): '}
                      {item.lostTimeInMinutes}
                    </p>
                  </CardContent>
                </Card>
              ))
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}
