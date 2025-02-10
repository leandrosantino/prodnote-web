import { singleton } from "tsyringe";
import { CreateEfficiencyRecordRepositoryDTO, IEfficiencyRecordRepository } from "./IEfficiencyRecordRepository";
import { EfficiencyRecord } from "@/entities/EfficiencyRecord";
import supabase from "../supabase";
import { EfficiencyLoss } from "@/entities/EfficiencyLoss";

@singleton()
export class SpEfficiencyRecordRepository implements IEfficiencyRecordRepository {

  private tableName = 'productionEfficiencyRecord' //'teste' //

  async create({ data, efficiencyLosses }: CreateEfficiencyRecordRepositoryDTO): Promise<void> {
    const { data: createdRecord, error: createRecordError } = await supabase.from(this.tableName)
      .insert(data).select().single<typeof data & { id: number }>()
    if (createRecordError) throw new Error(createRecordError.message)

    const { data: createdLosses, error: createLossError } = await supabase.from('efficiencyLoss')
      .insert(efficiencyLosses).select<string, EfficiencyLoss>()
    if (createLossError) throw new Error(createLossError.message)

    const { error: createRelationError } = await supabase.from('record_loss')
      .insert(createdLosses.map(loss => ({ recordId: createdRecord.id, lossId: loss.id })))

    if (createRelationError) throw new Error(createRelationError.message)
    console.log(createdRecord, createdLosses)
  }

  async getAll(): Promise<EfficiencyRecord[]> {
    const { data, error } = await supabase.from(this.tableName)
      .select<string, EfficiencyRecord>(`
          *,
          process (
            area,
            description
          ),
          productionEfficiencyLosses:record_loss (
            efficiencyLoss(*)
          )
        `)
      .order('date', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

}
