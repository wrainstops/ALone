<template>
  <div
    v-for="(message, index) in messageList"
    :key="index"
    class="w-full flex gap-2 mt-3"
    :style="{ flexDirection: message.role === 'sender' ? 'row-reverse' : 'row' }"
  >
    <n-avatar round :style="{ color: 'var(--main-color)' }">{{ message.name }}</n-avatar>
    <div class="w-[80%] p-2 rounded bg-gray-200 break-all whitespace-pre-wrap">
      {{ message.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import { NAvatar } from 'naive-ui'
import type { Message } from '#/index'

const props = defineProps({
  messageList: {
    type: Array as PropType<Message[]>,
    default: () => [],
  },
})
</script>
