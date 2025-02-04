import { exportToExcel } from "@/repositories";
import { injectable } from "tsyringe";

@injectable()
export class DashboardController {

  async report() {
    await exportToExcel()
  }

}
