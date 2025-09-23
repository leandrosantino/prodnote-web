import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { inject } from "tsyringe";

import { Process } from "@/entities/Process";
import { useStateObject } from "@/lib/useStateObject";

import { hourIntervals } from "@/entities/HoursIntervals";
import { OeeForm, oeeFormSchema } from "@/entities/OeeForm";
import { UteKeys, utePattern } from "@/entities/Ute";
import { component } from "@/lib/@component";
import { ComponentController } from "@/lib/ComponentController";
import { ComponentView } from "@/lib/ComponentView";
import { ProcessRepository } from "@/repositories/ProcessRepository";
import { ProductionRegistryService } from "@/services/ProductionRegistryService";
import { FromView } from "./form.view";
import { ProductionRegistry } from "@/entities/ProductionRegistry";

@component(FromView)
export class FormController extends ComponentController {

  public form = useForm<OeeForm>({
    resolver: zodResolver(oeeFormSchema),
  })

  public reasonsField = useFieldArray({
    control: this.form.control,
    name: 'reasons',
  })

  public intervals = useStateObject<string[]>(hourIntervals as any)
  public loading = useStateObject(false)
  public processes = useStateObject<Process[]>([])
  public processLoad = useStateObject(false)
  public projectList = useStateObject<string[]>([])

  public lostTime = useStateObject(0)
  public lostPieces = useStateObject(0)

  private navigate = useNavigate()
  private routeParams = useParams<{ ute: UteKeys }>()

  private reasons = useWatch({
    control: this.form.control,
    name: "reasons"
  })


  constructor(
    @inject('ProcessRepository') private readonly processRepository: ProcessRepository,
    @inject('ProductionRegistryService') private readonly productionRegistryService: ProductionRegistryService
  ) {
    super()

    useEffect(() => { this.changeHoursInterval() }, [this.form.watch('turn')])
    useEffect(() => { this.getProcessesByUte() }, [this.routeParams.ute])
    useEffect(() => { this.cahngeProjectLists() }, [this.form.watch('process')])
    useEffect(() => { this.calculateLosses() }, [
      this.form.watch('piecesQuantity'),
      this.reasons
    ])
  }

  private calculateLosses() {
    const oeeFormData = Object.assign({}, this.form.getValues())
    oeeFormData.reasons = this.formatReasons(oeeFormData)
    const process = this.findProcessById(this.form.watch('process'))
    if (!process) return

    const productionRegistry = ProductionRegistry.fromOeeForm(oeeFormData)
    productionRegistry.process = process

    const lostTime = productionRegistry.lostTime - productionRegistry.totalReasonsTime
    this.lostTime.set(lostTime)
    this.lostPieces.set(ProductionRegistry.convertLostTimeToPieces({
      lost_time: lostTime,
      target: process.target
    }))
  }

  private cahngeProjectLists() {
    const process = this.findProcessById(this.form.watch('process'))
    if (!process) return
    this.projectList.set(process.projects)
  }

  private changeHoursInterval() {
    const turn = this.form.watch('turn')
    if (turn == '') return

    switch (turn) {
      case '3': this.intervals.set(hourIntervals.slice(0, 5)); break;
      case '1': this.intervals.set(hourIntervals.slice(5, 15)); break;
      case '2': this.intervals.set(hourIntervals.slice(15, 25)); break;
      default: break;
    }
  }

  private getProcessesByUte() {
    this.processLoad.set(true)
    if (!this.routeParams.ute) return
    if (!utePattern.test(this.routeParams.ute)) return
    this.processRepository.getByUte(this.routeParams.ute)
      .then(data => {
        this.processes.set(data)
        this.processLoad.set(false)
      })
      .catch(console.log)
  }

  handleSave = (data: OeeForm) => {
    if (this.processes.value.length == 0) return;
    this.loading.set(true)

    if (!this.routeParams.ute || !utePattern.test(this.routeParams.ute)) {
      this.loading.set(false)
      return
    }

    data.reasons = this.formatReasons(data)
    this.productionRegistryService.createRecord(data)
      .then(() => {
        this.navigate(`/${this.routeParams.ute}/${data.process}`, { state: { time_tag: data.hourInterval } })
      })
      .catch(e => console.log((e as Error)))
      .finally(() => { this.loading.set(false) })
  }

  addNewReason() {
    this.reasonsField.append({ class: '', description: '', time: 0 })
  }

  removeReason(index: number) {
    this.reasonsField.remove(index)
  }

  private findProcessById(id: string) {
    return this.processes.value.find(item => item.id == Number(id))
  }

  private formatReasons(oeeFormData: OeeForm) {
    return oeeFormData.reasons.map(item => {
      const ni = Object.assign({}, item)
      ni.time = Number(ni.time)
      if (ni.class == 'Refugo' || ni.class == 'Retrabalho') {
        const a = ProductionRegistry.convertPiecesToLostTime({
          pieces_quantity: ni.time,
          target: this.findProcessById(this.form.watch('process'))?.target!
        })
        ni.time = a
      }
      return ni
    })
  }

}

export default FormController.View as ComponentView<FormController>

// defaultValues: {
//   piecesQuantity: 100,
//   hourInterval: '06:00-06:59',
//   process: 'cln4toycu008zm5joxd9oeadz',
//   turn: '1',
// }
