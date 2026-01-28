---
title: e-coding
categories: project
tags:
  - 低代码
---

前端低代码平台 e-coding
通过json配置生成组件，组件合成页面

<!-- more -->

### 一、 开发前准备

#### 1. 思路与计划

1. 计划采用turborepo管理项目，分模块开发，包括editor编辑器，example示例；core核心包。通过拖拽组件，生成json配置，再将json配置转换为组件渲染。
2. editor编辑器，包含组件库，拖拽编辑，组件配置项等。
3. core核心包，包含组件渲染等。

#### 2. 主要依赖

1. antd
2. react-dnd

### 二、editor编辑器

#### 1. 整体布局

1. 分三栏，左侧为组件库，中间为拖拽编辑区域，右侧为组件配置项。
