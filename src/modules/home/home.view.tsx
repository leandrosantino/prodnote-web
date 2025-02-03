import { Button } from '../../components/Button';
import { FormProvider} from 'react-hook-form';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Reasons } from '../../components/Reasons';
import { HomeController } from './home.controller';

export type SuccessData = {
  processName: string
  piecesQuantity: number
  totalReasonsTime: number
  totalScrap: number
  totalRework: number
  oee: number
  ute: string
}

type props = {
  controller: HomeController
}

export function HomeView({ controller }: props) {

  const oeeForm = controller.useOeeForm()
  const {isProcessLoad, loading, processes} = controller.useProcesses()
  const hourIntervals = controller.useHourIntervals()

  return (
    <div className="max-w-2xl mx-auto p-4  pb-24 bg-white shadow-lg rounded-md space-y-8" >
      <h2 className='text-3xl font-bold mb-8' >Lançamento de OEE</h2>

      <FormProvider {...oeeForm} >
        <form
          onKeyDown={e => {if (e.key === "Enter") e.preventDefault()} }
          onSubmit={oeeForm.handleSubmit(controller.handleSave)}
          className='flex w-full flex-col gap-4'
        >
          <Select name='turn' label='Turno' options={['1', '2', '3'].map(val => ({value: val, label: val}))} />
          <Select name='hourInterval' label='Hora' options={hourIntervals.map(val => ({value: val, label: val}))} />

          <Select name='process' label='Processo de produção' loading={!isProcessLoad} options={
            processes.map(val => ({value: val.id ?? '', label: val.description }))
          } />

          {/* <Input type='number' name='productionTimeInMinutes' label='Tempo planejado (minutos):' /> */}
          <Input type='number' name='piecesQuantity' label='Quantidade de Peças Boas:' />

          <div className="flex flex-col gap-2">
            <label className="mb-1 font-medium">Perdas de Eficiência:</label>
            {controller.reasonsField.fields.map((field, index) => (
              <Reasons key={field.id} index={index} onRemove={() => controller.removeReason(index)} />
            ))}
            <Button
              color='blue' type='button' text='Adicionar Perda'
              onClick={() => controller.addNewReason()}
            />
          </div>

          <Button {...{loading}} color='green' type='submit' text='Save' />

        </form>
      </FormProvider>
    </div>
  );
}
