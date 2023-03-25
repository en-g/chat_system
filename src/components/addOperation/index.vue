<template>
  <div class="add-operation-container">
    <div class="add-operation-icon" @click="listenShowAddMenu">
      <el-icon><Plus color="#1aadf9" /></el-icon>
    </div>
    <div v-show="isShowMenu" class="add-operation-menu">
      <div class="add-operation-menu-item" @click="listenAddContactOrGroup">添加联系人/群聊</div>
      <div class="add-operation-menu-item" @click="listenCreateGroup">创建群聊</div>
    </div>
    <el-dialog v-model="addContactOrGroupVisible" title="添加联系人/群聊" width="30%">
      <div class="add-contact-group">
        <div class="add-contact-group-search">
          <el-input
            v-model="searchKeyword"
            size="default"
            clearable
            placeholder="请输入联系人/群组名称"
            @input="listenKeywordChange"
          />
        </div>
        <div class="add-contact-group-result">
          <el-scrollbar class="add-contact-group-result-scroll">
            <div v-if="!!searchContactOrGroupResult.length" class="add-contact-group-result-list">
              <div v-for="item in searchContactOrGroupResult" :key="item.id" class="add-contact-group-result-list-item">
                <div class="avatar">
                  <el-avatar :size="40" :src="item.avatarUrl" />
                </div>
                <div class="desc">
                  <div class="name-tag">
                    <div class="name">{{ item.name }}</div>
                    <div v-show="item.isGroup" class="tag">
                      <el-tag effect="light">群聊</el-tag>
                    </div>
                  </div>
                  <div v-if="item.signature" class="signature">{{ item.signature }}</div>
                </div>
                <div class="op">
                  <div v-if="!item.isAdd" class="no-add">
                    <svg class="icon" aria-hidden="true" @click="listenRequestAddContactOrGroup(item.id)">
                      <use xlink:href="#icon-add"></use>
                    </svg>
                  </div>
                  <div v-else class="added">
                    <el-tag effect="light" type="info">已添加</el-tag>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="add-contact-group-no-result">暂无搜索结果</div>
          </el-scrollbar>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { Plus } from '@element-plus/icons-vue'
  import { ContactOrGroupResultType } from '@/types/navbar'
  import { debounce } from '@/utils/utils'
  import { searchContactsOrGroups } from '@/api/contacts'
  import useStore from '@/store'

  const store = useStore()

  const isShowMenu = ref<boolean>(false) // 标记菜单是否显示
  const addContactOrGroupVisible = ref<boolean>(false) // 标记是否显示添加联系人或群聊的 dialog
  const searchKeyword = ref<string>('') // 搜索联系人/群组的关键字

  const searchContactOrGroupResult = reactive<ContactOrGroupResultType[]>([])

  // 显示添加操作菜单
  const listenShowAddMenu = () => {
    isShowMenu.value = !isShowMenu.value
  }

  // 添加联系人/群聊
  const listenAddContactOrGroup = () => {
    searchKeyword.value = ''
    searchContactOrGroupResult.splice(0, searchContactOrGroupResult.length)
    isShowMenu.value = false
    addContactOrGroupVisible.value = true
  }

  // 创建群聊
  const listenCreateGroup = () => {
    isShowMenu.value = false
  }

  // 关键字改变，重新搜索，使用防抖
  const listenKeywordChange = debounce(async function () {
    if (!searchKeyword.value) {
      searchContactOrGroupResult.splice(0, searchContactOrGroupResult.length)
      return
    }
    const { data } = await searchContactsOrGroups({
      keyword: searchKeyword.value,
      userId: store.user_id,
    })
    searchContactOrGroupResult.splice(0, searchContactOrGroupResult.length, ...data)
  })

  // 点击请求添加联系人/群聊
  const listenRequestAddContactOrGroup = (id: number) => {
    console.log(id)
  }
</script>

<style scoped lang="less">
  .add-operation-container {
    position: relative;
    .add-operation-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #fff;
      cursor: pointer;
      &:hover {
        background-color: var(--mouse-hover-active);
      }
    }
    .add-operation-menu {
      position: absolute;
      top: 35px;
      left: 50%;
      transform: translateX(-50%);
      width: 140px;
      padding: 5px 0;
      box-sizing: border-box;
      background-color: #fff;
      z-index: 100;
      border-radius: 4px;
      box-shadow: var(--el-box-shadow);
      .add-operation-menu-item {
        display: flex;
        align-items: center;
        padding: 10px 20px;
        box-sizing: border-box;
        &:hover {
          background-color: var(--mouse-hover-active);
          cursor: pointer;
        }
      }
    }
    .add-contact-group {
      .add-contact-group-search {
      }
    }
    .add-contact-group-result {
      .add-contact-group-result-scroll {
        height: 350px;
        padding: 15px 10px;
        box-sizing: border-box;
        .add-contact-group-result-list {
          .add-contact-group-result-list-item {
            display: flex;
            align-items: center;
            padding: 10px 0;
            box-sizing: border-box;
            .avatar {
              width: 40px;
              height: 40px;
              margin-right: 15px;
            }
            .desc {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              .name-tag {
                display: flex;
                height: 20px;
                line-height: 20px;
                flex: 1;
                .name {
                  font-weight: bold;
                }
              }
              .signature {
                flex: 1;
                height: 20px;
                line-height: 20px;
                font-size: var(--small-desc-size);
                color: var(--desc-color);
              }
            }
            .op {
              width: fit-content;
              height: 24px;
              .no-add {
                .icon {
                  width: 24px;
                  height: 24px;
                }
              }
              .added {
                cursor: default;
              }
            }
          }
        }
        .add-contact-group-no-result {
          display: flex;
          justify-content: center;
          margin-top: 20px;
          color: var(--desc-color);
          font-size: var(--title-font-size);
        }
      }
    }
  }
  :deep(.el-dialog__body) {
    padding: 10px 20px 20px;
  }
</style>
