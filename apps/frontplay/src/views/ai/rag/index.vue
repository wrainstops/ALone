<template>
  <div class="h-full w-full">
    <n-split :max="0.75" :min="0.25" class="h-full">
      <template #1>
        <Chat :rag="rag" />
      </template>
      <template #2>
        <StoreVectors :rag="rag" />
      </template>
    </n-split>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { NSplit } from 'naive-ui'
import { SRag } from 's-rag'
import StoreVectors from './storeVectors.vue'
import Chat from './chat.vue'

const rag: SRag = SRag.getInstance()

onMounted(async () => {
  rag.setGlobalEmbedding({ model: 'nomic-embed-text' })
  rag.setGlobalLLM({
    model: 'deepseek-r1:8b',
    config: {
      host: 'http://127.0.0.1:11434',
    },
  })
  await rag.setStorageContext('./context')
  console.log('执行完毕')
})
</script>
