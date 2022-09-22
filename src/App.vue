<!--
 * @Description: 
 * @Author: sunsh
 * @Date: 2022-09-15 16:10:10
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-22 13:29:31
-->
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue';
import { ref, reactive, } from 'vue';

const refForm = ref(null);
const ruleForm = reactive({
  input: '1'
});
const rules = reactive({
  input: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
});

function onSubmit() {
  refForm.value.validate((valid) => {
    if (valid) {
      alert('submit!');
    } else {
      console.log('error submit!!');
      return false;
    }
  });
}
</script>

<template>
  <el-form ref="refForm" :model="ruleForm" :rules="rules">
    <el-form-item prop="input">
      <el-input v-model="ruleForm.input"></el-input>
    </el-form-item>
  </el-form>

  <el-button @click="onSubmit" round>我是全局按钮组件</el-button>

  <el-container>
    <el-header>我是全局注册的el-header</el-header>
  </el-container>

  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
