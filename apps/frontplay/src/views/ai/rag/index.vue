<template>
  <div class="h-full w-full">
    <n-split :max="0.75" :min="0.25" class="h-full">
      <template #1>
        <div class="h-full overflow-auto">
          <div>left</div>
        </div>
      </template>
      <template #2>
        <div class="h-full overflow-auto">
          <div class="m-4">
            <n-upload ref="uploadRef" :default-upload="false" @change="handleUploadChange">
              <n-button>选择pdf文件</n-button>
            </n-upload>
          </div>
        </div>
      </template>
    </n-split>
  </div>
</template>

<script setup lang="ts">
import { NSplit, NUpload, NButton, useMessage, type UploadFileInfo } from 'naive-ui'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'
const message = useMessage()

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
    console.log('finallyText: ', finallyText)
  } catch (error) {
    message.error('处理pdf失败, error: ' + error)
  }
}
</script>
