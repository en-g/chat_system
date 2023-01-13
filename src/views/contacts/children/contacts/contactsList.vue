<template>
  <div class="contacts-list-container">
    <div class="contacts-list-item">
      <el-menu class="contacts-list-menu" @open="listenOpenMenu" @close="listenCloseMenu">
        <el-sub-menu v-for="item in props.contactsList" :key="item.id" :index="item.friendGroup">
          <template #title>
            <div class="contacts-list-item-title">
              <div v-show="!item.list.length" class="left-fill"></div>
              <svg v-show="!!item.list.length" class="icon" aria-hidden="true">
                <use :xlink:href="openList.includes(item.friendGroup) ? '#icon-down' : '#icon-right'"></use>
              </svg>
              {{ item.friendGroup }}
            </div>
          </template>
          <div
            v-for="item1 in item.list"
            :key="item1.id"
            :class="{ 'contacts-item-active': item1.id === clickContactsId && store.clickContactsType === props.type }"
            @click="listenNavigateToContactsInfo(item1.id)"
          >
            <ContactsListItem :contacts-list-item="item1" />
          </div>
        </el-sub-menu>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import ContactsListItem from './contactsListItem.vue'
  import { ContactsListType } from '@/types/contacts'
  import useStore from '@/store/index'

  const router = useRouter()
  const store = useStore()
  const emit = defineEmits(['showContactsInfo'])

  const props = defineProps<{
    type: string
    contactsList: ContactsListType[]
  }>()

  const openList: string[] = []
  const clickContactsId = ref<number>(-1)

  const listenOpenMenu = (index: string) => {
    openList.push(index)
  }

  const listenCloseMenu = (index: string) => {
    const i = openList.findIndex((item: string) => item === index)
    openList.splice(i, 1)
  }

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
    }
  }
</style>
