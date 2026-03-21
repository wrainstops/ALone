<template>
  <div class="h-full w-full">
    <n-grid :x-gap="12" :y-gap="8" cols="4 l:6 xl:8" responsive="screen">
      <template v-for="item in list" :key="item.key">
        <n-grid-item>
          <div
            class="h-[60px] flex items-center justify-center rounded hover:bg-(--light-color) hover:cursor-pointer"
            :class="index === item.key ? 'bg-(--main-color)' : ''"
            @click="handleClickSort(item)"
          >
            {{ item.value }}
          </div>
        </n-grid-item>
      </template>
    </n-grid>
    <SortBubble v-if="index === 1" />
    <SortSelect v-if="index === 5" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NGrid, NGridItem } from 'naive-ui'
import { sortList } from '@/constants/algorithm'
import { useSortStore } from '@/stores/sort'
import type { KeyValue } from '#/index'
import SortBubble from './sortBubble.vue'
import SortSelect from './sortSelect.vue'

const sortStore = useSortStore()
const index = computed(() => sortStore.getSortIndex)

const list = sortList

function handleClickSort(item: KeyValue) {
  sortStore.setSortIndex(item.key)
}
</script>
