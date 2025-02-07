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
  'Manutenção programada/preventiva': 'Maintenance',
  'Organização/Limpeza/Refeição': 'Organizational Issues',
  'Retrabalho': 'Scrap + Quality Issues',
  'Refugo': 'Scrap + Quality Issues',
  'RH': 'Organizational Issues',
  'Logística': 'Organizational Issues',
  'Eficiência Operacional': 'Organizational Issues',
} as const

export type ClassificationTypes = keyof typeof classificationTypesMap

export interface EfficiencyLoss {
  classification: string
  description: string
  lostTimeInMinutes: number
}
