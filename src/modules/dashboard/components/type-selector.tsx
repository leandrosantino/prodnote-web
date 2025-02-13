import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,  } from "@/components/ui/select";


type props = {
  value: 'month' | 'day'
  setValue: (value: props['value']) => void
}

export function TypeSelector({setValue, value}: props) {

  return (
    <Select onValueChange={val => setValue(val as props['value'])} value={value} >
      <SelectTrigger className="w-[86px]">
        <SelectValue placeholder="Intervalo" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="day" >Diário</SelectItem>
        <SelectItem value="month" >Mensal</SelectItem>
      </SelectContent>
    </Select>
  )

}
