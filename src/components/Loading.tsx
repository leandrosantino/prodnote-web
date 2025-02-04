import { Spinner } from "./Spinner";

export function Loading(){
  return (
    <div className="flex items-center justify-center h-full gap-2">
      <Spinner />
      <span className="font-medium text-muted-foreground" >Carregando...</span>
    </div>
  )
}
