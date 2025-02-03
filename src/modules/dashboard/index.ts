import { container } from "tsyringe";
import { DashboardView } from "./dashborad.view";
import { DashboardController } from "./dashboard.controller";


export function Dashboard() {
  const controller = container.resolve(DashboardController)
  return DashboardView({ controller })
}
