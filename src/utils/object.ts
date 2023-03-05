export const pick = (tagetObj: any, item: string[]) =>
  Object.keys(tagetObj).reduce(
    (pre, next) =>
      Object.assign(pre, item.includes(next) ? { [next]: tagetObj[next] } : {}),
    {},
  )
export const omit = (tagetObj: any, item: string[]) =>
  Object.keys(tagetObj).reduce((pre, next) =>
    Object.assign(pre, item.includes(next) ? {} : { [next]: tagetObj[next] }),{}
  )
