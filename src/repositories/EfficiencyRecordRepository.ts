import { singleton } from "tsyringe";
import { ProductionRegistry } from "@/entities/ProductionRegistry";
import { supabase } from "./supabase";

@singleton()
export class EfficiencyRecordRepository {

  static tableName = 'production_registry'

  async create(data: ProductionRegistry): Promise<void> {
    const a = Object.assign({}, data) as any
    delete a.id
    delete a.created_at
    delete a.process
    delete a.production_losses

    const { data: registry, error: registryError } = await supabase
      .from(EfficiencyRecordRepository.tableName)
      .insert([])
      .select()
      .single()

    if (registryError) throw registryError
    if (losses.length > 0) {
      const { error: lossesError } = await supabase
        .from('ProductionLosses')
        .insert(data.losses.map(loss => ({
          ...loss,
          production_registry_id: registry.id
        })))

      if (lossesError) throw lossesError
    }

    return
  }

  async findMany(filters: Filters = {}): Promise<ProductionRegistry[]> {
    let q = supabase
      .from(EfficiencyRecordRepository.tableName)
      .select<string, ProductionRegistry>(`*, process (*), production_losses (*)`);

    if (filters.createdAtStart) q = q.gte('created_at', filters.createdAtStart);
    if (filters.createdAtEnd) q = q.lte('created_at', filters.createdAtEnd);
    if (filters.process_id) q = q.eq('process_id', filters.process_id);
    if (filters.turn) q = q.eq('turn', filters.turn);
    if (filters.project) q = q.ilike('project', `%${filters.project}%`);
    if (filters.ute) q = q.eq('process.ute', filters.ute);

    const { data, error } = await q;
    if (error) throw new Error(`Error fetching data: ${error.message}`);

    return data.map(item => new ProductionRegistry(item));
  }

}


type Filters = {
  createdAtStart?: string;
  createdAtEnd?: string;
  process_id?: number;
  turn?: string;
  project?: string;
  ute?: string;
};
