<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex-1 mt-4 mx-2 px-4 border border-dashed border-gray-300 rounded overflow-auto">
      <ChatHistory :message-list="messageList" />
    </div>
    <div class="w-full h-20 relative my-4 px-2">
      <n-input
        v-model:value="sendMessage"
        type="textarea"
        placeholder="有什么可以帮您？"
        class="w-full"
        @keydown.enter="handleEnter"
      />
      <n-button
        type="primary"
        size="tiny"
        circle
        dashed
        :loading="sendLoading"
        class="absolute! right-4 bottom-2 cursor-pointer"
        @click="handleSend"
      >
        <template #icon>
          <n-icon><ArrowUpOutline /></n-icon>
        </template>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import { NInput, NIcon, NButton } from 'naive-ui'
import { ArrowUpOutline } from '@vicons/ionicons5'
import { SRag } from 's-rag'
import type { Message } from '#/index'
import ChatHistory from './chatHistory.vue'

const props = defineProps({
  rag: {
    type: Object as PropType<SRag>,
    required: true,
  },
})

const sendMessage = ref('')
const sendLoading = ref(false)

const messageList = ref<Message[]>([])

function handleEnter(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    if (!e.ctrlKey) {
      e.preventDefault()
      handleSend()
    } else {
      sendMessage.value += '\n'
    }
  }
}

async function handleSend() {
  if (!sendMessage.value) return
  try {
    sendLoading.value = true
    const query = sendMessage.value
    messageList.value.push({
      role: 'sender',
      name: 'You',
      content: query,
    })
    messageList.value.push({
      role: 'receiver',
      name: 'AI',
      content: '...',
    })
    sendMessage.value = ''
    await props.rag.initializeQueryEngine()
    console.log('---------回答ing---------')
    const res = await props.rag.query({ query: query, stream: true })
    let inThinking = true
    for await (const chunk of res) {
      const lastMessage = messageList.value[messageList.value.length - 1]

      if (chunk.message.content) {
        if (inThinking) {
          if (lastMessage) {
            lastMessage.content = ''
          }
          inThinking = false
        }
        if (lastMessage) {
          lastMessage.content += chunk.message.content
        }
      }
    }
  } catch (error) {
    console.error('error: ', error)
  } finally {
    sendLoading.value = false
  }
}
</script>
