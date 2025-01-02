import { Trash2 } from "lucide-react";
import { Select } from "./Select";
import { classificationTypesMap } from "../entities/ProductionEfficiencyLoss";
import { Input } from "./Input";
import { useFormContext } from "react-hook-form";
import { OeeFormType } from "../entities/ProductionEfficiencyRecord";
import { useEffect, useState } from "react";


export function Reasons({index, onRemove}: {index: number, onRemove: () => void }){

  const {watch} = useFormContext<OeeFormType>()

  const [timeLabel, setTimeLabel] = useState('Tempo:')

  useEffect(()=>{
    if(
      watch(`reasons.${index}.class`) == 'Refugo' ||
      watch(`reasons.${index}.class`) == 'Retrabalho'
    ){
      setTimeLabel('Peças:')
      return
    }
    setTimeLabel('Tempo:')
  }, [watch(`reasons.${index}.class`)])


  return (
    <div className="flex flex-col w-full gap-2 border border-zinc-400 rounded-lg p-2">
      <Select label="Grupo" name={`reasons.${index}.class`} options={Object.keys(classificationTypesMap).map(val => ({label: val, value: val}))} />
      <Input label="Descrição" name={`reasons.${index}.description`} type="text" />
      <div className='flex gap-2 flex-1 justify-center items-end'>
        <Input label={timeLabel} name={`reasons.${index}.time`} type="number" />
        <button
          type='button'
          className='flex items-center justify-center text-red-500 p-2 bg-red-100 rounded-md hover:bg-red-200'
          onClick={() => onRemove()}
        >
          <Trash2 />
        </button>
      </div>
    </div>
  )
}
