import { Button } from './components/Button';
import { FormProvider} from 'react-hook-form';
import { Input } from './components/Input';
import { Select } from './components/Select';
import { Reasons } from './components/Reasons';
import { FormController } from './form.controller';
import { Container } from './components/Container';


export function FromView(controller: FormController) {

  return (
    <Container loading={controller.processLoad.value} >
      <h2 className='text-3xl font-bold mb-8' >Lançamento de OEE</h2>

      <FormProvider {...controller.form} >
        <form
          onKeyDown={e => {if (e.key === "Enter") e.preventDefault()} }
          onSubmit={controller.form.handleSubmit(controller.handleSave)}
          className='flex w-full flex-col gap-4'
        >
          <Select name='turn' label='Turno' options={['1', '2', '3'].map(val => ({value: val, label: val}))} />
          <Select name='hourInterval' label='Hora' options={controller.intervals.value.map(val => ({value: val, label: val}))} />

          <Select name='process' label='Processo de produção' loading={controller.processLoad.value} options={
            controller.processes.value.map(val => ({value: String(val.id) ?? '', label: val.description }))
          } />

          <Select name='project' loading={controller.processLoad.value} label='Projeto' options={
            controller.projectList.value.map(val => ({value: val, label: val}))
          } />

          <Input type='number' name='piecesQuantity' label='Quantidade de Peças Boas:' />


          {controller.lostTime.value < -3 || controller.lostPieces.value < -3?<>
            <div className='text-red-500' >Apontamento Inconsistente!!! Verifique os dados.</div>
          </>:<>
            <div className='text-red-500' >
              Tempo perdido: {controller.lostTime.value + ' min '} <br />
              Peças perdidas: {controller.lostPieces.value + ' pçs'}
            </div>
          </>
          }

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

          <Button loading={controller.loading.value} color='green' type='submit' text='Save' />

        </form>
      </FormProvider>
    </Container>
  );
}
