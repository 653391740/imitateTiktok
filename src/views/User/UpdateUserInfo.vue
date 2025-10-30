<script setup>
import Title from '@/components/title.vue'
import { loginStore } from '@/stores/counter'
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { uploadAvatar, modifyUserInfo } from '@/api/user'

const { proxy } = getCurrentInstance()
const { userinfo, updateUserInfo } = loginStore()
const userInfo = ref({ ...userinfo })
const router = useRouter()

const croppedSrc = ref('') // 用于存储原始图片base64编码
const croppedCompleted = ref('') // 用于存储裁切后的图片base64编码
const img = ref(null) // 图片元素
const canvasContainer = ref(null) // 裁切容器

const startX = ref(0) // 记录触摸开始时的X坐标
const startY = ref(0) // 记录触摸开始时的Y坐标
const canvasLeft = ref(0) // 记录canvas当前的left值
const canvasTop = ref(0) // 记录canvas当前的top值

const fileInput = ref(null)

// 处理文件选择
const handleChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        croppedSrc.value = reader.result
    }
    fileInput.value.value = ''
    createCanvas()
}
// 创建canvas裁切区域
const createCanvas = () => {
    img.value.onload = () => {
        const { height, width } = img.value.getBoundingClientRect()
        const canvasSize = height
        // 设置canvas的CSS样式尺寸
        canvasContainer.value.style.width = canvasSize + 'px'
        canvasContainer.value.style.height = canvasSize + 'px'

        // 初始化canvas位置为居中
        canvasLeft.value = (width - canvasSize) / 2
        canvasTop.value = (height - canvasSize) / 2

        updateCanvasPosition()
    }
}

// 更新canvas位置
const updateCanvasPosition = () => {
    if (canvasContainer.value && img.value) {
        const { top } = img.value.getBoundingClientRect()
        canvasContainer.value.style.left = `${canvasLeft.value}px`
        canvasContainer.value.style.top = `${top + canvasTop.value}px`
    }
}
// 处理触摸开始事件
const handleTouchStart = (e) => {
    if (isDragging.value) return
    const touch = e.touches[0]
    startX.value = touch.clientX - canvasLeft.value
    startY.value = touch.clientY - canvasTop.value
    e.preventDefault()
}
// 处理触摸移动事件
const handleTouchMove = (e) => {
    if (isDragging.value) return
    if (!croppedSrc.value || !img.value || !canvasContainer.value) return

    const touch = e.touches[0]
    const { width, height } = img.value.getBoundingClientRect()
    const { width: canvasSize } = canvasContainer.value.getBoundingClientRect()
    // 计算新位置
    let newLeft = touch.clientX - startX.value
    let newTop = touch.clientY - startY.value

    // 限制在img范围内
    newLeft = Math.max(0, Math.min(newLeft, width - canvasSize))
    newTop = Math.max(0, Math.min(newTop, height - canvasSize))

    canvasLeft.value = newLeft
    canvasTop.value = newTop

    updateCanvasPosition()
    e.preventDefault()
}

const isDragging = ref(false) // 是否正在调整canvas大小
const prevCanvasSize = ref(0) // 记录调整前的canvas大小
// 处理canvas大小调整触摸开始事件
const canvasSizeTouchStart = (e) => {
    isDragging.value = true
    const touch = e.touches[0]
    startX.value = touch.clientX - canvasLeft.value // 记录触摸点与canvas左边界的距离
    startY.value = touch.clientY - canvasTop.value // 记录触摸点与canvas上边界的距离
    prevCanvasSize.value = canvasContainer.value.offsetHeight
    e.preventDefault()
}
// 处理canvas大小调整触摸移动事件
const canvasSizeTouchMove = (e) => {
    const touch = e.touches[0]
    const { height, top } = img.value.getBoundingClientRect()
    const { top: canvasTopSize, left } = canvasContainer.value.getBoundingClientRect()
    const maxSize = top + height - canvasTopSize

    const newX = touch.clientX - startX.value - left
    const newY = touch.clientY - startY.value

    const deltaSize = newX > newY ? newY : newX
    const newSize = Math.min(Math.max(40, prevCanvasSize.value + deltaSize), maxSize)
    canvasContainer.value.style.width = newSize + 'px'
    canvasContainer.value.style.height = newSize + 'px'
    updateCanvasPosition()
    e.preventDefault()
}

