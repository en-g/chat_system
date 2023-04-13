import { get, post } from '@/request'
import { EmotionListIdType, UploadEmotionType } from '@/types/emotion'

// 获取表情包列表
const getEmotionList = (id: EmotionListIdType) => {
  return Promise.resolve(get({ url: `emotion/list/${id.userId}` }))
}

// 上传表情包
const uploadEmotion = (ids: UploadEmotionType) => {
  return Promise.resolve(post({ url: `emotion`, data: ids }))
}

export { getEmotionList, uploadEmotion }
