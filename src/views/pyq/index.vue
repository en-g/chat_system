<template>
  <div class="pyq-container">
    <div class="pyq-main">
      <Tidings :tidings-list="tidingsList" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import Tidings from './children/tidings/index.vue'
  import { PyqTidingsType } from '@/types/pyq'

  const tidingsList: PyqTidingsType[] = [
    {
      id: 1,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content:
        '大家新年快乐，万事大吉，吉祥如意！大家新年快乐，万事大吉，吉祥如意！大家新年快乐，万事大吉，吉祥如意！大家新年快乐，万事大吉，吉祥如意！大家新年快乐，万事大吉，吉祥如意！大家新年快乐，万事大吉，吉祥如意！大家新年快乐，万事大吉，吉祥如意！大家新年快乐，万事大吉，吉祥如意！大家新年快乐，万事大吉，吉祥如意！大家新年快乐，万事大吉，吉祥如意！大家新年快乐，万事大吉，吉祥如意！大家新年快乐，万事大吉，吉祥如意！大家新年快乐，万事大吉，吉祥如意！大家新年快乐，万事大吉，吉祥如意！大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [
        { id: 1, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 2, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 3, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
      ],
      thumbs: [
        { id: 2, nickname: '小红' },
        { id: 3, nickname: '小强' },
      ],
      comments: [
        { id: 1, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '你吃饭了吗？' },
        { id: 2, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '我吃过了，出去玩吗？' },
        { id: 3, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '等我一会，马上出门。' },
        { id: 4, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '好，老地方见。' },
      ],
    },
    {
      id: 2,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [
        { id: 1, url: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' },
        { id: 2, url: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' },
        { id: 3, url: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' },
      ],
      thumbs: [
        { id: 2, nickname: '小红' },
        { id: 3, nickname: '小强' },
      ],
      comments: [
        { id: 1, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '你吃饭了吗？' },
        { id: 2, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '我吃过了，出去玩吗？' },
        { id: 3, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '等我一会，马上出门。' },
        { id: 4, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '好，老地方见。' },
      ],
    },
    {
      id: 3,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [],
      thumbs: [],
      comments: [],
    },
    {
      id: 4,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [],
      thumbs: [],
      comments: [],
    },
    {
      id: 5,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [],
      thumbs: [],
      comments: [],
    },
    {
      id: 6,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [],
      thumbs: [],
      comments: [],
    },
    {
      id: 7,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [],
      thumbs: [],
      comments: [],
    },
    {
      id: 8,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [
        { id: 1, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 2, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 3, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
      ],
      thumbs: [
        { id: 2, nickname: '小红' },
        { id: 3, nickname: '小强' },
      ],
      comments: [
        { id: 1, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '你吃饭了吗？' },
        { id: 2, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '我吃过了，出去玩吗？' },
        { id: 3, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '等我一会，马上出门。' },
        { id: 4, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '好，老地方见。' },
      ],
    },
    {
      id: 9,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [
        { id: 1, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 2, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 3, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
      ],
      thumbs: [
        { id: 2, nickname: '小红' },
        { id: 3, nickname: '小强' },
      ],
      comments: [
        { id: 1, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '你吃饭了吗？' },
        { id: 2, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '我吃过了，出去玩吗？' },
        { id: 3, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '等我一会，马上出门。' },
        { id: 4, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '好，老地方见。' },
      ],
    },
    {
      id: 10,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [
        { id: 1, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 2, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 3, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
      ],
      thumbs: [
        { id: 2, nickname: '小红' },
        { id: 3, nickname: '小强' },
      ],
      comments: [
        { id: 1, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '你吃饭了吗？' },
        { id: 2, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '我吃过了，出去玩吗？' },
        { id: 3, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '等我一会，马上出门。' },
        { id: 4, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '好，老地方见。' },
      ],
    },
    {
      id: 11,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [
        { id: 1, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 2, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 3, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
      ],
      thumbs: [
        { id: 2, nickname: '小红' },
        { id: 3, nickname: '小强' },
      ],
      comments: [
        { id: 1, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '你吃饭了吗？' },
        { id: 2, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '我吃过了，出去玩吗？' },
        { id: 3, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '等我一会，马上出门。' },
        { id: 4, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '好，老地方见。' },
      ],
    },
    {
      id: 12,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [
        { id: 1, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 2, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 3, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
      ],
      thumbs: [
        { id: 2, nickname: '小红' },
        { id: 3, nickname: '小强' },
      ],
      comments: [
        { id: 1, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '你吃饭了吗？' },
        { id: 2, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '我吃过了，出去玩吗？' },
        { id: 3, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '等我一会，马上出门。' },
        { id: 4, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '好，老地方见。' },
      ],
    },
    {
      id: 13,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [
        { id: 1, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 2, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 3, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
      ],
      thumbs: [
        { id: 2, nickname: '小红' },
        { id: 3, nickname: '小强' },
      ],
      comments: [
        { id: 1, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '你吃饭了吗？' },
        { id: 2, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '我吃过了，出去玩吗？' },
        { id: 3, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '等我一会，马上出门。' },
        { id: 4, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '好，老地方见。' },
      ],
    },
    {
      id: 14,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [
        { id: 1, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 2, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 3, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
      ],
      thumbs: [
        { id: 2, nickname: '小红' },
        { id: 3, nickname: '小强' },
      ],
      comments: [
        { id: 1, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '你吃饭了吗？' },
        { id: 2, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '我吃过了，出去玩吗？' },
        { id: 3, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '等我一会，马上出门。' },
        { id: 4, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '好，老地方见。' },
      ],
    },
    {
      id: 15,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [
        { id: 1, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 2, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 3, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
      ],
      thumbs: [
        { id: 2, nickname: '小红' },
        { id: 3, nickname: '小强' },
      ],
      comments: [
        { id: 1, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '你吃饭了吗？' },
        { id: 2, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '我吃过了，出去玩吗？' },
        { id: 3, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '等我一会，马上出门。' },
        { id: 4, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '好，老地方见。' },
      ],
    },
    {
      id: 16,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [
        { id: 1, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 2, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 3, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
      ],
      thumbs: [
        { id: 2, nickname: '小红' },
        { id: 3, nickname: '小强' },
      ],
      comments: [
        { id: 1, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '你吃饭了吗？' },
        { id: 2, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '我吃过了，出去玩吗？' },
        { id: 3, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '等我一会，马上出门。' },
        { id: 4, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '好，老地方见。' },
      ],
    },
    {
      id: 17,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [
        { id: 1, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 2, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 3, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
      ],
      thumbs: [
        { id: 2, nickname: '小红' },
        { id: 3, nickname: '小强' },
      ],
      comments: [
        { id: 1, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '你吃饭了吗？' },
        { id: 2, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '我吃过了，出去玩吗？' },
        { id: 3, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '等我一会，马上出门。' },
        { id: 4, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '好，老地方见。' },
      ],
    },
    {
      id: 18,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [
        { id: 1, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 2, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 3, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
      ],
      thumbs: [
        { id: 2, nickname: '小红' },
        { id: 3, nickname: '小强' },
      ],
      comments: [
        { id: 1, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '你吃饭了吗？' },
        { id: 2, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '我吃过了，出去玩吗？' },
        { id: 3, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '等我一会，马上出门。' },
        { id: 4, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '好，老地方见。' },
      ],
    },
    {
      id: 19,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [
        { id: 1, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 2, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 3, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
      ],
      thumbs: [
        { id: 2, nickname: '小红' },
        { id: 3, nickname: '小强' },
      ],
      comments: [
        { id: 1, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '你吃饭了吗？' },
        { id: 2, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '我吃过了，出去玩吗？' },
        { id: 3, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '等我一会，马上出门。' },
        { id: 4, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '好，老地方见。' },
      ],
    },
    {
      id: 20,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'https://img2.baidu.com/it/u=3159683244,3630451771&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      content: '大家新年快乐，万事大吉，吉祥如意！',
      createTime: '2018-01-01 21:13:35',
      pictures: [
        { id: 1, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 2, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
        { id: 3, url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
      ],
      thumbs: [
        { id: 2, nickname: '小红' },
        { id: 3, nickname: '小强' },
      ],
      comments: [
        { id: 1, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '你吃饭了吗？' },
        { id: 2, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '我吃过了，出去玩吗？' },
        { id: 3, userId: 1, toId: 2, fromName: '小明战神', toName: '小红', content: '等我一会，马上出门。' },
        { id: 4, userId: 2, toId: 1, fromName: '小红', toName: '小明战神', content: '好，老地方见。' },
      ],
    },
  ]
</script>

<style scoped lang="less">
  .pyq-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    .pyq-main {
      // width: 50%;
      width: 768px;
      height: calc(100vh - 60px);
      border-left: 1px solid var(--border-color);
      border-right: 1px solid var(--border-color);
    }
  }
</style>
