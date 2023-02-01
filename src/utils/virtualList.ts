/**
 * 目标数组的每个元素保存着结点渲染完成后的高度
 * 树状数组的每个元素保存着目标数组不同区间的和
 * 通过树状数组可以方便的获取不同 [0, index] 区间的和（结点高度的和）
 */
interface BinaryIndexTree {
  // 树状数组
  BITree: number[]
  // 树状树状的大小
  BITSize: number
  // 结点的默认高度（取最小的结点高度）
  defaultHeight: number
  // 结点渲染完成后的总高度
  tatolHeight: number
  vis: boolean[]
  // 初始化树状数组
  init: (nowSize: number) => void
  // 结点的高度发生变化时，更新树状数组（结点渲染完成）
  update: (index: number, value: number) => void
  lowbit: (num: number) => number
  // 返回 tatolHeight
  getTatolHeight: () => number
  // 返回 [0, index] 的结点高度和
  getSectionSum: (index: number) => number
  // 返回大于等于某个高度的第一个下标（寻找锚点元素）
  findLowerOffsetIndex: (offset: number) => number
}

class VirtualList implements BinaryIndexTree {
  BITree: number[]
  BITSize: number = 1e4 + 5
  defaultHeight: number
  vis: boolean[]
  tatolHeight = 0
  constructor(nowSize: number, estimatedItemHeight: number, BITSize?: number) {
    if (BITSize) this.BITSize = BITSize
    this.defaultHeight = estimatedItemHeight
    this.BITree = new Array(this.BITSize).fill(0)
    this.vis = new Array(this.BITSize).fill(false)
    this.init(nowSize)
  }

  init(nowSize: number): void {
    for (let i = 1; i <= nowSize; i++) {
      /**
       * 每次更新节点高度时，都会拿到节点的实际高度，因此需要减去初始化节点高度时赋值的 defaultHeight
       * 传入 defaultHeight * 2，会在更新节点高度时减去 defaultHeight
       */
      this.update(i, this.defaultHeight * 2)
    }
  }

  update(index: number, realHeight: number): void {
    // index = index + 1
    realHeight -= this.defaultHeight // 减去初始化时的 defaultHeight
    this.tatolHeight += realHeight // 更新总高度
    // 更新树状数组
    for (let pos = index; pos < this.BITSize; pos += this.lowbit(pos)) {
      this.BITree[pos] += realHeight
    }
  }

  lowbit(num: number): number {
    return num & -num
  }

  getSectionSum(index: number): number {
    // index = index + 1
    let sectionHeight = 0
    while (index > 0) {
      sectionHeight += +this.BITree[index]
      index -= this.lowbit(index)
    }
    return sectionHeight
  }

  getTatolHeight(): number {
    return this.tatolHeight
  }

  findLowerOffsetIndex(offset: number): number {
    let left = 0,
      right = this.BITSize - 1,
      mid
    // 二分查找
    while (left < right) {
      mid = (left + right) >> 1
      if (this.getSectionSum(mid) < offset) {
        left = mid + 1
      } else {
        right = mid
      }
    }
    return left
  }
}

export const createVirtualList = (nowSize: number, estimatedItemHeight: number, BITSize?: number): BinaryIndexTree => {
  return new VirtualList(nowSize, estimatedItemHeight, BITSize)
}
