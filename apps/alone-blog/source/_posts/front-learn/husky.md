---
title: 前端项目规范husky+lint-staged
categories: 前端
tags:
    - husky
    - lint-staged
---

husky 优化您的提交记录和其他功能，能自动检查提交信息、代码，并在提交或推送时运行测试。
lint-staged 是一个在Git暂存区的文件上运行代码检查的工具。
二者配合使用，在代码提交前的hook中加入lint-staged命令，对即将提交的代码进行格式化。

<!-- more -->

### 一、 husky

#### 1. install

```bash
pnpm add --save-dev husky
```

#### 2. husky init

```bash
pnpm exec husky init
```

### 二、lint-staged

#### 1. install

```bash
pnpm add --save-dev lint-staged
```

#### 2. 加入husky的hook中

```bash
# .husky/pre-commit
pnpm lint-staged
```

#### 3. 配置lint-staged

1. 直接在package.json中配置

```json
"lint-staged": {
    "*.{tsx,jsx,ts,js}": [
        "prettier --write"
    ],
    "*.{scss}": [
        "stylelint --fix"
    ]
}
```

2. 创建文件.lintstagedrc.json（或yaml文件）

```json
{
    "*.{tsx,jsx,ts,js}": [
      "prettier --write"
    ],
    "*.{scss}": [
      "stylelint --fix"
    ]
}
```

### 三、补全依赖

#### 1. 安装使用prettier

1. 安装

```bash
pnpm add --save-dev --save-exact prettier
```

2. 创建.prettierrc，新增配置

3. 格式化所有文件

```bash
pnpm exec prettier . --write
```

#### 2. 安装使用stylelint

1. 安装

```bash
pnpm add --save-dev stylelint stylelint-config-standard-scss
```

2. 创建.stylelintrc.json文件，新增配置

3. 在.stylelintrc.json文件中新增

```json
"extends": "stylelint-config-standard-scss"
```

#### 3. 安装使用eslint

1. 安装

```bash
pnpm add -save-dev eslint
```

2. 生成配置文件

```bash
npx eslint --init
```