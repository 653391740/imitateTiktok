# Popup组件跟随页面移动问题

## 问题描述

Popup组件虽然使用了`position: fixed`定位，但在User页面中滚动时，Popup组件会跟着页面一起移动，而不是保持在固定位置。

## 问题原因

1. Popup组件使用了`position: fixed`定位，理论上应该相对于视口固定定位
2. 但Popup组件被渲染在User页面的`.userinfo-container`内部
3. `.userinfo-container`容器有以下样式：
   - `overflow: auto` - 允许滚动
   - `height: 100vh` - 固定高度
4. 当这个容器滚动时，即使内部有`position: fixed`的元素，也会受到容器滚动的影响

## 解决方案

使用Vue的`<teleport>`组件，将Popup组件"传送"到`<body>`元素下：

```vue
<teleport to="body">
    <popup class="popupRef" position="right" background="#161622" :show="showPopup">
        <!-- popup内容 -->
    </popup>
</teleport>
```

## 解决方案原理

1. `<teleport to="body">`将Popup组件渲染到`<body>`元素下，而不是当前组件的DOM结构中
2. 这样Popup组件不再位于`.userinfo-container`内部
3. `position: fixed`现在可以正常工作，相对于视口固定定位
4. 不受任何滚动容器影响

## 修改文件

- `src/views/User/VideosNum.vue`：在Popup组件外添加`<teleport to="body">`包装

## 效果

修改后，无论User页面如何滚动，Popup组件都会保持在固定的位置，不会跟着页面移动。

## 相关知识点

1. CSS `position: fixed`的定位是相对于最近的"定位上下文"，如果没有则是相对于视口
2. 当`position: fixed`元素位于有`transform`属性的父元素内时，它的定位会相对于该父元素
3. Vue的`<teleport>`组件可以将组件渲染到DOM树的任意位置，不受当前组件层级限制