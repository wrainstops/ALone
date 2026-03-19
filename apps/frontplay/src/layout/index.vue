<template>
  <n-layout has-sider class="h-full">
    <n-layout-sider
      bordered
      show-trigger
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :native-scrollbar="false"
    >
      <n-menu
        :value="route.path"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
      />
    </n-layout-sider>
    <n-layout content-style="padding: 12px;">
      <router-view></router-view>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { NLayout, NLayoutSider, NMenu, type MenuOption } from 'naive-ui'
import { LibraryOutline, AnalyticsOutline } from '@vicons/ionicons5'
import { renderRouterLink, renderIcon } from '@/utils'

const route = useRoute()

const menuOptions: MenuOption[] = [
  {
    label: '算法',
    key: '/algorithm',
    icon: renderIcon(LibraryOutline),
    children: [
      {
        label: renderRouterLink('/algorithm/sort', '排序'),
        key: '/algorithm/sort',
        icon: renderIcon(AnalyticsOutline),
      },
    ],
  },
]
</script>

<style scoped lang="scss">
:deep(.n-layout-toggle-button) {
  top: 10%;
}
</style>
