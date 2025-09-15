import { component } from "@/lib/@component";
import { ComponentController } from "@/lib/ComponentController";
import { ProductionView } from "./production.view";
import { ComponentView } from "@/lib/ComponentView";


@component(ProductionView)
export class ProductionController extends ComponentController {
  name = "leandro"
}


export default ProductionController.View as ComponentView<ProductionController>