// 创建新的img对象在原像素上进行裁切进行保存
const saveCrop = () => {
    if (!img.value) return
    const { height, width, top, left } = img.value.getBoundingClientRect()
    const { top: canvasTopSize, left: canvasLeftSize, width: canvasSize } = canvasContainer.value.getBoundingClientRect()
    // 计算canvas相对于图片的位置
    const relativeLeft = canvasLeftSize - left
    const relativeTop = canvasTopSize - top
    // 计算图片缩放比例
    const scaleX = img.value.naturalWidth / width
    const scaleY = img.value.naturalHeight / height
    // 计算在原始图片中的裁剪区域
    const cropX = relativeLeft * scaleX
    const cropY = relativeTop * scaleY
    const cropWidth = canvasSize * scaleX
    const cropHeight = canvasSize * scaleY
    // 创建一个新的Image对象，加载原始图片
    const originalImg = new Image()
    originalImg.src = img.value.src
    originalImg.onload = async function () {
        // 创建一个新的canvas，用于裁剪原始图片
        const cropCanvas = document.createElement('canvas')
        cropCanvas.width = cropWidth
        cropCanvas.height = cropHeight
        const cropCtx = cropCanvas.getContext('2d')
        cropCtx.drawImage(originalImg, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)
        const fieldName = cropCanvas.toDataURL()
        // 计算裁切后的图片大小（KB）
        const response = await fetch(fieldName)
        const blob = await response.blob()
        const blobSizeInKB = parseFloat((blob.size / 1024).toFixed(2))
        console.log(blobSizeInKB);

        if (blobSizeInKB > 1024) return proxy.$toast.show('图片文件过大，请选择更小的裁切区域')
        croppedSrc.value = ''
        try {
            proxy.$toast.loading('修改头像中...')
            await uploadAvatar(userInfo.value.userId, { fieldName })
            const info = { ...userInfo.value, userAvatar: `/assets/avatar/${userinfo.userId}.png` }
            await modifyUserInfo(userinfo.userId, info)
            updateUserInfo(info)
            croppedCompleted.value = fieldName
            proxy.$toast.show('修改成功')
        } catch (error) {
            console.log(error);
            proxy.$toast.show('修改失败')
        }
    }
}
const showDialog = ref(false)
// 处理返回事件
const back = () => {
    const isDataEqual = JSON.stringify(userInfo.value) === JSON.stringify(userinfo)
    if (isDataEqual) {
        router.back()
    } else {
        showDialog.value = true
    }
}
// 处理保存事件
const save = async () => {
    try {
        proxy.$toast.loading('修改中...')
        await modifyUserInfo(userinfo.userId, userInfo.value)
        proxy.$toast.show('修改成功')
        updateUserInfo(userInfo.value)
        router.back()
    } catch (error) {
        console.log(error);
    }
}
// 关闭弹窗
const close = () => {
    showDialog.value = false
    router.back()
}
</script>

<template>
    <Title title="修改个人资料" @back="back" />
    <Dialog :show="showDialog" :options="{ title: '是否保存修改' }" @close="close" @confirm="save" />
    <div class="inputfile">
        <img :src="croppedCompleted ? croppedCompleted : $imgSrc(userInfo.userAvatar)" alt="">
        <input type="file" ref="fileInput" @change="handleChange" accept="image/*" />
        <div class="desc">点击更换头像</div>
    </div>
    <ul>
        <li>
            <p>昵称</p> <input type="text" v-model="userInfo.userNickname">
        </li>
        <li>
            <p>签名</p> <input type="text" v-model="userInfo.userDesc">
        </li>
        <li>
            <p>性别</p> <select v-model="userInfo.userGender">
                <option value="男">男</option>
                <option value="女">女</option>
            </select>
        </li>
        <li>
            <p>年龄</p> <input type="text" v-model="userInfo.userAge">
        </li>
        <li>
            <p>地址</p> <input type="text" v-model="userInfo.userAddress">
        </li>
    </ul>
    <div class="cropper" v-show="croppedSrc">
        <img ref="img" :src="croppedSrc" alt="">
        <div class="can" ref="canvasContainer" @touchstart="handleTouchStart" @touchmove="handleTouchMove">
            <div class="rb" @touchstart="canvasSizeTouchStart" @touchmove="canvasSizeTouchMove"
                @touchend="isDragging = false"></div>
        </div>
        <button class="save-btn" @click="saveCrop">保存</button>
    </div>
</template>

<style lang="scss" scoped>
.cropper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 1000;

    .save-btn {
        position: absolute;
        right: 20px;
        bottom: 10px;
        color: #fff;
        border-radius: 15px;
        padding: 5px 10px;
        background-color: rgb(37, 37, 255)
    }

    img,
    .can {
        @include position-center;
    }

    img {
        width: 100%;
    }

    .can {
        border: 1.5px dashed #ff0050;
        transform: translate(0) !important;
        cursor: move;
        background-color: rgba($color: #ff0050, $alpha: 0.15);

        .rb {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 10px;
            height: 10px;
            transform: translate(50%, 50%);
            background-color: #ff0050;
        }
    }
}

.inputfile {
    padding-top: 44px;
    text-align: center;
    position: relative;

    input {
        width: 100px;
        height: 150px;
        @include position-center;
        top: 44px;
        transform: translate(-50%, 0);
        opacity: 0;
    }

    img {
        margin: 15px 0;
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }

    .desc {
        font-size: 12px;
        color: #8b8c96;
    }
}

ul {
    margin-top: 30px;
    border-top: $bordB;
    color: #fff;

    li {
        display: flex;
        padding: 10px 20px;
        line-height: 44px;
        height: 64px;
        justify-content: space-between;

        select {
            background-color: $backcolor;
            color: #fff;
            border-radius: 5px;
            outline: none;
        }

        input {
            width: 200px;
            color: #fff;
            padding: 0 10px;
            text-align: right;
            border: 1px solid transparent;
            border-radius: 5px;

            &:focus {
                border-color: #fff;
            }
        }
    }
}
</style>