import { singleton } from "tsyringe";
import { IProductionProcessRepository } from "./IProductionProcessRepository";
import { ProductionProcess } from "@/entities/ProductionProcess";
import { getDocs, query, collection, where, orderBy } from "firebase/firestore/lite";
import { db } from "..";

@singleton()
export class ProductionProcessRepository implements IProductionProcessRepository {

  private cacheProcesses: Record<string, ProductionProcess[]> = { '': [] }

  getByIdAndUte(id: ProductionProcess['id'], ute: ProductionProcess['ute']): ProductionProcess | null {
    return this.cacheProcesses[ute].find(item => item.id == id) ?? null
  }

  async findByUte(ute: ProductionProcess["ute"]): Promise<ProductionProcess[]> {
    if (!this.cacheProcesses[ute] && (ute as string) != '') {
      const querySnapshot = await getDocs(query(
        collection(db, 'process'),
        where('ute', '==', ute),
        orderBy('id', 'asc')
      ))
      // console.log('external', cacheProcesses)
      this.cacheProcesses[ute] = querySnapshot.docs.map(doc => doc.data()) as ProductionProcess[];
    }
    return this.cacheProcesses[ute]
  }

}
