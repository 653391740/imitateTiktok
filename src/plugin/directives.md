# 自定义指令使用指南

本文档介绍了项目中可用的自定义指令及其使用方法。

## 指令列表

### 1. v-lazy - 图片懒加载

懒加载图片，当图片进入视口时才加载，提升页面性能。

**使用方法：**
```vue
<template>
  <!-- 基础用法 -->
  <img v-lazy="imageUrl" />

  <!-- 在v-for中使用 -->
  <div v-for="item in list" :key="item.id">
    <img v-lazy="item.image" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: 'https://example.com/image.jpg',
      list: [
        { id: 1, image: 'https://example.com/image1.jpg' },
        { id: 2, image: 'https://example.com/image2.jpg' }
      ]
    }
  }
}
</script>
```

**注意事项：**
- 需要确保项目中存在占位图：`/src/assets/placeholder.png`
- 需要确保项目中存在错误图片：`/src/assets/error.png`

### 2. v-longpress - 长按指令

长按元素时触发回调函数，适用于移动端长按操作。

**使用方法：**
```vue
<template>
  <div v-longpress="handleLongPress">长按我</div>
</template>

<script>
export default {
  methods: {
    handleLongPress() {
      console.log('长按触发了')
      // 执行长按后的操作，如显示菜单
    }
  }
}
</script>
```

### 3. v-debounce - 防抖指令

防止按钮被快速连续点击，默认防抖时间为300ms。

**使用方法：**
```vue
<template>
  <!-- 使用默认防抖时间(300ms) -->
  <button v-debounce="handleSubmit">提交</button>

  <!-- 自定义防抖时间(500ms) -->
  <button v-debounce:500="handleSubmit">提交</button>
</template>

<script>
export default {
  methods: {
    handleSubmit() {
      console.log('提交表单')
      // 执行提交操作
    }
  }
}
</script>
```

### 4. v-throttle - 节流指令

限制函数执行频率，默认节流时间为300ms。

**使用方法：**
```vue
<template>
  <!-- 使用默认节流时间(300ms) -->
  <button v-throttle="handleClick">点击</button>

  <!-- 自定义节流时间(1000ms) -->
  <button v-throttle:1000="handleClick">点击</button>
</template>

<script>
export default {
  methods: {
    handleClick() {
      console.log('按钮被点击')
      // 执行点击操作
    }
  }
}
</script>
```

### 5. v-infinite-scroll - 无限滚动指令

当滚动到页面底部时触发回调，实现无限滚动加载。

**使用方法：**
```vue
<template>
  <div v-infinite-scroll="loadMore" :distance="100">
    <div v-for="item in list" :key="item.id">
      {{ item.content }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { id: 1, content: '内容1' },
        { id: 2, content: '内容2' }
      ],
      page: 1
    }
  },
  methods: {
    async loadMore() {
      // 加载更多数据
      const newData = await fetchMoreData(this.page++)
      this.list.push(...newData)
    }
  }
}
</script>
```

**参数说明：**
- `distance`: 距离底部多少像素时触发加载，默认为100px

## 全局注册

这些指令已经在项目主入口文件中全局注册，可以直接在任何组件中使用，无需额外导入。

## 性能考虑

- 所有指令都在元素卸载时自动清理事件监听器，避免内存泄漏
- 无限滚动指令内置了防抖机制，避免频繁触发
- 懒加载指令使用IntersectionObserver API，性能优于传统滚动监听

## 浏览器兼容性

- IntersectionObserver API在现代浏览器中广泛支持，如需兼容旧版浏览器，可考虑使用polyfill
- 其他指令基于标准DOM API，兼容性良好
