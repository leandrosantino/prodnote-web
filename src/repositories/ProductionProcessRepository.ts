import { singleton } from "tsyringe";
import { Process } from "@/entities/Process";
import { getDocs, query, collection, where, orderBy } from "firebase/firestore";
import { db } from "./database";

@singleton()
export class ProductionProcessRepository {

  private cacheProcesses: Process[] = []

  async getById(id: Process['id']): Promise<Process | null> {
    if (this.cacheProcesses.length === 0) await this.getAll()
    return this.cacheProcesses.find(item => item.id == id) ?? null
  }

  async getByUte(ute: Process["ute"]): Promise<Process[]> {
    const querySnapshot = await getDocs(query(
      collection(db, 'process'),
      where('ute', '==', ute),
      orderBy('id', 'asc')
    ))
    return querySnapshot.docs.map(doc => doc.data()) as Process[];
  }

  async getAll(): Promise<Process[]> {
    if (this.cacheProcesses.length === 0) {
      const querySnapshot = await getDocs(query(
        collection(db, 'process'),
        orderBy('id', 'asc')
      ))
      this.cacheProcesses = querySnapshot.docs.map(doc => doc.data()) as Process[];
    }
    return this.cacheProcesses
  }

}
