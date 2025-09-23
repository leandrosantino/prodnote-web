import { component } from "@/lib/@component";
import { ComponentController } from "@/lib/ComponentController";
import { ProductionView } from "./production.view";
import { ComponentView } from "@/lib/ComponentView";
import { ProductionRegistry } from "@/entities/ProductionRegistry";
import { UteKeys } from "@/entities/Ute";
import { useParams, useNavigate } from "react-router-dom";
import { HourIntervals, hourIntervals } from "@/entities/HoursIntervals";
import { useEffect } from "react";
import { ProductionRegistryRepository } from "@/repositories/ProductionRegistryRepository";
import { inject } from "tsyringe";
import { set, subDays } from "date-fns";


@component(ProductionView)
export class ProductionController extends ComponentController {

  public params = useParams<{ ute: UteKeys }>()
  public navigate = useNavigate()
  public data = this.useState<Record<HourIntervals, Partial<ProductionRegistry>>>()


  constructor(
    @inject('ProductionRegistryRepository') private readonly productionRegistryRepository: ProductionRegistryRepository,
  ) {
    super()
    useEffect(() => {
      (async () => {
        const temp: ProductionController['data']['value'] = {} as any
        const registries = await this.productionRegistryRepository.findMany({
          createdAtStart: subDays(set(new Date(), { hours: 0, minutes: 0, seconds: 0 }), 1),
          createdAtEnd: subDays(set(new Date(), { hours: 23, minutes: 59, seconds: 59 }), 1),
          process_id: 29
        })

        console.log(registries)

        hourIntervals.forEach(item => {
          temp[item] = {}
        })

        registries.forEach(item => {
          temp[item.time_tag] = item
        })

        this.data.set(temp)
      })()
    }, [])
  }

}


export default ProductionController.View as ComponentView<ProductionController>
