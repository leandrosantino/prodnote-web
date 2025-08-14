import { inject, singleton } from "tsyringe";
import * as XLSX from 'xlsx';
import { EfficiencyRecordRepository } from "@/repositories/EfficiencyRecordRepository";
import { ProductionProcessRepository } from "@/repositories/ProductionProcessRepository";
import { CreateEfficiencyRecordRequestDTO, CreateEfficiencyRecordResponseDTO } from "@/entities/OeeForm";

@singleton()
export class EfficiencyRecordService {

  constructor(
    @inject('ProductionProcessRepository') private readonly productionProcessRepository: ProductionProcessRepository,
    @inject('EfficiencyRecordRepository') private readonly efficiencyRecordRepository: EfficiencyRecordRepository
  ) { }

  async createRecord(efficiencyRecordData: CreateEfficiencyRecordRequestDTO): Promise<CreateEfficiencyRecordResponseDTO> {
    return [] as any
  }

  // async exportToExcel(): Promise<void> {
  //   const counts = (await this.efficiencyRecordRepository.getAll())
  //     .map(count => {
  //       return {
  //         'Data': count.created_at.toLocaleDateString(),
  //         'Turno': count.turn,
  //         // 'UTE': count.ute,
  //         'Hora': count.time_tag,
  //         'Processo': count.process_id,
  //         'Peças Boas': count.pieces_quantity,
  //         // 'OEE-hora': count.oeeValue,
  //       }
  //     })
  //   const worksheet = XLSX.utils.json_to_sheet(counts);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
  //   const fileName = `Relatório de produção.xlsx`
  //   XLSX.writeFile(workbook, fileName);
  // }

}
