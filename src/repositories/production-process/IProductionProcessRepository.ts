import { ProductionProcess } from "@/entities/ProductionProcess"


export interface IProductionProcessRepository {
  getById(id: ProductionProcess['id']): Promise<ProductionProcess | null>
  getByUte(ute: ProductionProcess['ute']): Promise<ProductionProcess[]>
  getAll(): Promise<ProductionProcess[]>
}
