import { singleton } from "tsyringe";
import { IProductionProcessRepository } from "./IProductionProcessRepository";
import { ProductionProcess } from "@/entities/ProductionProcess";

import supabase from "../supabase";

@singleton()
export class SpProductionProcessRepository implements IProductionProcessRepository {


  async getById(id: ProductionProcess['id']): Promise<ProductionProcess | null> {
    const { data, error } = await supabase.from('process')
      .select<"", ProductionProcess>()
      .eq('id', id)
      .limit(1)
    if (data?.length && data.length < 1) return null
    if (error) throw new Error()
    return data[0]
  }

  async getByUte(area: ProductionProcess["area"]): Promise<ProductionProcess[]> {
    const { data, error } = await supabase.from('process')
      .select<"*", ProductionProcess>("*")
      .eq('area', area)
      .order('id', { ascending: true })
    console.log(data, error)
    if (error) throw new Error(error.message)
    return data
  }

  async getAll(): Promise<ProductionProcess[]> {
    const { data, error } = await supabase.from('process').select<"*", ProductionProcess>("*")
    console.log(data, error)
    if (error) throw new Error(error.message)
    return data
  }

}
