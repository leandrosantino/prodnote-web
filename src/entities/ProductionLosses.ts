export const classificationTypesList = [
  'Shift Setup',
  'Change-Over + SMED',
  'Breakdowns',
  'Maintenance',
  'Scrap + Quality Issues',
  'Organizational Issues'
] as const

export const classificationTypesMap = {
  'Refeição': 'Organizational Issues',
  'Treinamento/DDS': 'Organizational Issues',
  'Absenteísmo': 'Organizational Issues',
  'Logística': 'Organizational Issues',
  'Operacional': 'Organizational Issues',
  'Setup': 'Change-Over + SMED',
  'Máquina quebrada': 'Breakdowns',
  'Ajsute de Parâmetro': 'Shift Setup',
  'Manutenção programada': 'Maintenance',
  'Organização/Limpeza': 'Organizational Issues',
  'Troca de material': 'Organizational Issues',
  'Retrabalho': 'Scrap + Quality Issues',
  'Refugo': 'Scrap + Quality Issues',
} as const

export type ClassificationTypes = keyof typeof classificationTypesMap

export interface ProductionLosses {
  id: number
  production_registry_id?: number
  classification: typeof classificationTypesList[number]
  cause: keyof typeof classificationTypesMap
  description: string
  time: number
}
