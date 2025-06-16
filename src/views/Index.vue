<style lang="less" scoped>
.ant-menu-horizontal {
  border-bottom: unset;
}
</style>
<template>
  <a-flex vertical align="center" style="display: flex; background-color: rgb(250, 251, 254)">
    <div style="position: relative; z-index: 5; width: 100%; background-color: rgb(255, 255, 255)">
      <Navbar :index="'1'" />
    </div>

    <a-flex vertical align="center" justify="center" style="position: relative; width: 100%; background: rgb(255, 255, 255)">
      <div style="position: relative; width: 1200px">
        <a-flex justify="right" style="position: absolute; top: 0px; right: -100px; z-index: 2">
          <img src="@/assets/images/backgrounds/search.svg" style="height: 700px" />
        </a-flex>

        <div style="min-width: 1200px; padding: 150px 40px">
          <h1 style="font-size: 36px">
            <span> Ocean Project</span>
            <span style="color: #5790c8; margin: 0px 20px">|</span>
            <span style="color: #324f6a">开源校园学生交流平台</span>
          </h1>
          <a-typography-text type="secondary" style="font-size: 18px">xxx</a-typography-text>

          <a-flex style="margin-top: 20px" :gap="10">
            <a-button type="primary">了解Ocean</a-button>
          </a-flex>
        </div>
      </div>
    </a-flex>
    <a-flex vertical align="center" style="position: relative; margin: 40px 0px; z-index: 4; min-width: 1200px">
      <a-tag color="success" style="font-size: 16px; padding: 5px 10px; margin-bottom: 10px; border-radius: 20px">Ocean简介</a-tag>
      <h2><b>Ocean开源校园学生交流平台</b></h2>
      <a-typography-text type="secondary" style="font-size: 18px"
        >xxx</a-typography-text
      >
      <a-flex :gap="40" style="margin: 30px">
        <a-card style="width: 350px">
          <template #cover>
            <img src="@/assets/images/backgrounds/node.svg" style="height: 190px" />
          </template>
          <a-card-meta>
            <template #title>
              <b style="font-size: 20px">校内文库</b>
            </template>
            <template #description>
              xxx
            </template>
          </a-card-meta>
        </a-card>
        <a-card style="width: 350px">
          <template #cover>
            <img src="@/assets/images/backgrounds/relation.svg" style="height: 190px" />
          </template>
          <a-card-meta>
            <template #title>
              <b style="font-size: 20px">校内论坛</b>
            </template>
            <template #description>
              xxx
            </template>
          </a-card-meta>
        </a-card>
        <a-card style="width: 350px">
          <template #cover>
            <img src="@/assets/images/backgrounds/polyline-edit.svg" style="height: 190px" />
          </template>
          <a-card-meta>
            <template #title>
              <b style="font-size: 20px">校内问答</b>
            </template>
            <template #description>
              xxx
            </template>
          </a-card-meta>
        </a-card>
      </a-flex>
    </a-flex>
    <a-flex vertical align="right" style="position: relative; background-color: #171347; width: 100%; padding: 100px 40px 0px 40px">
      <div style="position: absolute; top: -3px; right: 0; left: 0; width: 100%; overflow: hidden; transform: rotate(180deg); fill: rgb(250, 251, 254)">
        <svg
          width="2560px"
          height="100px"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          preserveAspectRatio="none"
          x="0px"
          y="0px"
          viewBox="0 0 2560 100"
          style="enable-background: new 0 0 2560 100"
          xml:space="preserve"
          class="fill-section-secondary"
        >
          <polygon points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>

      <a-flex align="flex-end" :gap="10">
        <img src="@/assets/images/logo-white.png" height="30px" />
        <div style="color: #a0aec0">Ocean</div>
      </a-flex>

      <a-divider style="border-color: rgba(216, 203, 187, 0.1)" />

      <a-flex style="padding-bottom: 20px; color: #a0aec0">
        <div>
          Copyright © 2024. Fudan University & Oriole Software All right reserved.
          <br />
          Created by <a href="mailto:jzsun24@m.fudan.edu.cn">远致Neo</a>
        </div>
      </a-flex>
    </a-flex>
  </a-flex>
</template>

<script setup>
import { RocketOutlined, SaveOutlined } from '@ant-design/icons-vue';
import Navbar from '../components/base/nav/Navbar.vue';
</script>