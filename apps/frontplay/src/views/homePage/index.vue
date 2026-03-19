<template>
  <div class="h-full w-full bg-black relative">
    <Galaxy :density="2" :saturation="0.6" />
    <div
      class="flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <h1 class="text-white text-4xl font-bold pointer-events-none">Front Play</h1>
      <div class="flex gap-4 mt-4">
        <n-button type="primary" dashed @click="handleClick">开始使用</n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NButton } from 'naive-ui'
import Galaxy from '@/component/Galaxy/Galaxy.vue'

const router = useRouter()

function handleClick() {
  router.push('/algorithm')
}
</script>
