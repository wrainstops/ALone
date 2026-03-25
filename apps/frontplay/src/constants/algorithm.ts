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

// 冒泡排序md
export const BubbleMd = `
### 步骤
1. 从左到右不断比较相邻的两个数，左边比右边的大就交换位置，循环一轮就找出了最大数，放到末尾
2. 内层的循环不用遍历到末尾，到\`\`\`arr.length-1-i\`\`\`即可，因为后i个数已经排好序了
`

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

// 快速排序md
export const QuickMd = `
### 1. 步骤
1. 任取一个数作为比较标准，例如取第一个数
2. 左右两个指针，向中间移动
3. 右指针先动，找到比标准数小的就停下 --- 记为操作A
4. 左指针再动，找到比标准数大的就停下 --- 记为操作B
5. 交换这两个数 --- 记为操作C
6. 循环操作ABC，直到两指针重合
7. 再交换标准数和两指针同时指向的那个数
8. 将指针指向的数的下标作为分割，分为左右两个数组递归，重复整个流程
---

### 2. 时间复杂度
1. 正常情况下，递归每次分左右两部分，递归深度logn，每层递归进行n次比较和交换，时间复杂度O(nlogn)
2. 最坏情况下，递归每次分隔得到的两个子数组，其中一个为空，另一个有n-1个元素，递归深度为n，时间复杂度为O(n^2)
---

### 3. 空间复杂度
1. 快排没有开辟空间，但是使用了递归，递归会开辟栈帧，所以涉及递归算法的空间复杂度 = 每次递归开辟的空间 * 递归深度
2. 正常情况下，递归深度logn，空间复杂度为O(logn)
3. 最坏情况下，递归深度为n，空间复杂度为O(n)
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

// 插入排序md
export const InsertMd = `
### 步骤
1. 先选第一个元素作为已排好序的数组，外层循环从第二个元素开始向右遍历，记为k，内层循环从外层当前位置向左遍历
2. 如果当前元素大于k，则把当前元素向后移动一位，把k放入当前位置，直到当前元素小于等于k，退出内层循环
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

// 选择排序md
export const SelectMd = `
### 步骤
1. 外层循环从左到右遍历，内层循环从外层当前位置向右遍历，找出最小值，与外层当前位置交换。就是不断找出最小值与起始位置交换
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
