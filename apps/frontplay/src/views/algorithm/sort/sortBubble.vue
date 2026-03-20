<template>
  <div class="mt-4">
    <n-h3>冒泡排序</n-h3>
    <n-equation :value="equation" />
    <Widget @run="runSort" />
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NH3, NEquation, useMessage } from 'naive-ui'
import Widget from './widget.vue'
import type { LabelValueOption, KeyValue } from '#/index'

const message = useMessage()

const equation = '\\displaystyle时间复杂度: O(n^2); 空间复杂度: O(1)'
const numberString = '2,1,5,4,3'

function numberStringToList(numberString: string): LabelValueOption {
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
    message.error((error as Error).message, { duration: 5000 })
    res = []
  }
  return res
}
const numberList = ref(numberStringToList(numberString))

const queue = ref<KeyValue[]>([])
const runningIndex = ref(0) // 正在运行第几步
const sortIndexs = ref<number[]>([]) // 正在排序的两个索引
const sortedIndexs = ref<number[]>([]) // 已排序的索引

/**
 * 生成冒泡排序的操作队列
 */
function generateBubbleSortQueue() {
  queue.value = []
  const len = numberList.value.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      const fn = () => {
        if (j + 1 === len - 1 - i) {
          sortedIndexs.value.push(j + 1)
        }
        if (j === 0 && i === len - 2) sortedIndexs.value.push(j) // 最后一次排序，把第一项加入已排序索引
        const j_v = numberList.value[j]!.value
        const j1_v = numberList.value[j + 1]!.value
        if (j_v > j1_v) {
          ;[numberList.value[j], numberList.value[j + 1]] = [
            numberList.value[j + 1]!,
            numberList.value[j]!,
          ]
        }
      }
      queue.value.push({ fn, index: j })
    }
  }
}
generateBubbleSortQueue()

let interval: number | undefined = void 0
async function runSort(mark: boolean = true) {
  if (!mark) {
    clearTimeout(interval)
    return
  }

  const forFn = () => {
    clearTimeout(interval)
    const i = runningIndex.value
    const { fn, index } = queue.value[i]! // 获取队列中的排序方法和索引
    sortIndexs.value = [index, index + 1] // 更新正在排序的索引
    runningIndex.value = i + 1 // 更新正在运行第几步
    fn() // 运行排序
    if (i === queue.value.length - 1) {
      finishSort()
    }
    interval = setTimeout(forFn, 800)
  }

  // 使用嵌套setTimeout代替for循环，能够随时暂停/结束
  interval = setTimeout(forFn, 800)
}

function finishSort() {
  sortIndexs.value = []
  runningIndex.value = 0
  clearTimeout(interval)
}

function getNumberBgColor(index: number) {
  return sortedIndexs.value.includes(index)
    ? 'var(--main-color)'
    : sortIndexs.value.includes(index)
      ? 'red'
      : 'var(--light-color)'
}
</script>

<style scoped lang="scss">
.sort-list-move {
  transition: transform 0.5s;
}
</style>
