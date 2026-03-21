<template>
  <div class="flex gap-4 justify-center items-center">
    <n-input
      v-model:value="numberString"
      autosize
      clearable
      type="textarea"
      placeholder="请输入一组数字，使用英文逗号分隔"
      class="w-[40%]!"
    />
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-button text class="text-xl!" @click="handleToggleRunning">
          <n-icon v-if="isRunning"><Pause /></n-icon>
          <n-icon v-else><Play /></n-icon>
        </n-button>
      </template>
      {{ isRunning ? '暂停' : '开始' }}
    </n-tooltip>
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-button text class="text-xl!" @click="handleStopRunning">
          <n-icon><Stop /></n-icon>
        </n-button>
      </template>
      停止
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NInput, NButton, NIcon, NTooltip } from 'naive-ui'
import { Pause, Play, Stop } from '@vicons/ionicons5'

const emit = defineEmits(['setNumberString', 'run', 'stop'])

const numberString = ref('')
const isRunning = ref(false)

function handleStartRunning() {
  isRunning.value = true
}
function handlePauseRunning() {
  isRunning.value = false
}

function handleToggleRunning() {
  isRunning.value = !isRunning.value
  if (numberString.value && isRunning.value) {
    emit('setNumberString', numberString.value)
  }
  emit('run', isRunning.value)
}

function handleStopRunning() {
  isRunning.value = false
  emit('stop')
}

defineExpose({
  handleStartRunning,
  handlePauseRunning,
})
</script>
