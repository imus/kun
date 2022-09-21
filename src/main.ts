/*
 * @Description: 
 * @Author: sunsh
 * @Date: 2022-09-15 16:10:10
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-21 12:42:36
 */
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import ElContainer from "./components/container";
import ElButton from "./components/button";

const app = createApp(App);
app.config.globalProperties.$kun = {
  size: 'small'
};

app
  .use(ElContainer)
  .use(ElButton)
  .mount('#app');
