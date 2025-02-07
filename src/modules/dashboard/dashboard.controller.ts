import type { IEfficiencyRecordService } from "@/services/efficiency-record/IEfficiencyRecordService";
import { useNavigate } from "react-router-dom";
import { inject, injectable } from "tsyringe";

@injectable()
export class DashboardController {

  private navigate = useNavigate()

  constructor(
    @inject('EfficiencyRecordService') private readonly efficiencyRecordService: IEfficiencyRecordService
  ) { }

  goToTablePage() {
    this.navigate('/table')
  }

  async report() {
    await this.efficiencyRecordService.exportToExcel()
  }

}
