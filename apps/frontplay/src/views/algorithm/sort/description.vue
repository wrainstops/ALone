<template>
  <div class="mt-8">
    <n-h3 class="mb-1!">理解</n-h3>
    <div class="flex justify-center px-2">
      <n-card embedded :bordered="false">
        <!-- tailwind css会污染markdown的样式，添加md-box类名，将其内部所有元素的所有样式的继承值还原回初始状态 -->
        <div v-html="mdContent" class="md-box"></div>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NH3, NCard } from 'naive-ui'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/github.css'

const mdConstructor = new MarkdownIt({
  html: true, // 启用html标签
  breaks: true, // 启用换行符\n
  linkify: true, // 允许链接
  highlight: (code: string, lang: string): string => {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang }).value}</code></pre>`
    }
    return `<pre class="hljs"><code>${mdConstructor.utils.escapeHtml(code)}</code></pre>`
  },
})

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})

const mdContent = computed(() => mdConstructor.render(props.content))
</script>

<style scoped lang="scss">
.md-box {
  * {
    all: revert;
  }
}
</style>
