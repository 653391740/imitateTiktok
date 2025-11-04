<script setup>
import Title from '@/components/title.vue'
import { ref, getCurrentInstance } from 'vue'
import { uploadFile, uploadCover, publishVideo } from '@/api/video'
import { loginStore } from '@/stores/counter'
import { useRouter } from 'vue-router'

const video = ref(null)
const router = useRouter()
const { proxy } = getCurrentInstance()
const { userinfo } = loginStore()
const publishData = ref({
    videoUrl: '',
    coverUrl: '',
    videoDesc: '',
    videoFile: null // 添加用于存储原始文件对象的字段
})
const currvideoUrl = ref('')
const handleFileChange = (e) => {
    const file = e.target.files[0]
    const url = URL.createObjectURL(file)
    currvideoUrl.value = url
    publishData.value.videoFile = file // 保存原始文件对象
    publishData.value.videoUrl = url

    video.value.addEventListener('loadeddata', () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.value.videoWidth
        canvas.height = video.value.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height)
            publishData.value.coverUrl = canvas.toDataURL()
        } else {
            console.error('无法创建canvas上下文')
        }
    })
}
const togglePlay = () => {
    if (video.value.paused) {
        video.value.play()
    } else {
        video.value.pause()
    }
}
const preview = () => {
    video.value.currentTime = 0
    video.value.play()
}

const publish = async () => {
    try {
        showDialog.value = false
        proxy.$toast.loading('发布中...')
        const { videoFile, videoUrl, videoDesc, coverUrl } = publishData.value
        const fileData = new FormData()
        fileData.append('videoPath', videoFile ? videoFile : videoUrl)
        console.log(fileData);
        const file = await uploadFile(fileData)
        proxy.$toast.show('视频上传成功')

        const coverData = new FormData()
        const videoId = file?.filename.split('.')[0]
        
        coverData.append('videoId', videoId)
        // 将Data URL转换为Blob对象
        const decodedString = atob(coverUrl.split(',')[1])
        const byteArray = new Uint8Array(decodedString.length);
        for (let i = 0; i < byteArray.length; i++) {
            byteArray[i] = decodedString.charCodeAt(i);
        }
        const blob = new Blob([byteArray]);
        coverData.append('videoCover', blob);
        const cover = await uploadCover(coverData)
        proxy.$toast.show('封面上传成功')

        const publishVideoData = {
            videoCover: `http://43.138.15.137:3000/assets/videoCover/${cover?.filename}`,
            videoDesc,
            videoId,
            videoPath: `http://43.138.15.137:3000/assets/videoPath/${file?.filename}`,
        }
        await publishVideo(userinfo.userId, publishVideoData)
        proxy.$toast.show('发布成功')
        router.push({ path: 'user' })
    } catch (err) {
        console.log(err);
    }
}
const showDialog = ref(false)
</script>
<template>
    <Dialog :show="showDialog" :options="{ title: '是否保存修改' }" @close="showDialog = false" @confirm="publish" />
    <Title title="发布动态" back />
    <div class="content">
        <div class="video-wrap">
            <video ref="video" :src="publishData.videoUrl" @click="togglePlay" autoplay loop></video>
            <p v-if="!publishData.videoUrl">点击上传或者在下方输入url,推荐使用url</p>
            <input v-if="!publishData.videoUrl" type="file" accept="video/*" @change="handleFileChange">
        </div>
        <div class="item">
            <input type="text" placeholder="请输入视频链接（如本地上传可不填）" v-model="publishData.videoUrl">
        </div>
        <div class="item" v-show="!publishData.videoFile">
            <input type="text" placeholder="请输入封面链接（如本地上传默认第一帧）" v-model="publishData.coverUrl">
        </div>
        <div class="item">
            <textarea type="text" placeholder="请输入视频描述" v-model="publishData.videoDesc"></textarea>
        </div>
        <div class="item">
            <button @click="preview">预览</button>
            <button @click="showDialog = true">发布</button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.content {
    padding-top: 44px;
    color: #fff;

    .item {
        line-height: 44px;
        height: 64px;
        padding: 10px 20px;
        display: flex;
        justify-content: space-around;

        button {
            color: #fff;
            font-size: 12px;
        }

        input,
        textarea {
            width: 100%;
            height: 44px;
            background-color: $backcolor;
            border: none;
            color: #fff;
            outline: none;
        }

        textarea {
            color: #e8e8e9;
            resize: none;
        }
    }

    .video-wrap {
        position: relative;
        height: 50vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #000;

        p {
            position: absolute;
        }

        video {
            width: 100%;
            height: 100%;
        }

        input {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0;
        }
    }
}
</style>