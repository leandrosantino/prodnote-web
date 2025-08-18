import { component } from "@/lib/@component";
import { ComponentController } from "@/lib/ComponentController";
import { LabView } from "./lab.vew";
import { ComponentView } from "@/lib/ComponentView";
import { useEffect } from "react";
import { inject } from "tsyringe";
import { ProductionRegistryRepository } from "@/repositories/ProductionRegistryRepository";
import { ProcessRepository } from "@/repositories/ProcessRepository";

@component(LabView)
export class LabController extends ComponentController {
  constructor(
    @inject('ProductionRegistryRepository') private readonly productionRegistryRepository: ProductionRegistryRepository,
    @inject('ProcessRepository') private readonly processRepository: ProcessRepository
  ) {
    super();
    useEffect(() => {
      (async () => {
        const data = await this.processRepository.getAll();

        console.log('Processes:', data);

      })()
    })

  }
}


export default LabController.View as ComponentView<LabController>
