import { inject, singleton } from "tsyringe";
import * as XLSX from 'xlsx';
import { ProductionRegistryRepository } from "@/repositories/ProductionRegistryRepository";
import { OeeForm } from "@/entities/OeeForm";
import { ProductionRegistry } from "@/entities/ProductionRegistry";
import { ProcessRepository } from "@/repositories/ProcessRepository";

@singleton()
export class ProductionRegistryService {

  constructor(
    @inject('ProductionRegistryRepository') private readonly productionRegistryRepository: ProductionRegistryRepository,
    @inject('ProcessRepository') private readonly processRepository: ProcessRepository
  ) { }

  async createRecord(formData: OeeForm) {
    const productionregistry = ProductionRegistry.fromOeeForm(formData);

    const process = await this.processRepository.getById(productionregistry.process_id);

    if (!process) return

    productionregistry.production_losses.forEach(item => {
      if (item.classification === 'Scrap + Quality Issues') {
        item.time = ProductionRegistry.convertPiecesToLostTime({
          pieces_quantity: item.time,
          target: process.target
        })
      }
    })

    await this.productionRegistryRepository.create(productionregistry.createData)
    return productionregistry;
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
