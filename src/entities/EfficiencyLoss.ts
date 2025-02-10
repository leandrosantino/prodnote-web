export const classificationTypesList = [
  'Shift Setup',
  'Change-Over + SMED',
  'Breakdowns',
  'Maintenance',
  'Scrap + Quality Issues',
  'Organizational Issues'
] as const

export const classificationTypesMap = {
  'Ajsute de Parâmetro': 'Shift Setup',
  'Setup': 'Change-Over + SMED',
  'Máquina quebrada': 'Breakdowns',
  'Manutenção programada': 'Maintenance',
  'Organização/Limpeza': 'Organizational Issues',
  'Troca de material': 'Organizational Issues',
  'Refeição': 'Organizational Issues',
  'Retrabalho': 'Scrap + Quality Issues',
  'Refugo': 'Scrap + Quality Issues',
  'RH': 'Organizational Issues',
  'Logística': 'Organizational Issues',
  'Operacional': 'Organizational Issues',
} as const

export type ClassificationTypes = keyof typeof classificationTypesMap

export interface EfficiencyLoss {
  id: number
  classification: string
  cause: string
  description: string
  lostTimeInMinutes: number
}
