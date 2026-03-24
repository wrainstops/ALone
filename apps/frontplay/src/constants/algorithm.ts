// 排序算法列表
export const sortList = [
  {
    key: 1,
    value: '冒泡排序',
  },
  {
    key: 2,
    value: '快速排序',
  },
  {
    key: 3,
    value: '插入排序',
  },
  {
    key: 4,
    value: '希尔排序',
  },
  {
    key: 5,
    value: '选择排序',
  },
  {
    key: 6,
    value: '堆排序',
  },
  {
    key: 7,
    value: '归并排序',
  },
  {
    key: 8,
    value: '计数排序',
  },
]

// 快速排序js源码
export const QuickSourceCode = `
const numberList = [2,4,3,9,0,8,1,7,6,5]
function generateQuickSortQueue(i = 0, j = numberList.length - 1) {
  if (i >= j) return

  let start = i
  let end = j
  const p = numberList[i]
  while (i < j) {
    if (numberList[j] >= p) {
      j--
    } else {
      if (numberList[i] <= p) {
        i++
      } else {
        ;[numberList[i], numberList[j]] = [
          numberList[j],
          numberList[i],
        ]
        j--
      }
    }
  }
  ;[numberList[start], numberList[i]] = [
    numberList[i],
    numberList[start],
  ]
  generateQuickSortQueue(start, i)
  generateQuickSortQueue(i + 1, end)
}
generateQuickSortQueue()
console.log(numberList)
`
