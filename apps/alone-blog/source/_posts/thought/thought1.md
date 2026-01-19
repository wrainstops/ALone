---
title: 缺失的第一个正数
categories: thought
tags:
    - leetcode
    - 数组
---

LeetCode [41](https://leetcode.cn/problems/first-missing-positive/description/)
给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。
请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。

<!-- more -->

### 1. 思路

- 看到题目，不考虑时间复杂度的话，我会选择排序，然后进行一次遍历，就可以找到缺失的第一个正数。
- 但是题目要求时间复杂度为0(n)，一说0(n)，会想到只能一层遍历，那就使用哈希表，把数组的数存到哈希表里，然后从1开始向后遍历正数，第一个不在哈希表里的，就是缺失的。
- 但是题目要求是常数级别的额外空间。
- 又考虑过位运算，想到了[136](https://leetcode.cn/problems/single-number/description/)题，但不适用。
<i style="color: #FF000088;">止步于此</i>

---

### 2. 题解

其实还是哈希表的思路。首先明确：对于一个长度为n的数组，如果都是整数，也就1\~n，那么缺失的第一个整数就是n+1，否则就是1\~n其中的一个数。
使用每一项元素的值-1(因为下标从0开始)，作为数组下标，为下标对应的元素打上标记（变为它的负数），这样第一个不是负数的下标+1，就是缺失的第一个正数，如果全为负数，则是数组长度+1。

1. 遍历数组，把所有非正数改写为n+1。因为后面要用到每项元素的绝对值，作为下标查找。
2. 遍历数组，取每项元素的值的绝对值-1，作为下标。如果下标<数组长度(即：可索引)且下标索引到的元素>0(未打过标记，因为可能有重复的数，不需要重复取相反数，否则就变回正数了)，就对下标索引到的数，取相反数变为负数。
3. 在数组末尾添加元素1(如果1~n都有，那么此时数组的第一个正数就是1，下标为数组长度+1)。
4. 遍历数组，寻找第一个正数的下标i，i+1就是所求的缺失第一个正数。

### 3. 代码实现

```go
func firstMissingPositive(nums []int) int {
    // 1
    for i := range nums {
        if nums[i] <= 0 {
            nums[i] = len(nums) + 1
        }
    }

    // 2
    for j := range nums {
        target := int(math.Abs(float64(nums[j])))-1
        if target < len(nums) && nums[target] > 0 {
            nums[target] = -nums[target]
        }
    }

    // 3
    nums = append(nums, 1)

    // 4
    res := 0
    for k := range nums {
        if nums[k] > 0 {
            res = k + 1
            break
        }
    }

    return res
}
```
