import { ProductionProcess } from "@/entities/ProductionProcess"


export interface IProductionProcessRepository {
  getByIdAndUte(id: ProductionProcess['id'], ute: ProductionProcess['ute']): ProductionProcess | null
  findByUte(ute: ProductionProcess['ute']): Promise<ProductionProcess[]>
}
