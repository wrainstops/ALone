<template>
  <div class="mt-8">
    <n-h3 class="mb-1!">代码实现</n-h3>
    <div class="flex justify-center">
      <n-code
        show-line-numbers
        language="javascript"
        :code="code"
        class="w-[75%] bg-gray-100! p-2 rounded"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NH3, NCode } from 'naive-ui'

defineProps({
  code: {
    type: String,
    default: '',
  },
})
</script>
