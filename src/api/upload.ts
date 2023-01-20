import { get, post } from '@/request/index'
import { SearchUploadFileType, UploadFileChunkMergeInfo } from '@/types/file'

const searchUploadFileIsExist = (info: SearchUploadFileType) => {
  return Promise.resolve(get({ url: `upload/search/${info.fileHash}` }))
}

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
