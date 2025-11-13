import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollPosition() {
    const newDom = ref({})
    const userinfoContainer = ref(null)

    const updataY = () => {
        if (!userinfoContainer.value) return
        const { top, height } = userinfoContainer.value.getBoundingClientRect()
        newDom.value = {
            scrollTop: -top,
            clientHeight: window.innerHeight,
            scrollHeight: height
        }
        return -top
    }

    const checkNavPosition = () => {
        let checkCount = 0
        let lastPosition = null

        const check = () => {
            const top = updataY()
            if (Math.abs(lastPosition - top) < 0.1) {
                checkCount++
                if (checkCount >= 4) return
            }
            lastPosition = top
            requestAnimationFrame(check)
        }
        requestAnimationFrame(check)
    }

    onMounted(() => {
        userinfoContainer.value = document.querySelector('.userinfo-container')
        if (!userinfoContainer.value) return

        userinfoContainer.value.addEventListener('touchend', checkNavPosition)
        userinfoContainer.value.addEventListener('touchmove', updataY)
    })

    onUnmounted(() => {
        if (userinfoContainer.value) {
            userinfoContainer.value.removeEventListener('touchend', checkNavPosition)
            userinfoContainer.value.removeEventListener('touchmove', updataY)
        }
    })

    return {
        newDom,
        updataY
    }
}
