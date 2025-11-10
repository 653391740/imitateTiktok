# 项目问题记录与解决方案

本文档用于记录项目开发过程中遇到的问题及其解决方案。

---

## 问题 #001: Sticky 定位导致滚动位置不准确

**日期**: 2023-11-10
**状态**: 已解决
**优先级**: 中

### 问题描述

在 `both.vue` 组件中，`.title` 元素使用了 `position: sticky` 定位，这导致了滚动定位不准确的问题。当使用 `scrollToLetter` 方法进行字母索引定位时：

- 从上往下滚动（如A到B）可以准确定位，因为 sticky 元素会正常吸附在顶部
- 从下往上滚动（如B到A）无法准确定位到开始位置，因为 sticky 元素会保持在视口顶部

### 问题分析

#### 原始代码分析

原始的 `scrollToLetter` 方法实现如下：

```javascript
const scrollToLetter = (val) => {
    const container = stickyElm.value
    if (!container) return
    const titles = Array.from(container.children)
    const target = titles.find(t => t.children[0].textContent.trim() === val)
    if (target) {
        const targetTop = target.getBoundingClientRect().top
        const containerTop = container.getBoundingClientRect().top
        const offsetTop = targetTop - containerTop + container.scrollTop
        container.scrollTo({ top: offsetTop, behavior: 'smooth' })
    }
    activeLetter.value = val
}
```

#### 问题根源

1. 当从上往下滚动时，sticky 元素会正常吸附在视口顶部，计算出的偏移量是正确的。
2. 当从下往上滚动时，sticky 元素已经吸附在视口顶部，但计算偏移量时没有考虑 sticky 元素的高度，导致滚动位置不准确。

### 解决方案

修改 `scrollToLetter` 方法，在计算偏移量时考虑 sticky 元素的高度：

```javascript
const scrollToLetter = (val) => {
    const container = stickyElm.value
    if (!container) return
    const titles = Array.from(container.children)
    const target = titles.find(t => t.children[0].textContent.trim() === val)
    if (target) {
        // 获取标题元素的高度，用于计算偏移量
        const titleHeight = target.children[0].offsetHeight
        // 计算目标位置，考虑sticky定位的影响
        const targetTop = target.getBoundingClientRect().top
        const containerTop = container.getBoundingClientRect().top
        const offsetTop = targetTop - containerTop + container.scrollTop - titleHeight
        container.scrollTo({ top: offsetTop, behavior: 'smooth' })
    }
    activeLetter.value = val
}
```

### 解决方案原理

1. 添加了获取标题元素高度的代码：`const titleHeight = target.children[0].offsetHeight`
2. 修改了偏移量计算，减去了标题元素的高度：`const offsetTop = targetTop - containerTop + container.scrollTop - titleHeight`

通过减去 sticky 元素的高度，确保无论从哪个方向滚动，都能准确定位到目标字母分组的开始位置，而不是停留在 sticky 标题的位置。

### 代码位置

- 文件路径：`src/components/both.vue`
- 涉及方法：`scrollToLetter`
- 修改行数：约 60-72 行

### 验证结果

修改后，无论从哪个字母滚动到目标字母，都能准确定位到目标字母分组的开始位置，解决了 sticky 定位导致的滚动不准确问题。

### 技术要点

1. **Sticky 定位特性**：Sticky 定位元素会在滚动到特定位置时"粘"在视口中，这在计算滚动位置时需要特别考虑。

2. **getBoundingClientRect()**：获取元素相对于视口的位置信息，是计算滚动偏移量的关键。

3. **offsetHeight**：获取元素的像素高度，包括垂直内边距和边框，但不包括外边距。

4. **scrollTo()**：平滑滚动到指定位置，提供良好的用户体验。

### 总结

这个修复展示了在处理 sticky 定位元素时，需要考虑其特殊的行为特性，特别是在计算滚动位置时。通过简单地调整偏移量计算，我们解决了从下往上滚动时定位不准确的问题，提升了用户体验。

---

*（后续问题可在此文档下方继续添加，格式参考问题 #001）*
