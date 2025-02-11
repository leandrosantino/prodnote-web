import { inject, injectable } from "tsyringe";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import { hourIntervals, oeeFormSchema, OeeFormType, UteKeys, utePattern } from "@/entities/EfficiencyRecord";
import { ProductionProcess } from "@/entities/ProductionProcess";
import { useStateObject } from "@/lib/useStateObject";

import type { IProductionProcessRepository } from "@/repositories/production-process/IProductionProcessRepository";
import type { IEfficiencyRecordService } from "@/services/efficiency-record/IEfficiencyRecordService";

@injectable()
export class FormController {

  public form = useForm<OeeFormType>({
    resolver: zodResolver(oeeFormSchema),
  })

  public reasonsField = useFieldArray({
    control: this.form.control,
    name: 'reasons',
  })

  public intervals = useStateObject<string[]>(hourIntervals as any)
  public loading = useStateObject(false)
  public processes = useStateObject<ProductionProcess[]>([])
  public processLoad = useStateObject(false)

  private navigate = useNavigate()
  private routeParams = useParams<{ ute: UteKeys }>()

  constructor(
    @inject('ProductionProcessRepository') private readonly productionProcessRepository: IProductionProcessRepository,
    @inject('EfficiencyRecordService') private readonly efficiencyRecordService: IEfficiencyRecordService
  ) {
    useEffect(() => { this.changeHoursInterval() }, [this.form.watch('turn')])
    useEffect(() => { this.getProcessesByUte() }, [this.routeParams.ute])
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
    this.productionProcessRepository.getByUte(this.routeParams.ute)
      .then(data => {
        this.processes.set(data)
        this.processLoad.set(false)
      })
      .catch(console.log)
  }

  handleSave = (data: OeeFormType) => {

    if (this.processes.value.length == 0) return;
    this.loading.set(true)

    if (!this.routeParams.ute || !utePattern.test(this.routeParams.ute)) {
      this.loading.set(false)
      return
    }

    this.efficiencyRecordService.createRecord({
      ...data,
      ute: this.routeParams.ute as UteKeys,
      date: new Date(),
    })
      .then(resp => {
        this.navigate('/success', { state: resp })
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

}

// defaultValues: {
//   piecesQuantity: 100,
//   hourInterval: '06:00-06:59',
//   process: 'cln4toycu008zm5joxd9oeadz',
//   turn: '1',
// }
