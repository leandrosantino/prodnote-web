import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type props = {
  value: string | undefined
  setValue: (value: string) => void
}

export function TurnSelector({ value, setValue }: props) {

  return (
    <Select onValueChange={setValue} value={value} >
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Turno" />
      </SelectTrigger>
      <SelectContent>
        {['1', '2', '3'].map((turn, index) => (
          <SelectItem key={index} value={turn}>{turn}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

}
