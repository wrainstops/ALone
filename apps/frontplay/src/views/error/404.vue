<template>
  <div class="w-full h-full flex items-center justify-center bg-[#dbdbdc]">
    <n-image :src="Img404" preview-disabled object-fit="contain"></n-image>
  </div>
</template>

<script setup lang="ts">
import { NImage } from 'naive-ui'
import Img404 from '@/assets/image/404.png'
</script>
