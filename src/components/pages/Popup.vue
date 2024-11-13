<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import browser from "webextension-polyfill";
  import AppToogle from '../utils/AppToogle/AppToogle.vue'
  const isConnected = ref(false)

  const handleUpdateToogle = async (value: boolean) => {
    await browser.storage.local.set({ 'IS_CONNECTED': `${String(value).toUpperCase()}` })
    isConnected.value = value
  }

  const init = async () => {
    const { IS_CONNECTED } = await browser.storage.local.get('IS_CONNECTED')
    isConnected.value = IS_CONNECTED === 'TRUE'
  }

  init()
</script>

<template>
  <div>
    <img src="/icon-with-shadow.svg" />
    <h1>vite-plugin-web-extension</h1>
    <AppToogle
      :model-value="isConnected"
      @update:model-value="handleUpdateToogle"
    />
  </div>
</template>

<style>

  /* Just auto generated styles, dont pay attention! */
  html,
  body {
    width: 300px;
    height: 400px;
    padding: 0;
    margin: 0;
  }

  body {
    background-color: rgb(36, 36, 36);
  }

  body>div {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    justify-content: center;
  }

  img {
    width: 200px;
    height: 200px;
  }

  h1 {
    font-size: 18px;
    color: white;
    font-weight: bold;
    margin: 0;
  }
</style>
