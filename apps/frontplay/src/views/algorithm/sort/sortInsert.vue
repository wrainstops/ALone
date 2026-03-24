<template>
  <div class="mt-4">
    <n-h3>插入排序</n-h3>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { NH3, NEquation, useMessage } from 'naive-ui'
import Widget from './widget.vue'
import { numberStringToList } from '@/utils/sort'
import type { LabelValueOption, KeyValue } from '#/index'

const message = useMessage()

const equation = '\\displaystyle时间复杂度: O(n^2); 空间复杂度: O(1)'
const widgetRef = ref<typeof Widget>()
const numberString = ref<string>('2,1,5,4,3')
const numberList = ref<LabelValueOption>([])

// 字符串分隔为数组
function setNumberList(str: string) {
  if (numberStringToList(str) instanceof Error) {
    message.error((numberStringToList(str) as Error).message, { duration: 5000 })
    numberList.value = []
  } else {
    numberList.value = numberStringToList(str) as LabelValueOption
  }
}
setNumberList(numberString.value)

const queue = ref<KeyValue[]>([])
const runningIndex = ref(0) // 正在运行第几步
const sortIndexs = ref<number[]>([]) // 要插入的索引和当前遍历到的索引
const sortedMaxIndex = ref<number>(0) // 已排序的最大索引，小于等于此值视为已排序

// 生成插入排序的操作队列
function generateInsertSortQueue() {
  queue.value = []
  const len = numberList.value.length
  for (let i = 1; i < len; i++) {
    let k = numberList.value[i]!.value
    for (let j = i - 1; j >= 0; j--) {
      if (numberList.value[j]!.value > k) {
        /**
         * 原本是j+1处放j的值，j放k
         * => numberList.value[j + 1]!.value = numberList.value[j]!.value; numberList.value[j]!.value = k
         * 但是要实现动画，就不能单纯交换值，需要交换两个numberList中的对象
         * 所以变通一下，交换j+1和j的对象，因为执行过fn后，j+1处的值就是k
         * 解释：k = arr[i]；第一次执行fn时，j+1处肯定是k；后续执行时，将k的值赋值给arr[j]，这样j--后再进到fn，j+1处还是k
         */
        const fn = () => {
          ;[numberList.value[j + 1], numberList.value[j]] = [
            numberList.value[j]!,
            numberList.value[j + 1]!,
          ]
          sortedMaxIndex.value = i
        }
        queue.value.push({ fn, index1: i, index2: j })
      }
    }
  }
}
generateInsertSortQueue()

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
  sortedMaxIndex.value = 0
  finishSort()
  runningIndex.value = 0
  setNumberList(numberString.value)
  generateInsertSortQueue()
}

// 设置一组排序的数字
function setNumberString(str: string) {
  if (str === numberString.value) return
  numberString.value = str
  stopSort()
  widgetRef.value?.handleStartRunning()
}

function getNumberBgColor(index: number): string {
  if (sortIndexs.value.includes(index)) {
    return 'var(--error-color)'
  } else if (index <= sortedMaxIndex.value) {
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
