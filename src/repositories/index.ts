import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore/lite';
import { ProductionProcess } from "../entities/ProductionProcess";
import { CreateEfficiencyRecordRequestDTO, ProductionEfficiencyRecord } from "../entities/ProductionEfficiencyRecord";
import { ClassificationTypes, classificationTypesMap } from "../entities/ProductionEfficiencyLoss";
import { SuccessData } from "../modules/home/home.view";

const firebaseConfig = {
  apiKey: "AIzaSyA1Yx0-iwYzgQryvR0GPHItDjjDV_XIQg4",
  authDomain: "prodnote-web.firebaseapp.com",
  projectId: "prodnote-web",
  storageBucket: "prodnote-web.firebasestorage.app",
  messagingSenderId: "806020565168",
  appId: "1:806020565168:web:46609243df9add11ae5375"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

let cacheProcesses: Record<string, ProductionProcess[]> = { '': [] }

export function getProcessById(id: string, ute: string) {
  return cacheProcesses[ute].find(item => item.id == id)
}

export async function getProcesses(ute: string) {
  if (!cacheProcesses[ute] && ute != '') {
    const querySnapshot = await getDocs(query(
      collection(db, 'process'),
      where('ute', '==', ute),
      orderBy('id', 'asc')
    ))
    // console.log('external', cacheProcesses)
    cacheProcesses[ute] = querySnapshot.docs.map(doc => doc.data()) as ProductionProcess[];
  }
  return cacheProcesses[ute]
}

export async function createEfficiencyRecord(efficiencyRecordData: CreateEfficiencyRecordRequestDTO): Promise<SuccessData> {

  const productionProcess = getProcessById(efficiencyRecordData.process, efficiencyRecordData.ute)
  if (!productionProcess) { throw new Error('Process not found') };

  const oeeValue = calculateOEE({
    cavitiesNumber: productionProcess.cavitiesNumber,
    cycleTimeInSeconds: productionProcess.cycleTimeInSeconds,
    piecesQuantity: efficiencyRecordData.piecesQuantity,
    productionTimeInMinutes: efficiencyRecordData.productionTimeInMinutes
  })

  const productionEfficiencyLosses: ProductionEfficiencyRecord['productionEfficiencyLosses'] = efficiencyRecordData.reasons
    .map(item => ({
      classification: classificationTypesMap[item.class as ClassificationTypes],
      description: item.description,
      lostTimeInMinutes: item.time
    }))

  const totalRework = efficiencyRecordData.reasons
    .filter(item => item.class === 'Retrabalho')
    .map(({ time }) => time)
    .reduce((acc, val) => acc + val, 0)

  const totalScrap = efficiencyRecordData.reasons
    .filter(item => item.class === 'Refugo')
    .map(({ time }) => time)
    .reduce((acc, val) => acc + val, 0)

  const totalReasonsTime = efficiencyRecordData.reasons
    .map(({ time }) => time)
    .reduce((acc, val) => acc + val, 0)


  const productionEfficiencyRecord: ProductionEfficiencyRecord = {
    date: new Date(efficiencyRecordData.date),
    oeeValue,
    productionEfficiencyLosses,
    piecesQuantity: efficiencyRecordData.piecesQuantity,
    productionProcessId: productionProcess.id,
    productionTimeInMinutes: efficiencyRecordData.productionTimeInMinutes,
    turn: efficiencyRecordData.turn,
    ute: efficiencyRecordData.ute as ProductionEfficiencyRecord['ute'],
    hourInterval: efficiencyRecordData.hourInterval
  }

  // console.log(JSON.stringify(productionEfficiencyRecord, null, 2))

  await addDoc(collection(db, 'productionEfficiencyRecord'), productionEfficiencyRecord)

  return {
    oee: oeeValue,
    piecesQuantity: efficiencyRecordData.piecesQuantity,
    processName: productionProcess.description,
    totalReasonsTime,
    totalRework,
    totalScrap,
    ute: efficiencyRecordData.ute
  }
}

function calculateOEE({ cycleTimeInSeconds, piecesQuantity, productionTimeInMinutes, cavitiesNumber }: {
  piecesQuantity: number
  cycleTimeInSeconds: number
  productionTimeInMinutes: number
  cavitiesNumber: number
}) {
  const cycleTimeInMinutes = cycleTimeInSeconds / 60
  return (piecesQuantity * (cycleTimeInMinutes / cavitiesNumber)) / productionTimeInMinutes
}
