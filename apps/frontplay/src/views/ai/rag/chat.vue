<template>
  <div class="h-full w-full relative">
    <div class="w-full absolute bottom-4 px-2">
      <n-input
        v-model:value="sendMessage"
        type="textarea"
        placeholder="有什么可以帮您？"
        class="w-full"
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

const props = defineProps({
  rag: {
    type: Object as PropType<SRag>,
    required: true,
  },
})

const sendMessage = ref('')
const sendLoading = ref(false)

async function handleSend() {
  if (!sendMessage.value) return
  try {
    sendLoading.value = true
    await props.rag.initializeQueryEngine()
    console.log('---------回答ing---------')
    const res = await props.rag.query({ query: sendMessage.value, stream: false })
    console.log('res -----> ', res)
  } catch (error) {
    console.error('error: ', error)
  } finally {
    sendLoading.value = false
  }
}
</script>
