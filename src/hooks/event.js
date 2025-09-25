import { onMounted, onUnmounted } from "vue"
export function event(target, type, callback) {
    onMounted(() => {
        target.addEventListener(type, callback)
    })
    onUnmounted(() => {
        target.removeEventListener(type, callback)
    })
}