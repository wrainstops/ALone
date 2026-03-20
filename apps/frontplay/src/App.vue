<template>
  <n-config-provider :katex="katex" class="h-full w-full">
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider } from 'naive-ui'
import katex from 'katex'
import 'katex/dist/katex.css'
</script>
