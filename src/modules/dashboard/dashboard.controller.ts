import { exportToExcel } from "@/repositories";
import { useNavigate } from "react-router-dom";
import { injectable } from "tsyringe";

@injectable()
export class DashboardController {

  private navigate = useNavigate()

  goToTablePage() {
    this.navigate('/table')
  }

  async report() {
    await exportToExcel()
  }

}
