import { Button } from '../components/Button';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../components/Input';
import { Select } from '../components/Select';

import {oeeFormSchema, OeeFormType, uteKeysList} from '../entities/ProductionEfficiencyRecord'
import { useEffect, useState } from 'react';
import { ProductionProcess } from '../entities/ProductionProcess';
import { Reasons } from '../components/Reasons';
import { useNavigate } from 'react-router-dom';
import { createEfficiencyRecord, getProcesses } from '../repositories';

export type SuccessData = {
  processName: string
  piecesQuantity: number
  totalReasonsTime: number
  totalScrap: number
  totalRework: number
  oee: number
}

export function Home() {
  const navigate = useNavigate()

  const oeeForm = useForm<OeeFormType>({
    resolver: zodResolver(oeeFormSchema),
    defaultValues: {
      date: '',
      productionTimeInMinutes: 0,
      piecesQuantity: 0,
      name: '',
      process: '',
      turn: '',
      ute: ''
    }
  })

  // date: '2025-01-02',
  // productionTimeInMinutes: 528,
  // piecesQuantity: 100,
  // name: 'Leandro',
  // process: 'cln4toycu008zm5joxd9oeadz',
  // turn: '1',
  // ute: 'UTE-1'

  const { handleSubmit, control, watch } = oeeForm

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'reasons',
  })

  const [isProcessLoad, setIsProcesLoad] = useState(false)
  const [loading, setLoading] = useState(false)

  const [processes, setProcesses] = useState<ProductionProcess[]>([])
  useEffect(() => {
    setIsProcesLoad(false)
    getProcesses(watch('ute')).then(data => {
      setProcesses(data)
      setIsProcesLoad(true)
    })
  }, [watch('ute')])

  function handleSave(data: OeeFormType){
    if(processes.length == 0) return;
    setLoading(true)
    console.log(JSON.stringify(data, null, 2))

    createEfficiencyRecord(data)
      .then(resp => {
        navigate('success', {state: resp } )
      })
      .catch(e => console.log((e as Error).message))
  }

  function addNewReason(){
    append({class: '', description: '', time: 0})
  }

  function removeReason(index: number){
    remove(index)
  }

  return (
    <div className="max-w-2xl mx-auto p-4  pb-24 bg-white shadow-lg rounded-md space-y-8" >
      <h2 className='text-3xl font-bold mb-8' >Lançamento de OEE</h2>

      <FormProvider {...oeeForm} >
        <form
          onKeyDown={e => {if (e.key === "Enter") e.preventDefault()} }
          onSubmit={handleSubmit(handleSave)}
          className='flex w-full flex-col gap-4'
        >
          <Input type='date' name='date' label='Data' placeholder='Selecione a Data' />
          <Select name='turn' label='Turno' options={['1', '2', '3'].map(val => ({value: val, label: val}))} />
          <Input type='text' name='name' label='Nome' placeholder='Informe o seu nome' />
          <Select name='ute' label='UTE' options={uteKeysList.map(val => ({value: val, label: val}))} />

          <Select name='process' label='Processo de produção' loading={!isProcessLoad} options={
            processes.map(val => ({value: val.id ?? '', label: val.description }))
          } />

          <Input type='number' name='productionTimeInMinutes' label='Tempo planejado (minutos):' />
          <Input type='number' name='piecesQuantity' label='Quantidade de Peças Boas:' />

          <div className="flex flex-col gap-2">
            <label className="mb-1 font-medium">Perdas de Eficiência:</label>
            {fields.map((field, index) => (
              <Reasons key={field.id} index={index} onRemove={() => removeReason(index)} />
            ))}
            <Button
              color='blue' type='button' text='Adicionar Perda'
              onClick={addNewReason}
            />
          </div>

          <Button {...{loading}} color='green' type='submit' text='Save' />



        </form>
      </FormProvider>


    </div>
  );
}
