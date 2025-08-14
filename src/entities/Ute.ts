export const uteKeysList = ['UTE-1', 'UTE-2', 'UTE-3', 'UTE-4', 'UTE-5'] as const
export type UteKeys = typeof uteKeysList[number]
export const utePattern = /^UTE-[1-5]$/
