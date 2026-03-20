import type { LabelValueOption } from '#/index'

/**
 * 将数字字符串转换为数字列表
 * @returns [{ label: 唯一索引, value: 数数字值, height: 高度 }]
 */
export function numberStringToList(numberString: string): LabelValueOption | Error {
  let res: LabelValueOption = []
  try {
    const list = numberString.split(',')
    if (list.length > 20) {
      throw new Error('就最多20个数字叭')
    }
    let max = Number(list[0])
    list.forEach((item, index) => {
      if (isNaN(Number(item))) {
        throw new Error('得输入数字哦')
      }
      if (Number(item) > max) {
        max = Number(item)
      }
      res.push({
        label: index,
        value: Number(item),
      })
    })
    max = Math.max(max, 1)
    res.forEach((item) => {
      item.height = `${Math.max((item.value / max) * 100, 1)}%`
    })
  } catch (error: unknown) {
    res = []
    return error as Error
  }
  return res
}
