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
  // {
  //   key: 4,
  //   value: '希尔排序',
  // },
  {
    key: 5,
    value: '选择排序',
  },
  // {
  //   key: 6,
  //   value: '堆排序',
  // },
  // {
  //   key: 7,
  //   value: '归并排序',
  // },
  // {
  //   key: 8,
  //   value: '计数排序',
  // },
]

// 冒泡排序js代码
export const BubbleSourceCode = `
const numberList = [2,1,5,4,3]
const len = numberList.length
for (let i = 0; i < len; i++) {
  for (let j = 0; j < len - 1 - i; j++) {
    const cur = numberList[j]
    const next = numberList[j + 1]
    if (cur > next) {
      ;[numberList[j], numberList[j + 1]] = [
        numberList[j + 1],
        numberList[j],
      ]
    }
  }
}
console.log(numberList)
`

// 快速排序js代码
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

// 插入排序js代码
export const InsertSourceCode = `
const numberList = [2,1,5,4,3]
const len = numberList.length
for (let i = 1; i < len; i++) {
  const k = numberList[i]
  for (let j = i - 1; j >= 0; j--) {
    if (numberList[j] > k) {
      ;[numberList[j + 1], numberList[j]] = [
        numberList[j],
        numberList[j + 1],
      ]
    }
  }
}
console.log(numberList)
`

// 选择排序js代码
export const SelectSourceCode = `
const numberList = [2,1,5,4,3]
const len = numberList.length
for (let i = 0; i < len; i++) {
  let minIndex = i
  for (let j = i; j < len; j++) {
    const cur = numberList[j]
    const min = numberList[minIndex]
    if (cur < min) {
      minIndex = j
    }
    if (j === len - 1) {
      ;[numberList[i], numberList[minIndex]] = [
        numberList[minIndex],
        numberList[i],
      ]
    }
  }
}
console.log(numberList)
`
