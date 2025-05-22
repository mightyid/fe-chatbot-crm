export * from './employees'
export * from './settings'
export * from './personalManagement'

export const generatePathWithParams = (path: string, params: Record<string, any>): string => {
  let resultPath = path.replace(/:([a-zA-Z]+)/g, (_: string, key: string): string => {
    return params[key] ?? ''
  })

  return resultPath
}
