import { singleton } from "tsyringe";
import { IProductionProcessRepository } from "./IProductionProcessRepository";
import { ProductionProcess } from "@/entities/ProductionProcess";
import { getDocs, query, collection, where, orderBy } from "firebase/firestore/lite";
import { db } from "../database";

@singleton()
export class ProductionProcessRepository implements IProductionProcessRepository {

  private cacheProcesses: ProductionProcess[] = []

  async getById(id: ProductionProcess['id']): Promise<ProductionProcess | null> {
    if (this.cacheProcesses.length === 0) await this.getAll()
    return this.cacheProcesses.find(item => item.id == id) ?? null
  }

  async getByUte(ute: ProductionProcess["ute"]): Promise<ProductionProcess[]> {
    const querySnapshot = await getDocs(query(
      collection(db, 'process'),
      where('ute', '==', ute),
      orderBy('id', 'asc')
    ))
    return querySnapshot.docs.map(doc => doc.data()) as ProductionProcess[];
  }

  async getAll(): Promise<ProductionProcess[]> {
    if (this.cacheProcesses.length === 0) {
      const querySnapshot = await getDocs(collection(db, 'process'))
      this.cacheProcesses = querySnapshot.docs.map(doc => doc.data()) as ProductionProcess[];
    }
    return this.cacheProcesses
  }

}
