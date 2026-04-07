<template>
  <div class="h-full overflow-auto">
    <div class="m-4">
      <n-input
        v-model:value="prompt"
        type="textarea"
        :autosize="{ minRows: 3 }"
        clearable
        placeholder="document"
        class="mt-4 mb-4"
      />
      <n-flex>
        <n-upload ref="uploadRef" :max="1" :default-upload="false" @change="handleUploadChange">
          <n-button>选择pdf文件</n-button>
        </n-upload>
        <n-button type="primary" :loading="btnLoading" @click="handleStoreVectors"
          >生成索引</n-button
        >
      </n-flex>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import { NInput, NFlex, NUpload, NButton, useMessage, type UploadFileInfo } from 'naive-ui'
import * as pdfjsLib from 'pdfjs-dist'
import { SRag } from 's-rag'

const props = defineProps({
  rag: {
    type: Object as PropType<SRag>,
    required: true,
  },
})

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'
const message = useMessage()
const prompt = ref('')
const btnLoading = ref(false)

function handleUploadChange(options: { fileList: UploadFileInfo[] }) {
  const file = options.fileList[0]?.file as File
  if (file) {
    const url = URL.createObjectURL(file)
    renderPdf(url)
  }
}

async function renderPdf(path: string) {
  try {
    const pdf = await pdfjsLib.getDocument(path).promise
    console.log('res', pdf)
    const numPages = pdf.numPages
    let finallyText = ''
    for (let page = 1; page <= numPages; page++) {
      const pageContext = await pdf.getPage(page)
      const pageText = await pageContext.getTextContent()
      console.log(`第${page}页, 内容是: `, pageText)
      finallyText += `${pageText.items.map((item: any) => item.str).join(' ')}`
    }
    prompt.value = finallyText
    console.log('finallyText: ', finallyText)
  } catch (error) {
    message.error('处理pdf失败, error: ' + error)
  }
}

async function handleStoreVectors() {
  if (!prompt.value) return
  try {
    btnLoading.value = true
    props.rag.setTextDocuments([prompt.value])
    await props.rag.storeVectors()
    console.log('索引生成成功')
    message.success('索引生成成功')
  } catch (error) {
    message.error('索引生成失败, error: ' + error)
  } finally {
    btnLoading.value = false
  }
}
</script>
