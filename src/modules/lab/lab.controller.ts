import { component } from "@/lib/@component";
import { ComponentController } from "@/lib/ComponentController";
import { LabView } from "./lab.vew";
import { ComponentView } from "@/lib/ComponentView";
import { useEffect } from "react";
import { inject } from "tsyringe";
import { EfficiencyRecordRepository } from "@/repositories/EfficiencyRecordRepository";
import { ProductionRegistry } from "@/entities/ProductionRegistry";

@component(LabView)
export class LabController extends ComponentController {
  constructor(
    @inject('EfficiencyRecordRepository') private readonly efficiencyRecordRepository: EfficiencyRecordRepository
  ) {
    super();
    useEffect(() => {
      (async () => {
        const data = await this.efficiencyRecordRepository.findMany()

        console.log('Process Data:', JSON.stringify(data, null, 2))
        console.log('Oee:', data[0].oee)
        console.log('lostTime:', data[0].lostTime)

        const a = data[0]

        const b = Object.assign({}, a)
        console.log('teste: ', a)
      })()
    })

  }
}


export default LabController.View as ComponentView<LabController>
