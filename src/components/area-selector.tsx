import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,  } from "@/components/ui/select";
import { uteKeysList } from "@/entities/EfficiencyRecord";


type props = {
  value: string | undefined
  setValue: (value: string) => void
}

export function AreaSelector({setValue, value}: props) {

  return (
    <Select onValueChange={setValue} value={value} >
      <SelectTrigger className="w-[85px]">
        <SelectValue placeholder="Área" />
      </SelectTrigger>
      <SelectContent>
        {uteKeysList.map((ute, index) => (
          <SelectItem key={index} value={ute}>{ute}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

}
