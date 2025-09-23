import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode } from "react"
import { TableData } from "../table-columns"

export function LossesReasonDialog({ children, efficiencyRecord }: {children: ReactNode, efficiencyRecord: TableData}) {

  if(!efficiencyRecord.process) return children

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="md:min-w-[700px] md:min-h-[400px] max-sm:h-screen max-sm:w-screen flex flex-col">
        <DialogHeader>
          <DialogTitle>Perdas de Eficiência</DialogTitle>
          { efficiencyRecord.created_at &&
            <DialogDescription>
              {efficiencyRecord?.created_at?.toLocaleDateString()} - {efficiencyRecord?.time_tag} - {efficiencyRecord?.process_id}
            </DialogDescription>
          }
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-auto max-h-[300px]">
          {
            efficiencyRecord?.production_losses?.length === 0 ?
            <>
              <span className="text-muted-foreground w-full h-[200px] flex justify-center items-center" >Nenhuma perda apontada...</span>
            </> :
            efficiencyRecord?.production_losses?.map((item, index) => (
              <Card key={index} >
                <CardHeader>
                  <CardTitle>{item.cause ?? item.classification}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{item.description}</p>
                  <p>
                    Tempo: <span className="font-medium" > {item.time.toFixed(0)} min </span>
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
