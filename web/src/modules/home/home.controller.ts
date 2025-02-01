import { singleton } from "tsyringe";
import { hourIntervals, oeeFormSchema, OeeFormType, ProductionEfficiencyRecord, utePattern } from "../../entities/ProductionEfficiencyRecord";
import { useFieldArray, UseFieldArrayReturn, useForm, UseFormReturn } from "react-hook-form";
import { ProductionProcess } from "../../entities/ProductionProcess";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { createEfficiencyRecord, getProcesses } from "../../repositories";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";


type State<T> = [T, React.Dispatch<React.SetStateAction<T>>]

@singleton()
export class HomeController {

  constructor() { }

  private form!: UseFormReturn<OeeFormType>
  private processesState!: State<ProductionProcess[]>

  private processLoadState!: State<boolean>
  loadingState!: State<boolean>
  private navigate!: NavigateFunction

  reasonsField!: UseFieldArrayReturn<OeeFormType, "reasons", "id">

  private routeParams!: Readonly<Partial<{ ute: ProductionEfficiencyRecord["ute"]; }>>

  useHourIntervals() {
    const [intervals, setIntervals] = useState<string[]>(hourIntervals as any)

    useEffect(() => {
      const turn = this.form.watch('turn')
      if (turn == '') return

      switch (turn) {
        case '3': setIntervals(hourIntervals.slice(0, 5)); break;
        case '1': setIntervals(hourIntervals.slice(5, 15)); break;
        case '2': setIntervals(hourIntervals.slice(15, 25)); break;
        default: break;
      }

    }, [this.form.watch('turn')])
    return intervals
  }

  useProcesses() {
    this.navigate = useNavigate()
    this.routeParams = useParams()
    const { ute } = this.routeParams

    this.processLoadState = useState(false)
    this.processesState = useState<ProductionProcess[]>([])
    this.loadingState = useState(false)

    const [isProcessLoad, setIsProcesLoad] = this.processLoadState
    const [processes, setProcesses] = this.processesState
    const [loading] = this.loadingState

    useEffect(() => {
      if (!ute) return
      if (!utePattern.test(ute)) return
      setIsProcesLoad(false)
      getProcesses(ute).then(data => {
        setProcesses(data)
        setIsProcesLoad(true)
      })
    }, [ute])

    return {
      isProcessLoad, processes, loading
    }

  }

  handleSave = (data: OeeFormType) => {
    const [_, setLoading] = this.loadingState
    const [processes, __] = this.processesState

    if (processes.length == 0) return;
    setLoading(true)

    if (!this.routeParams.ute || !utePattern.test(this.routeParams.ute)) {
      setLoading(false)
      return
    }

    createEfficiencyRecord({
      ...data,
      ute: this.routeParams.ute,
      productionTimeInMinutes: 60,
      date: new Date(),
    })
      .then(resp => {
        this.navigate('success', { state: resp })
      })
      .catch(e => console.log((e as Error)))
      .finally(() => { setLoading(false) })
  }


  useOeeForm() {
    this.form = useForm<OeeFormType>({
      resolver: zodResolver(oeeFormSchema),
      defaultValues: {
        // piecesQuantity: 100,
        // hourInterval: '06:00-06:59',
        // process: 'cln4toycu008zm5joxd9oeadz',
        // turn: '1',
        // =======================
      }
    })

    this.reasonsField = useFieldArray({
      control: this.form.control,
      name: 'reasons',
    })


    return this.form
  }

  addNewReason() {
    this.reasonsField.append({ class: '', description: '', time: 0 })
  }

  removeReason(index: number) {
    this.reasonsField.remove(index)
  }

}


// date: '2025-01-02',
// productionTimeInMinutes: 528,
// piecesQuantity: 100,
// name: 'Leandro',
// process: 'cln4toycu008zm5joxd9oeadz',
// turn: '1',
// ute: 'UTE-1'
