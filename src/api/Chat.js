import http from '@/utils/request'

export const getPrivateLetter = (userId, formId) => {
    return http.get(`/user/${userId}/getPrivateLetter/${formId}`)
}

export const readPrivateLetter = (userId, formId) => {
    return http.get(`/user/${userId}/readPrivateLetter/${formId}`)
}

export const sendPrivateLetter = (userId, formId, data) => {
    return http.post(`/user/${userId}/privateLetter/${formId}`, data)
}

export const getFans = (userId, page) => {
    return http.get(`/user/${userId}/Fans/page/${page}/${userId}`)
}

export const triggerFollow = (userId, followUserId) => {
    return http.get(`/user/${userId}/triggerFollow/${followUserId}`)
}

export const byLike = (userId, page) => {
    return http.get(`/user/${userId}/byLike/page/${page}`)
}

export const getAt = (userId, page) => {
    return http.get(`/user/${userId}/getAt/page/${page}`)
}

export const byComment = (userId, page) => {
    return http.get(`/user/${userId}/byComment/page/${page}`)
}