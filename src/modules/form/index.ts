import { container } from "tsyringe";
import { FromView } from "./form.view";
import { FormController } from "./form.controller";

export function Form() {
  const controller = container.resolve(FormController)
  return FromView({ controller })
}
