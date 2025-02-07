import { inject, singleton } from "tsyringe";
import { IEfficiencyRecordRepository } from "./IEfficiencyRecordRepository";
import { EfficiencyRecord } from "@/entities/EfficiencyRecord";
import { addDoc, collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore/lite";
import { db } from "..";
import type { IProductionProcessRepository } from "../production-process/IProductionProcessRepository";

@singleton()
export class EfficiencyRecordRepository implements IEfficiencyRecordRepository {

  constructor(
    @inject('ProductionProcessRepository') private readonly productionProcessRepository: IProductionProcessRepository
  ) { }

  async create(data: EfficiencyRecord): Promise<void> {
    await addDoc(collection(db, 'productionEfficiencyRecord'), data)
  }

  async getAll(): Promise<EfficiencyRecord[]> {
    const querySnapshot = await getDocs(query(
      collection(db, 'productionEfficiencyRecord'),
      orderBy('date', 'desc')
    ))
    let docData = querySnapshot.docs.map(doc => doc.data()) as EfficiencyRecord[]
    const data = []
    for (const { date, productionProcessId, ...rest } of docData) {
      const process = await this.productionProcessRepository.getById(productionProcessId)
      data.push({
        date: (date as unknown as Timestamp).toDate(),
        productionProcessId: process?.description ?? '',
        ...rest
      })
    }

    return data
  }

}
