import { collection, addDoc } from 'firebase/firestore';
import { db } from "@/repositories/database";

type Item = {
  id: string;
  description: string;
  ute: string;
  cavitiesNumber: number;
  cycleTimeInSeconds: number;
};

const data: Item[] = [
  // {
  //   "id": "17",
  //   "description": "MOLDAGEM M35",
  //   "ute": "UTE-5",
  //   "cavitiesNumber": 1,
  //   "cycleTimeInSeconds": 60.0
  // },
  {
    "id": "18",
    "description": "INJEÇÃO / CORTE M41",
    "ute": "UTE-5",
    "cavitiesNumber": 1,
    "cycleTimeInSeconds": 72.0
  },
  {
    "id": "19",
    "description": "INJEÇÃO / CORTE M42",
    "ute": "UTE-5",
    "cavitiesNumber": 1,
    "cycleTimeInSeconds": 180.0
  },
  {
    "id": "20",
    "description": "OUTER FLEX",
    "ute": "UTE-2",
    "cavitiesNumber": 1,
    "cycleTimeInSeconds": 40.0
  },
  {
    "id": "21",
    "description": "OUTER DIESEL",
    "ute": "UTE-2",
    "cavitiesNumber": 1,
    "cycleTimeInSeconds": 51.43
  },
  {
    "id": "22",
    "description": "HOOD 551/598",
    "ute": "UTE-2",
    "cavitiesNumber": 1,
    "cycleTimeInSeconds": 36.0
  },
  {
    "id": "23",
    "description": "HOOD 521",
    "ute": "UTE-2",
    "cavitiesNumber": 1,
    "cycleTimeInSeconds": 26.67
  },
  {
    "id": "24",
    "description": "HOOD 226/291",
    "ute": "UTE-2",
    "cavitiesNumber": 1,
    "cycleTimeInSeconds": 40.0
  },
  {
    "id": "25",
    "description": "INJEÇÃO DO FENDER",
    "ute": "UTE-2",
    "cavitiesNumber": 1,
    "cycleTimeInSeconds": 60.0
  },
  {
    "id": "26",
    "description": "INNER DASH MOLDAGEM",
    "ute": "UTE-2",
    "cavitiesNumber": 1,
    "cycleTimeInSeconds": 51.43
  },
  {
    "id": "27",
    "description": "INNER DASH INJEÇÃO",
    "ute": "UTE-2",
    "cavitiesNumber": 1,
    "cycleTimeInSeconds": 60.0
  },
  {
    "id": "28",
    "description": "INNER DASH CORTE",
    "ute": "UTE-2",
    "cavitiesNumber": 1,
    "cycleTimeInSeconds": 56.25
  }
]


export async function uploadDataToFirestore() {
  const userConfirmed = window.confirm('Você deseja enviar esses dados para o Firestore?');

  if (!userConfirmed) {
    console.log('Envio cancelado pelo usuário.');
    return;
  }

  const colRef = collection(db, 'process'); // troque 'sua_colecao' pelo nome da sua coleção

  try {
    for (const item of data) {
      await addDoc(colRef, item); // ID aleatório será gerado automaticamente
    }
    alert('Dados enviados com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar os dados:', error);
    alert('Erro ao enviar os dados. Veja o console para mais detalhes.');
  }
}
