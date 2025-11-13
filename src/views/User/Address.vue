<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue'
import json from '@/assets/city.json'
const pxUtils = inject('pxpxUtils')
// 定义props
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})

// 定义emit
const emit = defineEmits(['update:show', 'region-change'])

// 响应式数据
const regionlist = ref(json) // 地区数据列表
const province = ref('北京市') // 当前选中的省份
const citys = ref('北京市') // 当前选中的城市
const areas = ref('东城区') // 当前选中的区域
const Y = ref([0, 0, 0]) // 每个列表的当前移动的Y坐标偏移量
const update_Y = ref(0) // Y轴更新变化
const Velocity = ref(0) // 速度
const time = ref(null) // 触摸开始时间
const scrollToTheBottom = ref(0) // 列表底部位置
const calendar = ref(null) // 日历引用

// 计算属性
const provlist = computed(() => {
    const provinceName = province.value || '北京市';
    return regionlist.value.find(e => e.province === provinceName)?.citys || [];
})

const citylist = computed(() => {
    const cityName = citys.value || '北京市';
    return provlist.value.find(e => e.city === cityName)?.areas || [];
})

// 方法
const confirm = () => {
    emit('update:show', false)
    emit('region-change', `${province.value}${citys.value}${areas.value}`)
}

const handleResize = () => {
    update(0, 0)
    calendar.value.children[0].style.transform = `translateY(0px)`
    Y.value[0] = 0;
}

const handleTouchStart = (e, type) => {
    calendar.value.children[type].style.transition = 'none';
    // 拿到当前按下的列表的长度
    const typeLength = type === 0 ? regionlist.value.length :
        type === 1 ? provlist.value.length : citylist.value.length
    // 计算当前列表的底部位置
    scrollToTheBottom.value = (typeLength - 1) * pxUtils(44);
    StartY = e.touches[0].clientY;
}

let StartY = 0; // 开始触摸的Y坐标

const handleTouchMove = (e, type) => {
    // 触摸移动距离
    const scrollDistance = e.touches[0].clientY - StartY
    const deltaMove = Math.min(Math.max(Y.value[type] - scrollDistance, 0), scrollToTheBottom.value)
    calendar.value.children[type].style.transform = `translateY(-${deltaMove}px)`
    const now = new Date()// 计算移动速度
    const deltaTime = now - time.value
    Velocity.value = (deltaMove - update_Y.value) / deltaTime
    time.value = now// 更新最新的Y坐标偏移量和时间
    update_Y.value = deltaMove
}

const reset = (type) => {
    calendar.value.children[type].style.transform = `translateY(0px)`
    Y.value[type] = 0;
}

const update = (type, i) => {
    if (type == 0) {
        province.value = regionlist.value[i].province
        citys.value = provlist.value[0].city
        areas.value = citylist.value[0].area
        reset(1)
        reset(2)
    } else if (type == 1) {
        citys.value = provlist.value[i].city
        areas.value = citylist.value[0].area
        reset(2)
    } else if (type == 2) {
        areas.value = citylist.value[i].area
    }
}

const handleTouchEnd = (e, type) => {
    const dome = calendar.value.children[type] // 当前滚动列表元素
    const inertiaDistance = Velocity.value * 300; // 惯性距离 = 速度 * 惯性系数
    let finalPosition = update_Y.value + inertiaDistance;
    finalPosition = Math.min(Math.max(finalPosition, 0), scrollToTheBottom.value);
    const actualItemHeight = pxUtils(44); // 每个item的高度
    const currentIndex = Math.round(finalPosition / actualItemHeight);
    Y.value[type] = currentIndex * actualItemHeight;
    dome.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    dome.style.transform = `translateY(-${Y.value[type]}px)`;
    setTimeout(() => { update(type, currentIndex) }, 500)
}
onMounted(() => {
    window.addEventListener('resize', handleResize);
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
})
</script>

<template>
    <div class="box">
        <div class="toolbar">
            <div class="close" @click="$emit('update:show', false)">取消</div>
            <div class="confirm" @click="confirm">确认</div>
        </div>
        <div class="calendar" ref="calendar">
            <!-- 0 / 1 / 2 分别对应 省份 / 城市 / 区域 -->
            <ul @touchstart="handleTouchStart($event, 0)" @touchmove="handleTouchMove($event, 0)"
                @touchend="handleTouchEnd($event, 0)">
                <li v-for="(e, i) in regionlist" :key="e.province">{{ e.province }}</li>
            </ul>
            <ul @touchstart="handleTouchStart($event, 1)" @touchmove="handleTouchMove($event, 1)"
                @touchend="handleTouchEnd($event, 1)">
                <li v-for="(e, i) in provlist" :key="e.city">{{ e.city }}</li>
            </ul>
            <ul @touchstart="handleTouchStart($event, 2)" @touchmove="handleTouchMove($event, 2)"
                @touchend="handleTouchEnd($event, 2)">
                <li v-for="(e, i) in citylist" :key="e.area">{{ e.area }}</li>
            </ul>
            <div class="selected"></div>
            <div class="pop"></div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.box {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 300px;
    background-color: #fff;

    .toolbar {
        display: flex;
        justify-content: space-between;

        div {
            padding: 0 16px;
            line-height: 44px;
            font-size: 14px;
        }

        .close {
            color: #969799;
        }

        .confirm {
            color: #576b95;
        }
    }
}

.calendar {
    display: flex;
    height: 300px;
    overflow: hidden;
    position: relative;

    .pop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(#ffffff, transparent calc(50% - 22px), transparent calc(50% + 22px), #fff);
        z-index: 1;
        pointer-events: none;
    }

    ul {
        transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        padding: 128px 0;
        /* 上下内边距与 JS 中 this.padding 一致 */
        text-align: center;
        width: calc(100% / 3);

        li {
            line-height: 44px;
            white-space: nowrap;
        }
    }

    .selected {
        position: absolute;
        width: 100%;
        height: 44px;
        border: solid #ccc;
        border-width: 1px 0 1px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }
}
</style>