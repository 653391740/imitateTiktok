import http from '@/utils/request'

export const searchUser = (uid) => {
    return http.get(`user/${uid}/getContact`)
}