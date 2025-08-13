import { component } from "@/lib/@component";
import { ComponentController } from "@/lib/ComponentController";
import { LabView } from "./lab.vew";
import { ComponentView } from "@/lib/ComponentView";
import { supabase } from "@/repositories/supabase";
import { useEffect } from "react";


@component(LabView)
export class LabController extends ComponentController {
  constructor() {
    super();
    useEffect(() => {
      (async () => {
        const { data } = await supabase
          .from('process')
          .select()

        console.log('Process Data:', data);
      })()
    })

  }
}


export default LabController.View as ComponentView<LabController>
