import { FileSliceType } from '@/types/file'

const fileSlice = (file: any): Promise<FileSliceType> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../worker/fileWorker', import.meta.url), { type: 'module' })
    const defauktChunkSize = 5 * 1024 * 1024
    worker.onmessage = function (e) {
      worker.terminate()
      resolve(e.data)
    }
    worker.postMessage({
      file,
      defauktChunkSize,
    })
  })
}

export { fileSlice }
