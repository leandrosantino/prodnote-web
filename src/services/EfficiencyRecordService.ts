import { inject, singleton } from "tsyringe";
import * as XLSX from 'xlsx';
import { ProductionRegistryRepository } from "@/repositories/ProductionRegistryRepository";
import { OeeForm } from "@/entities/OeeForm";
import { ProductionRegistry } from "@/entities/ProductionRegistry";
import { ProductionLosses } from "@/entities/ProductionLosses";

@singleton()
export class ProductionRegistryService {

  constructor(
    @inject('EfficiencyRecordRepository') private readonly productionRegistryRepository: ProductionRegistryRepository
  ) { }

  async createRecord(formData: OeeForm) {
    const interval_in_minutes = 60
    const production_losses: ProductionLosses[] = []

    const productionregistry = new ProductionRegistry({
      process_id: formData.process,
      interval_in_minutes,
      pieces_quantity: formData.piecesQuantity,
      production_losses,
      project: '',
      time_tag: formData.hourInterval,
      turn: formData.turn
    })

    await this.productionRegistryRepository.create(productionregistry.createData)


  }

  async exportToExcel(): Promise<void> {
    const counts = (await this.productionRegistryRepository.findMany())
      .map(count => {
        return {
          'Data': count.created_at.toLocaleDateString(),
          'Turno': count.turn,
          'UTE': count.process.ute,
          'Hora': count.time_tag,
          'Processo': count.process_id,
          'Peças Boas': count.pieces_quantity,
          'OEE-hora': count.oee,
        }
      })
    const worksheet = XLSX.utils.json_to_sheet(counts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
    const fileName = `Relatório de produção.xlsx`
    XLSX.writeFile(workbook, fileName);
  }

}
