<template>
  <PlatformNav :selectedKey="['0']">
    <template #content>
      <a-page-header title="通知公告">
        <template #tags></template>
        <a-collapse v-model:activeKey="activeKey" :bordered="false" :accordion="true">
          <a-collapse-panel v-for="notice in noticeList" :key="notice.id">
            <template #header>
              <a-tag color="red" v-if="notice.isImportant">重要通知</a-tag>
              {{ notice.title }}</template
            >
            <template #extra>{{ notice.publisher }} 于 {{ dayjs(notice.publishDate).format('YYYY-MM-DD HH:mm:ss') }} 发布</template>
            <div v-html="notice.content"></div>
          </a-collapse-panel>
        </a-collapse>
      </a-page-header>
    </template>
  </PlatformNav>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import PlatformNav from '@/components/base/nav/PlatformNav.vue';

import dayjs from 'dayjs';

import { getNotice } from '@/assets/js/request/NoticeAPI.js';

const noticeList = ref([]);

onMounted(async () => {
  noticeList.value = (await getNotice()).list;
});
</script>