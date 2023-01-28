import { get, post } from '@/request/index'
import { SearchUploadFileType, UploadFileChunkMergeInfo } from '@/types/file'

// 查询上传的文件是否存在
const searchUploadFileIsExist = (info: SearchUploadFileType) => {
  return Promise.resolve(get({ url: `upload/search/${info.fileHash}` }))
}

// 单文件上传分块
const uploadSingleFileChunk = (info: FormData) => {
  return Promise.resolve(
    post({
      url: 'upload/file',
      data: info,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  )
}

// 文件分块合并
const uploadFileChunkMerge = (info: UploadFileChunkMergeInfo) => {
  return Promise.resolve(
    post({
      url: 'upload/merge',
      data: {
        ...info,
      },
    })
  )
}

export { searchUploadFileIsExist, uploadSingleFileChunk, uploadFileChunkMerge }
