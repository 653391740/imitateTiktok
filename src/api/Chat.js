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
export const FanUnreadNum = (userId) => {
    return http.get(`/user/${userId}/FanUnreadNum`)
}
export const byLikeUnreadNum = (userId) => {
    return http.get(`/user/${userId}/byLikeUnreadNum`)
}
export const byCommentUnreadNum = (userId) => {
    return http.get(`/user/${userId}/byCommentUnreadNum`)
}
export const getAtUnreadNum = (userId) => {
    return http.get(`/user/${userId}/getAtUnreadNum`)
}
export const FollowersNum = (userId) => {
    return http.get(`/user/${userId}/FollowersNum`)
}
export const FansNum = (userId) => {
    return http.get(`/user/${userId}/FansNum`)
}
export const byLikesNum = (userId) => {
    return http.get(`/user/${userId}/byLikesNum`)
}
export const LikesNum = (userId) => {
    return http.get(`/user/${userId}/LikesNum`)
}
export const VideosNum = (userId) => {
    return http.get(`/user/${userId}/VideosNum`)
}
export const readAllFanMsg = (uid) => {
    return http.get(`user/${uid}/readAllFanMsg`)
}
export const readAllByLikeMsg = (uid) => {
    return http.get(`user/${uid}/readAllByLikeMsg`)
}
export const readAllAt = (uid) => {
    return http.get(`user/${uid}/readAllAt`)
}
export const readAllByCommentMsg = (uid) => {
    return http.get(`user/${uid}/readAllByCommentMsg`)
}
export const AtUser = (uid, data) => {
    return http.post(`user/${uid}/AtUser`, data)
}