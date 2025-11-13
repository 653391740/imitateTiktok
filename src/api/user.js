import http from '@/utils/request'

export const getContact = (uid) => {
    return http.get(`user/${uid}/getContact`)
}
export const getUserInfo = (uid, userId) => {
    return http.get(`user/${uid}/getUserInfo/${userId}`)
}
export const VideosPage = (userId, page) => {
    return http.get(`/user/${userId}/Videos/page/${page}`)
}
export const getLikesPage = (uid, page) => {
    return http.get(`user/${uid}/Likes/page/${page}`)
}
export const uploadAvatar = (uid, data) => {
    return http.post(`user/${uid}/uploadAvatar`, data)
}
export const modifyUserInfo = (uid, data) => {
    return http.post(`user/${uid}/modifyUserInfo`, data)
}
