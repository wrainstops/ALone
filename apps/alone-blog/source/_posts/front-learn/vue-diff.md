---
title: Vue3 diff算法
categories: 前端
tags:
  - vue3
  - diff
---

diff算法是一种比对算法，比对新旧虚拟DOM，得出哪个虚拟节点做了更改，仅更新更改的虚拟节点对应的真实节点，从而精准地更新真实DOM，减少开销提升性能。
vue3使用快速diff算法，核心方法是patchKeyedChildren。先比对处理相同的前置节点和后置节点，再处理剩余节点（1. 只有新的有节点剩余，只需插入；2. 只有旧的有节点剩余，只需删除；3. 新旧都有节点剩余，构建节点索引关系和最长递增子序列，对节点依次处理）。

<!-- more -->

### 实现过程

#### 1. 前置节点比对

![diff-1](diff-1.png)
定义指针`i`，从第一个前置节点开始向后比对，直到遍历完新/老DOM节点。比对过程中，如果两个节点相同，则patch节点，然后指针i向后移动；如果不同，则固定i的位置，跳出循环。接着进入后置节点比对。

#### 2. 后置节点比对

![diff-2](diff-2.png)
定义指针`e1=老DOM节点长度-1`，`e2=新DOM节点长度-1`。从后置节点往前比对，直到`e1或e2小于i`。比对过程与前置节点比对相同，如果两个节点相同，则则patch节点，然后指针e1和e2同时向前移动；如果不同，则固定e1和e2的位置，跳出循环。接着处理剩余节点。

#### 3. 剩余节点处理

剩余节点有三种情况：只有新DOM节点有剩余；只有老DOM节点有剩余；新老DOM节点都有剩余。

##### 1. 只有新DOM节点有剩余

![diff-3](diff-3.png)
`i>e1且i<=e2`时，表示只有新DOM节点有剩余，只需遍历从i到e2的所有节点，插入即可。

##### 2. 只有老DOM节点有剩余

![diff-4](diff-4.png)
`i>e2且i<=e1`时，表示只有老DOM节点有剩余，只需遍历从i到e1的所有节点，卸载即可。

##### 3. 新老DOM节点都有剩余

![diff-5](diff-5.png)

1. 从i到e2遍历新DOM节点，构建索引表keyToNewIndexMap，键为新DOM节点的key，值为新DOM节点的索引。
2. 创建数组newIndexToOldIndexMap，长度为`e2-i+1`即新DOM节点剩余数量，初始值均设为0。
3. 从i到e1遍历老DOM节点（`j=i; j<=e1; j++`），期间要记录：已patch的节点数patched、最远下标maxNewIndexSoFar、移动标记moved
   - 如果patched大于等于数组长度，剩余的节点都是需要删除的，直接卸载然后continue。
   - 用当前节点的key去索引表中寻找，如果不存在，说明此节点需要删除，直接卸载
   - 如果存在，获取对应的值index，更新数组，将下标为`index-i`的元素设为`j+1`（这里+1是为了和0区分，0是表示需要插入的节点）。如果`index>=maxNewIndexSoFar`，将maxNewIndexSoFar设置为index；否则将moved标记为true，表示有节点需要移动（这是因为，正常向右遍历，最远下标在递增，如果在索引表中找到的值小于最远下标，说明该节点前移了）。然后patch节点。
4. 获取newIndexToOldIndexMap中最长递增子序列的下标数组increasingNewIndexSequence，定义p为其长度-1。
5. 从后向前遍历newIndexToOldIndexMap（索引记为q），如果值为0，则是需要插入的节点，直接patch；如果移动标记moved为true，如果`p>0且q==increasingNewIndexSequence[p]`，`p--; q--`（q节点在最长子序列中，p和q同时上移），不做额外操作，否则对q节点进行move操作。
