import { container } from "tsyringe";
import { TableView } from "./table.view";
import { TableController } from "./table.controller";

export function Table() {
  const controller = container.resolve(TableController)
  return TableView({ controller })
}
