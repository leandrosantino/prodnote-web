import { inject, singleton } from "tsyringe";
import * as XLSX from 'xlsx';
import { ProductionRegistryRepository } from "@/repositories/ProductionRegistryRepository";
import { OeeForm } from "@/entities/OeeForm";
import { ProductionRegistry } from "@/entities/ProductionRegistry";
import { ProcessRepository } from "@/repositories/ProcessRepository";
import { supabase } from "@/repositories/supabase";
import { ProductionLosses } from "@/entities/ProductionLosses";

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

    productionregistry.process = process;

    await this.productionRegistryRepository.create(productionregistry.createData)
    return productionregistry;
  }

  async get_production_losses() {
    const { data, error } = await supabase.from('production_losses')
      .select<string, ProductionLosses>('*')

    if (error) throw new Error(`Error fetching data: ${error.message}`);
    return data
  }

  async exportToExcel(): Promise<void> {
    const registries = (await this.productionRegistryRepository.getAll())
      .map(registry => {
        return {
          'id': registry.id,
          'data': registry.created_at.toLocaleDateString(),
          'turno': registry.turn,
          'ute': registry.process.ute,
          'id do processo': registry.process_id,
          'hora': registry.time_tag,
          'processo': registry.process.description,
          'meta (pçs/h)': registry.process.target,
          'projeto': registry.project,
          'peças boas produzidas': registry.pieces_quantity,
          'tempo de produção (min)': registry.interval_in_minutes
        }
      })

    const production_losses = (await this.get_production_losses())
      .map(item => ({
        'id': item.id,
        'causa': item.cause,
        'classificação': item.classification,
        'descrição': item.description,
        'tempo perdido (min)': item.time,
        'id do registro de produção': item.production_registry_id
      }))

    const processes = (await this.processRepository.getAll())
      .map(process => ({
        'id': process.id,
        'descrição': process.description,
        'meta': process.target,
        'ute': process.ute,
      }))

    const workbook = XLSX.utils.book_new();

    const registries_ws = XLSX.utils.json_to_sheet(registries);
    XLSX.utils.book_append_sheet(workbook, registries_ws, 'Registros de Produção');

    const production_losses_ws = XLSX.utils.json_to_sheet(production_losses);
    XLSX.utils.book_append_sheet(workbook, production_losses_ws, 'Paradas');

    const processes_ws = XLSX.utils.json_to_sheet(processes);
    XLSX.utils.book_append_sheet(workbook, processes_ws, 'Processos');

    const fileName = `Relatório de produção.xlsx`
    XLSX.writeFile(workbook, fileName);
  }

}
