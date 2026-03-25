<template>
  <div class="w-full h-full relative bg-[#0c0c0cee]">
    <LetterGlitch />
    <div
      class="flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-500/50 shadow-lg shadow-gray-500/70 p-16 rounded-full"
    >
      <div class="text-white text-8xl font-bold pointer-events-none">404</div>
      <div class="text-white text-6xl font-bold pointer-events-none">You are lost</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LetterGlitch from '@/component/LetterGlitch/LetterGlitch.vue'
</script>
