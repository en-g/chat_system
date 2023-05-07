<template>
  <div class="contacts-list-container">
    <div class="contacts-list-item">
      <el-menu
        v-if="props.contactsList.length > 0"
        class="contacts-list-menu"
        @open="listenOpenMenu"
        @close="listenCloseMenu"
      >
        <el-sub-menu v-for="item in props.contactsList" :key="item.id" :index="item.name">
          <template #title>
            <div class="contacts-list-item-title">
              <div v-show="!item.total" class="left-fill"></div>
              <svg v-show="!!item.total" class="icon" aria-hidden="true">
                <use :xlink:href="openList.includes(item.name) ? '#icon-down' : '#icon-right'"></use>
              </svg>
              {{ item.name }}
            </div>
          </template>
          <div
            v-for="item1 in item.members"
            :key="item1.id"
            :class="{ 'contacts-item-active': item1.id === clickContactsId && store.clickContactsType === props.type }"
            @click="listenNavigateToContactsInfo(item1.id)"
          >
            <ContactsListItem :contacts-list-item="item1" />
          </div>
        </el-sub-menu>
      </el-menu>
      <el-link v-else class="contacts-list-add" type="primary" :underline="false">
        {{ props.type === 'friend' ? '暂无好友，快去添加好友吧！' : '暂无群聊，快去加入群聊吧！' }}
      </el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import ContactsListItem from './contactsListItem.vue'
  import { ContactsListType } from '@/types/contacts'
  import useStore from '@/store/index'

  const router = useRouter()
  const store = useStore()
  const emit = defineEmits(['showContactsInfo', 'showSearch'])

  const props = defineProps<{
    type: string // 列表类型
    contactsList: ContactsListType[] // 列表数据
  }>()

  const openList = reactive<Array<string>>([]) // 保存被点击下拉的分组
  const clickContactsId = ref<number>(-1) // 查看的联系人或群聊 ID

  // 点击下拉分组
  const listenOpenMenu = (index: string) => {
    openList.push(index)
  }

  // 关闭下拉分组
  const listenCloseMenu = (index: string) => {
    const i = openList.findIndex((item: string) => item === index)
    openList.splice(i, 1)
  }

  // 跳转查看联系人或群聊信息
  const listenNavigateToContactsInfo = (id: number) => {
    emit('showContactsInfo')
    clickContactsId.value = id
    store.clickContactsType = props.type
    router.push({
      name: 'info',
      query: {
        type: props.type,
        id,
      },
    })
  }
</script>

<style scoped lang="less">
  .contacts-list-container {
    .contacts-list-item {
      .contacts-list-menu {
        margin-bottom: 10px;
        .contacts-list-item-title {
          width: 100%;
          display: flex;
          align-items: center;
          font-size: 13px;
          .left-fill {
            margin-right: 17px;
          }
          svg {
            width: 12px;
            margin-right: 5px;
          }
        }
        & .contacts-item-active {
          background-color: var(--mouse-hover-active);
        }
      }
      .contacts-list-add {
        margin-left: 20px;
      }
    }
  }
</style>
