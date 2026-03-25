<template>
  <div class="mt-4">
    <n-h3>快速排序</n-h3>
    <n-equation :value="equation" />
    <Widget ref="widgetRef" @set-number-string="setNumberString" @run="runSort" @stop="stopSort" />
    <div class="h-60 w-full mt-4 flex gap-4 overflow-auto">
      <TransitionGroup name="sort-list">
        <div
          v-for="(item, index) in numberList"
          :key="item.label"
          class="w-8 flex flex-none justify-center ml-auto mr-auto mt-auto items-end bg-(--light-color) whitespace-normal break-all"
          :style="{ height: item.height, backgroundColor: getNumberBgColor(index) }"
        >
          {{ item.value }}
        </div>
      </TransitionGroup>
    </div>
    <Description :content="QuickMd" />
    <Code :code="QuickSourceCode" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { NH3, NEquation, useMessage } from 'naive-ui'
import Widget from './widget.vue'
import Description from './description.vue'
import Code from './code.vue'
import { QuickMd, QuickSourceCode } from '@/constants/algorithm'
import { numberStringToList } from '@/utils/sort'
import type { LabelValueOption, KeyValue } from '#/index'

const message = useMessage()

const equation = '\\displaystyle时间复杂度: O(nlogn); 空间复杂度: O(logn)'
const widgetRef = ref<typeof Widget>()
const numberString = ref<string>('2,4,3,9,0,8,1,7,6,5')
const numberList = ref<LabelValueOption>([])
/**
 * numberListCopy
 * 拷贝一份数组，在generateQuickSortQueue时使用
 * 因为在递归里，如果不交换数字，会无限递归，导致栈溢出
 * 所以做一份拷贝，在递归时执行这个拷贝数组的交换操作，把对原数组执行的相同的操作加入执行队列
 */
const numberListCopy = ref<LabelValueOption>([])

// 字符串分隔为数组
function setNumberList(str: string) {
  if (numberStringToList(str) instanceof Error) {
    message.error((numberStringToList(str) as Error).message, { duration: 5000 })
    numberList.value = []
    numberListCopy.value = []
  } else {
    numberList.value = numberStringToList(str) as LabelValueOption
    numberListCopy.value = numberStringToList(str) as LabelValueOption
  }
}
setNumberList(numberString.value)

const queue = ref<KeyValue[]>([])
const runningIndex = ref(0) // 正在运行第几步
const sortIndexs = ref<number[]>([]) // 左右指针
const standardIndex = ref<number>(-1) // 标准值的索引
const sortedIndexs = ref<number[]>([]) // 已排序的索引

// 生成快速排序的操作队列
function generateQuickSortQueue(
  list: LabelValueOption = numberListCopy.value,
  i: number = 0,
  j: number = numberList.value.length - 1,
) {
  if (i >= j) return

  let start: number = i
  let end: number = j
  const p = list[i]!.value
  while (i < j) {
    const fn = () => {
      standardIndex.value = start
    }
    if (list[j]!.value >= p) {
      queue.value.push({ fn, index1: i, index2: j })
      j--
    } else {
      if (list[i]!.value <= p) {
        queue.value.push({ fn, index1: i, index2: j })
        i++
      } else {
        // ! 这里要拷贝出i和j，否则在runSort定时调用fn时，i和j变为最终相等的值，达不到交换的效果
        let copyI = i,
          copyJ = j
        const fn = () => {
          standardIndex.value = start
          ;[numberList.value[copyI], numberList.value[copyJ]] = [
            numberList.value[copyJ]!,
            numberList.value[copyI]!,
          ]
        }
        ;[list[i], list[j]] = [list[j]!, list[i]!]
        queue.value.push({ fn, index1: i, index2: j })
        j--
      }
    }
  }
  const fn = () => {
    standardIndex.value = start
    ;[numberList.value[start], numberList.value[i]] = [
      numberList.value[i]!,
      numberList.value[start]!,
    ]
    sortedIndexs.value.push(i)
  }
  ;[list[start], list[i]] = [list[i]!, list[start]!]
  queue.value.push({ fn, index1: start, index2: i })
  generateQuickSortQueue(list, start, i)
  generateQuickSortQueue(list, i + 1, end)
}
generateQuickSortQueue()

let interval: number | undefined = void 0
async function runSort(mark: boolean = true) {
  if (!mark) {
    clearTimeout(interval)
    return
  }

  const forFn = () => {
    clearTimeout(interval)
    const i = runningIndex.value
    const { fn, index1, index2 } = queue.value[i]! // 获取队列中的排序方法和索引
    sortIndexs.value = [index1, index2] // 更新正在排序的索引
    runningIndex.value = i + 1 // 更新正在运行第几步
    fn() // 运行排序
    if (i === queue.value.length - 1) {
      standardIndex.value = -1
      finishSort()
      return
    }
    interval = setTimeout(forFn, 800)
  }

  interval = setTimeout(forFn, 800)
}

// 排序结束
function finishSort() {
  sortIndexs.value = []
  clearTimeout(interval)
  widgetRef.value?.handlePauseRunning()
}

// 排序停止
function stopSort() {
  queue.value = []
  sortedIndexs.value = []
  finishSort()
  runningIndex.value = 0
  setNumberList(numberString.value)
  generateQuickSortQueue()
}

// 设置一组排序的数字
function setNumberString(str: string) {
  if (str === numberString.value) return
  numberString.value = str
  stopSort()
  widgetRef.value?.handleStartRunning()
}

function getNumberBgColor(index: number): string {
  if (standardIndex.value === index) {
    return 'var(--warning-color)'
  } else if (sortIndexs.value.includes(index)) {
    return 'var(--error-color)'
  } else if (sortedIndexs.value.includes(index)) {
    return 'var(--main-color)'
  } else {
    return 'var(--light-color)'
  }
}

onBeforeUnmount(() => {
  stopSort()
})
</script>

<style scoped lang="scss">
.sort-list-move {
  transition: transform 0.5s;
}
</style>
