import { inject, singleton } from "tsyringe";
import * as XLSX from 'xlsx';

import { CreateEfficiencyRecordRequestDTO, CreateEfficiencyRecordResponseDTO, IEfficiencyRecordService } from "./IEfficiencyRecordService";
import { classificationTypesMap, ClassificationTypes } from "@/entities/EfficiencyLoss";
import type { CreateEfficiencyRecordRepositoryDTO, IEfficiencyRecordRepository } from "@/repositories/efficiency-record/IEfficiencyRecordRepository";
import type { IProductionProcessRepository } from "@/repositories/production-process/IProductionProcessRepository";


@singleton()
export class EfficiencyRecordService implements IEfficiencyRecordService {

  constructor(
    @inject('ProductionProcessRepository') private readonly productionProcessRepository: IProductionProcessRepository,
    @inject('EfficiencyRecordRepository') private readonly efficiencyRecordRepository: IEfficiencyRecordRepository
  ) { }

  async createRecord(efficiencyRecordData: CreateEfficiencyRecordRequestDTO): Promise<CreateEfficiencyRecordResponseDTO> {
    const productionProcess = await this.productionProcessRepository.getById(efficiencyRecordData.process)
    if (!productionProcess) { throw new Error('Process not found') };

    const oeeValue = this.calculateOEE({
      cavitiesNumber: productionProcess.cavitiesNumber,
      cycleTimeInSeconds: productionProcess.cycleTimeInSeconds,
      piecesQuantity: efficiencyRecordData.piecesQuantity,
      productionTimeInMinutes: efficiencyRecordData.productionTimeInMinutes
    })

    const productionEfficiencyLosses: CreateEfficiencyRecordRepositoryDTO['efficiencyLosses'] = efficiencyRecordData.reasons
      .map(item => ({
        classification: classificationTypesMap[item.class as ClassificationTypes],
        description: item.description,
        cause: item.class,
        lostTimeInMinutes: item.time
      }))

    const totalRework = efficiencyRecordData.reasons
      .filter(item => item.class === 'Retrabalho')
      .map(({ time }) => time)
      .reduce((acc, val) => acc + val, 0)

    const totalScrap = efficiencyRecordData.reasons
      .filter(item => item.class === 'Refugo')
      .map(({ time }) => time)
      .reduce((acc, val) => acc + val, 0)

    const totalReasonsTime = efficiencyRecordData.reasons
      .map(({ time }) => time)
      .reduce((acc, val) => acc + val, 0)


    const productionEfficiencyRecord: CreateEfficiencyRecordRepositoryDTO['data'] = {
      date: new Date(efficiencyRecordData.date),
      oeeValue,
      piecesQuantity: efficiencyRecordData.piecesQuantity,
      productionTimeInMinutes: efficiencyRecordData.productionTimeInMinutes,
      turn: efficiencyRecordData.turn,
      processId: Number(efficiencyRecordData.process),
      hourInterval: efficiencyRecordData.hourInterval,
    }

    await this.efficiencyRecordRepository.create({
      data: productionEfficiencyRecord,
      efficiencyLosses: productionEfficiencyLosses
    })

    return {
      oee: oeeValue,
      piecesQuantity: efficiencyRecordData.piecesQuantity,
      processName: productionProcess.description,
      totalReasonsTime,
      totalRework,
      totalScrap,
      ute: efficiencyRecordData.ute
    }
  }

  private calculateOEE({ cycleTimeInSeconds, piecesQuantity, productionTimeInMinutes, cavitiesNumber }: {
    piecesQuantity: number
    cycleTimeInSeconds: number
    productionTimeInMinutes: number
    cavitiesNumber: number
  }) {
    const cycleTimeInMinutes = cycleTimeInSeconds / 60
    return (piecesQuantity * (cycleTimeInMinutes / cavitiesNumber)) / productionTimeInMinutes
  }

  async exportToExcel(): Promise<void> {
    const counts = (await this.efficiencyRecordRepository.getAll())
      .map(count => {
        return {
          'Data': count.date.toLocaleDateString(),
          'Turno': count.turn,
          'UTE': count.process.area,
          'Hora': count.hourInterval,
          'Processo': count.process.description,
          'Peças Boas': count.piecesQuantity,
          'OEE-hora': count.oeeValue,
        }
      })
    const worksheet = XLSX.utils.json_to_sheet(counts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
    const fileName = `Relatório de produção.xlsx`
    XLSX.writeFile(workbook, fileName);
  }

}
