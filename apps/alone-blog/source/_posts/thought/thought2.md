---
title: 下一个排列
categories: thought
tags:
    - leetcode
    - 技巧
    - 数组
---

LeetCode [31](https://leetcode.cn/problems/next-permutation/description)
整数数组的一个 排列 就是将其所有成员以序列或线性顺序排列。
整数数组的 下一个排列 是指其整数的下一个字典序更大的排列。更正式地，如果数组的所有排列根据其字典顺序从小到大排列在一个容器中，那么数组的 下一个排列 就是在这个有序容器中排在它后面的那个排列。如果不存在下一个更大的排列，那么这个数组必须重排为字典序最小的排列（即，其元素按升序排列）。

<!-- more -->
例如，arr = [1,2,3] 的下一个排列是 [1,3,2]。
类似地，arr = [2,3,1] 的下一个排列是 [3,1,2]。
而 arr = [3,2,1] 的下一个排列是 [1,2,3] ，因为 [3,2,1] 不存在一个字典序更大的排列。

给你一个整数数组 nums ，找出 nums 的下一个排列。
必须 <span style="color: #0088ff88;">原地</span> 修改，只允许使用额外常数空间。

### 1. 思路

- 其实题目的意思就是，对数组的全排列所有情况，升序排序，找到下一个排列情况，如果最大，就返回最小的排列情况。
- 从例子和特殊情况出发，[1, 2, 3]的下一个是[1, 3, 2]；[1, 3, 4, 2]的下一个是[1, 4, 2, 3]。
- 于是猜测变换逻辑：
    - 找到比左右都大的数 记为nums[target]，交换nums[target]和nums[target-1]，然后对target右边的数进行升序排序。
    - 如果target位置是最后一个值，则分两种情况，如果比nums[target-1]大，那就交换nums[target]和nums[target-1]，否则就最大的排列情况，直接翻转数组得到最小排列。

写代码ing~~

- 一提交，没过。[1, 3, 2]按我的逻辑输出了[3, 1, 2]，但应该是[2, 1, 3]。
- 啊哦~不能直接把nums[target]和nums[target-1]交换，那我得找nums[target]和nums[target+1]的较小值，和nums[target-1]交换。

改代码~~

- 再提交，又没过。[2,2,7,5,4,3,2,2,1]按新逻辑输出了[2,<span style="color: #ff0000;">5</span>,1,2,2,2,<span style="color: #ff0000;">3,4</span>,7]，但应该是[2,<span style="color: #ff0000;">3</span>,1,2,2,2,<span style="color: #ff0000;">4,5</span>,7]。
- 啊哦~不能按这种逻辑交换，因为得升序找比当前排列大的排列，所以得找target后面，刚好比target-1大的数，交换它们。
- 那就不能先交换再排序了，试试先对target位置(包括target)开始的数进行升序排序，以这个例子，排序后变为[2,2,1,2,2,3,4,5,7]，然后从target位置向后找，找到第一个大于target-1位置的数，交换，就是正确结果[2,3,1,2,2,2,4,5,7]。

改代码~~

- 再提交，又没过。[4,2,4,4,3]按新逻辑输出了[3,4,4,2,4]，但应该是[4,3,2,4,4]。
- 啊哦~因为我是找比左右两边都大的数，这种情况是找不到的，走了翻转数组的逻辑。直接改为，寻找nums[target]>nums[target-1]且nums[target]<=nums[target+1]试试。

改代码~~

- 再提交，过了！

### 2. 代码实现

```go
/*
 * 先一次遍历，找到最后一个>左边&&<=右边的数 或 最后一个数&&>左边 - 下标记为target
 * 如果target不存在，说明此时数组是倒序排列的，翻转数组即可
 * 如果存在target，且target是最后一个数，把nums[target]和nums[target-1]交换即可
 * 如果target是一般情况，从target位置到数组末尾，进行升序排序(希尔排序)。然后从target位置向后遍历，找到nums[k]>nums[target-1]，交换位置
 */
func nextPermutation(nums []int)  {
    target := 0
    for i := 1; i < len(nums); i++ {
        if nums[i] > nums[i-1] {
            if i == len(nums) - 1 {
                target = i
                break
            }
            if nums[i] >= nums[i+1] {
                target = i
            }
        }
    }

    if target != 0 {
        if target != len(nums)-1 {
			// 对target位置后的数据排序(shell)
			length := len(nums) - target
			for step := length / 2; step > 0; step /= 2 {
				for i := target + 1; i*step < len(nums); i++ {
					k := nums[i*step]
					for j := (i - 1) * step; j >= target; j -= step {
						if nums[j] > k {
							nums[j+step] = nums[j]
							nums[j] = k
						} else {
							break
						}
					}
				}
			}
            
			for p := target; p < len(nums); p++ {
				if nums[p] > nums[target-1] {
					nums[target-1], nums[p] = nums[p], nums[target-1]
					break
				}
			}
		} else {
            // target为末尾
			nums[target], nums[target-1] = nums[target-1], nums[target]
		}
	} else {
        // 翻转
        for a := 0; a < len(nums)/2; a++ {
            b := len(nums) - 1 - a
            nums[a], nums[b] = nums[b], nums[a]
        }
    }
}
```
