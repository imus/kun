<!--
 * @Description:
 * @Author: sunsh
 * @Date: 2022-09-15 16:10:10
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-20 12:10:04
-->
<script setup lang="ts">
import { ref } from 'vue';
import ElContainer from './container/container.vue';
import ElHeader from './container/Header.vue';

// defineProps<{ msg: string }>()
defineProps({
  msg: String
});

const count = ref(0);
</script>

<template>
  <el-container direction="vertical">
    <el-header>我是el-header</el-header>
  </el-container>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
