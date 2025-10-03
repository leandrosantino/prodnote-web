import { singleton } from "tsyringe";
import { ProductionRegistry, ProductionRegistryCreateDto } from "@/entities/ProductionRegistry";
import { supabase } from "./supabase";
import { set } from "date-fns";
import { HourIntervals } from "@/entities/HoursIntervals";

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
      production_losses.forEach(loss => {
        delete (loss as any).id
        loss.production_registry_id = registry.id
      })

      const { error: lossesError } = await supabase
        .from('production_losses')
        .insert(production_losses)

      if (lossesError) throw lossesError
    }
  }

  async exists(time_tag: HourIntervals, process_id: number) {
    const { error } = await supabase
      .from(ProductionRegistryRepository.tableName)
      .select('*')
      .gte('created_at', set(this.getNow(), { hours: 0, minutes: 0, seconds: 0 }).toISOString())
      .lte('created_at', set(this.getNow(), { hours: 23, minutes: 59, seconds: 59 }).toISOString())
      .eq('time_tag', time_tag)
      .eq('process_id', process_id)
      .single<ProductionRegistry>()
    if (error) return false
    return true
  }

  private getNow() {
    const now = new Date()
    return new Date(now.getTime() + 3 * 60 * 60 * 1000)
  }

  async getAll() {

    const take = 1000
    let cursor = 0
    let lastPageSize = 0
    const temp: ProductionRegistry[] = []

    do {
      const query = supabase
        .from(ProductionRegistryRepository.tableName)
        .select<string, ProductionRegistry>("*, process (*), production_losses (*)")
        .limit(take)
        .order("id", { ascending: false })

      if (cursor != 0) query.lt('id', cursor)

      const { data, error } = await query

      if (error) throw new Error(`Error fetching data: ${error.message}`);
      cursor = data[data?.length - 1].id
      lastPageSize = data?.length

      // console.log(cursor, lastPageSize, data)

      temp.push(...data)

    } while (!(lastPageSize < take))

    return temp.map(item => new ProductionRegistry(item));
  }

  async findMany(filters: Filters = {}): Promise<ProductionRegistry[]> {
    let q = supabase
      .from(ProductionRegistryRepository.tableName)
      .select<string, ProductionRegistry>(`*, process (*), production_losses (*)`)
      .order("created_at", { ascending: false });


    if (filters.createdAtStart) q = q.gte('created_at', new Date(filters.createdAtStart.getTime() + 3 * 60 * 60 * 1000).toISOString());
    if (filters.createdAtEnd) q = q.lte('created_at', new Date(filters.createdAtEnd.getTime() + 3 * 60 * 60 * 1000).toISOString());
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
  createdAtStart?: Date;
  createdAtEnd?: Date;
  process_id?: number;
  turn?: string;
  project?: string;
  ute?: string;
};
