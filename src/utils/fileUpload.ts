import { searchUploadFileIsExist, uploadFileChunkMerge, uploadSingleFileChunk } from '@/api/upload'
import { UploadFileChunkInfo } from '@/types/file'
import { fileSlice } from './fileSlice'

class FileUpload {
  async singleFileUpload(model: string, file: any) {
    // 检查文件类型
    if (!this.judgeFileTypeLegitimacy(file.type)) {
      return {
        status: 2,
      }
    }
    // 文件分块
    const sliceRes: any = await fileSlice(file)
    if (sliceRes.status === 0) {
      return {
        status: sliceRes.status,
      }
    }
    const suffix = file.name.substring(file.name.lastIndexOf('.'))
    const { data } = await searchUploadFileIsExist({ fileHash: sliceRes.fileHash as string })
    if (data.status === 1) {
      // 文件存在
      console.log('秒传')
      return {
        status: 1,
        fileInfo: data.fileInfo,
      }
    } else if (data.status === 2) {
      // 断点续传
      console.log('断点续传')
      const requestArr: any[] = []
      sliceRes.chunkList
        .filter((item: any) => data.temporaryList.includes((id: number) => id !== item.id))
        .forEach((chunk: any) => {
          requestArr.push(
            this.uploadChunk({
              fileIndex: chunk.id,
              file: chunk.data,
              fileHash: sliceRes.fileHash,
              total: sliceRes.chunkList.length,
              mimetype: file.type,
              size: file.size,
              suffix,
            })
          )
        })
      const uploadRes = await Promise.all(requestArr)
      if ((!Array.isArray(uploadRes) && uploadRes) || uploadRes.filter((item) => item).length === uploadRes.length) {
        // 文件合并
        const { data } = await uploadFileChunkMerge({
          fileHash: sliceRes.fileHash,
          model,
        })
        return {
          status: 1,
          fileInfo: data,
        }
      } else {
        return {
          status: 0,
        }
      }
    } else if (data.status === 0) {
      // 分片上传
      console.log('分片上传')
      const requestArr: any[] = []
      sliceRes.chunkList.forEach((chunk: any) => {
        requestArr.push(
          this.uploadChunk({
            fileIndex: chunk.id,
            file: chunk.data,
            fileHash: sliceRes.fileHash,
            total: sliceRes.chunkList.length,
            mimetype: file.type,
            size: file.size,
            suffix,
          })
        )
      })
      const uploadRes = await Promise.all(requestArr)
      if (
        (!Array.isArray(uploadRes) && uploadRes && sliceRes.chunkList.length === 1) ||
        uploadRes.filter((item) => item).length === sliceRes.chunkList.length
      ) {
        // 文件合并
        const { data } = await uploadFileChunkMerge({
          fileHash: sliceRes.fileHash,
          model,
        })
        return {
          status: 1,
          fileInfo: data,
        }
      } else {
        return {
          status: 0,
        }
      }
    }
  }

  async multiFileUpload() {
    console.log('files')
  }

  uploadChunk(fileInfo: UploadFileChunkInfo) {
    const form = new FormData()
    form.append('file', new Blob([fileInfo.file]))
    form.append('fileHash', fileInfo.fileHash)
    form.append('fileIndex', `${fileInfo.fileIndex}`)
    form.append('total', `${fileInfo.total}`)
    form.append('mimetype', fileInfo.mimetype)
    form.append('size', `${fileInfo.size}`)
    form.append('suffix', fileInfo.suffix)
    return uploadSingleFileChunk(form)
  }

  judgeFileTypeLegitimacy(mimetype: string) {
    const mimetypeList = ['image/jpeg', 'image/png', 'image/webp']
    return mimetypeList.includes(mimetype)
  }
}

export default new FileUpload()
