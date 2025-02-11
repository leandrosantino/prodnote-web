import { inject, singleton } from "tsyringe";
import { IEfficiencyRecordRepository } from "./IEfficiencyRecordRepository";
import { EfficiencyRecord } from "@/entities/EfficiencyRecord";
import { addDoc, collection, getDocs, orderBy, query, Timestamp, where, onSnapshot } from "firebase/firestore";
import { db } from "../database";
import type { IProductionProcessRepository } from "../production-process/IProductionProcessRepository";

@singleton()
export class EfficiencyRecordRepository implements IEfficiencyRecordRepository {

  constructor(
    @inject('ProductionProcessRepository') private readonly productionProcessRepository: IProductionProcessRepository
  ) { }

  private collectionName = 'productionEfficiencyRecord' //'teste' //

  async create(data: EfficiencyRecord): Promise<void> {
    await addDoc(collection(db, this.collectionName), data)
  }

  async getAll(): Promise<EfficiencyRecord[]> {
    const querySnapshot = await getDocs(query(
      collection(db, this.collectionName),
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

  async findMany(filters: { date: Date; operator: "<" | ">" | "=="; }): Promise<EfficiencyRecord[]> {
    const querySnapshot = await getDocs(query(
      collection(db, this.collectionName),
      where('date', '>', filters.date),
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

  onCreate(cb: (data: EfficiencyRecord) => void): Function {
    const itemsRef = query(
      collection(db, this.collectionName),
      where('date', '>', new Date())
    )
    return onSnapshot(itemsRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const { date, productionProcessId, ...rest } = change.doc.data() as EfficiencyRecord
          this.productionProcessRepository.getById(productionProcessId)
            .then(process => {
              cb({
                date: (date as unknown as Timestamp).toDate(),
                productionProcessId: process?.description ?? '',
                ...rest
              })
            })
        }
      })
    })
  }

}
