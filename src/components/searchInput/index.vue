<template>
  <div class="search-input-container">
    <el-popover
      :visible="contactsGroupsList.contact.length > 0 || contactsGroupsList.group.length > 0"
      placement="bottom"
      :show-arrow="false"
      :offset="0"
      :width="300"
    >
      <template #reference>
        <el-input v-model="keywords" placeholder="搜索联系人/群组" @input="searchContactsGroupsListData">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </template>
      <div class="search-result-list">
        <div v-if="contactsGroupsList.contact.length > 0" class="contacts-list">
          <div class="label">联系人</div>
          <div class="list">
            <div
              v-for="item in contactsGroupsList.contact"
              :key="item.id"
              class="item"
              @click="listenNavigateToShowInfo(item.id, 'friend')"
            >
              <div class="avatar">
                <el-avatar :size="40" :src="item.avatarUrl" />
              </div>
              <div class="name">{{ item.name }}</div>
              <div v-if="item.remarks" class="remarks">（{{ item.remarks }}）</div>
            </div>
          </div>
        </div>
        <div v-if="contactsGroupsList.group.length > 0" class="groups-list">
          <div class="label">群聊</div>
          <div class="list">
            <div
              v-for="item in contactsGroupsList.group"
              :key="item.id"
              class="item"
              @click="listenNavigateToShowInfo(item.id, 'group')"
            >
              <div class="avatar">
                <el-avatar :size="40" :src="item.avatarUrl" />
              </div>
              <div class="name">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { searchContactGroupsList } from '@/api/contacts'
  import { ContactsGroupsListInfoType } from '@/types/contacts'
  import useStore from '@/store'
  import { debounce } from '@/utils/utils'
  import router from '@/router'

  const store = useStore()

  // 查询关键字
  const keywords = ref<string>('')
  const contactsGroupsList = reactive<ContactsGroupsListInfoType>({
    contact: [],
    group: [],
  })

  // 查询联系人和群聊
  const searchContactsGroupsListData = debounce(async () => {
    const { data } = await searchContactGroupsList({
      userId: store.user_id,
      keyword: keywords.value,
    })
    if (data) {
      contactsGroupsList.contact.splice(0, contactsGroupsList.contact.length, ...data.contact)
      contactsGroupsList.group.splice(0, contactsGroupsList.group.length, ...data.group)
    } else {
      contactsGroupsList.contact.splice(0, contactsGroupsList.contact.length)
      contactsGroupsList.group.splice(0, contactsGroupsList.group.length)
    }
  })

  // 跳转到信息界面
  const listenNavigateToShowInfo = (id: number, type: string) => {
    router.push({
      name: 'info',
      query: {
        type,
        id,
      },
    })
  }
</script>

<style scoped lang="less">
  .search-result-list {
    .contacts-list,
    .groups-list {
      .label {
        font-weight: bold;
        margin-bottom: 10px;
      }
      .list {
        .item {
          display: flex;
          padding: 5px;
          box-sizing: border-box;
          &:hover {
            cursor: pointer;
            background-color: var(--mouse-hover-active);
          }
          .avatar {
            height: 40px;
            margin-right: 15px;
          }
          .name {
            height: 40px;
            line-height: 40px;
          }
          .remarks {
            height: 40px;
            line-height: 40px;
          }
        }
      }
    }
  }

  :deep(.el-input__wrapper) {
    height: 30px;
    border-radius: 15px;
  }
</style>
