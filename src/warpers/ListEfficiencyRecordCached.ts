import { EfficiencyRecord } from "@/entities/EfficiencyRecord";
import { db } from "@/repositories/database";
import type { IEfficiencyRecordRepository } from "@/repositories/efficiency-record/IEfficiencyRecordRepository";
import { collection, addDoc } from "firebase/firestore";
import { inject, singleton } from "tsyringe";

type CacheData = {
  data: EfficiencyRecord[]
  expiresIn: number
}

@singleton()
export class ListEfficiencyRecordCached {

  constructor(
    @inject('EfficiencyRecordRepository') private readonly efficiencyRecordRepository: IEfficiencyRecordRepository,
  ) { }

  storageKey = 'efficiencyRecords'
  revalidateInterval = 5

  async execute() {
    const now = new Date().valueOf()
    const cachedData = this.getCachedData()

    if (!cachedData) {
      return this.reserCache()
    }

    if (cachedData.expiresIn <= now) {
      const lastId = cachedData.data[0].date
      const newData = await this.efficiencyRecordRepository.findMany({
        operator: '>',
        date: lastId
      })
      console.log('database parcial getdata', newData.length)
      cachedData.data = newData.concat(cachedData.data)
      this.revalidate(cachedData.data)
    }

    console.log('cached', cachedData.data.length)
    return cachedData.data
  }

  onCreate() {
    return this.efficiencyRecordRepository.onCreate(data => {
      const cachedData = this.getCachedData()
      if (cachedData) {
        cachedData.data = [data, ...cachedData.data]
        console.log('added', cachedData.data.length)
        this.revalidate(cachedData.data)
      }
    })
  }

  async reserCache() {
    const data = await this.efficiencyRecordRepository.getAll()
    console.log('database All', data.length)
    return this.revalidate(data)
  }

  private async revalidate(data: EfficiencyRecord[]) {
    const expiresIn = this.getNewExpiresTime()
    this.setCachedData({ data, expiresIn })
    return data
  }

  private getNewExpiresTime() {
    // return new Date().setSeconds(new Date().getSeconds() + this.revalidateInterval).valueOf()
    return new Date().setMinutes(new Date().getMinutes() + this.revalidateInterval).valueOf()
  }

  private getCachedData(): CacheData | null {
    const cachedData = localStorage.getItem(this.storageKey);
    if (!cachedData) return null
    const { data, expiresIn } = JSON.parse(cachedData) as CacheData
    data.map(item => {
      item.date = new Date(item.date)
      return item
    })
    return { data, expiresIn }
  }

  private setCachedData(cacheData: CacheData) {
    localStorage.setItem(this.storageKey, JSON.stringify(cacheData));
  }

  async migrate() {
    try {
      const targetCollection = collection(db, 'productionEfficiencyRecord');
      const docs = this.getCachedData()
      if (!docs) return
      for (const doc of docs.data) {
        await this.sleep(500)
        await addDoc(targetCollection, doc);
        console.log(`Documento ${doc.date.toLocaleDateString()} migrado com sucesso.`);
      }
    } catch (error) {
      console.error("Erro ao migrar coleção:", error);
    }
  }

  async sleep(time: number) {
    return await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, time);
    })
  }


}


