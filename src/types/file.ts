export interface FileSliceType {
  status: number
  fileHash?: string
  chunkList?: Array<{ id: number; data: ArrayBuffer }>
}

export interface SearchUploadFileType {
  fileHash: string
}

export interface UploadFileChunkInfo {
  fileHash: string
  fileIndex: number
  total: number
  mimetype: string
  size: number
  suffix: string
  file: ArrayBuffer
}

export interface UploadFileChunkMergeInfo {
  fileHash: string
  model: string
}
