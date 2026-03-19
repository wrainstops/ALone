import { type Component, h } from 'vue'
import { RouterLink } from 'vue-router'
import { NIcon } from 'naive-ui'

export function renderRouterLink(path: string, name: string) {
  return () => h(RouterLink, { to: { path: path } }, { default: () => name })
}

export function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
