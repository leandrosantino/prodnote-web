import { singleton } from "tsyringe";
import { ProductionRegistry, ProductionRegistryCreateDto } from "@/entities/ProductionRegistry";
import { supabase } from "./supabase";

@singleton()
export class ProductionRegistryRepository {

  static tableName = 'production_registry'

  async create({ registryData, production_losses }: ProductionRegistryCreateDto): Promise<void> {
    const { data: registry, error: registryError } = await supabase
      .from(ProductionRegistryRepository.tableName)
      .insert([registryData])
      .select()
      .single<ProductionRegistry>()

    if (registryError) throw registryError

    if (production_losses.length > 0) {
      production_losses.forEach(loss => { loss.production_registry_id = registry.id })

      const { error: lossesError } = await supabase
        .from('production_losses')
        .insert(production_losses)

      if (lossesError) throw lossesError
    }
  }

  async findMany(filters: Filters = {}): Promise<ProductionRegistry[]> {
    let q = supabase
      .from(ProductionRegistryRepository.tableName)
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
