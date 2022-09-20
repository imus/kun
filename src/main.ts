/*
 * @Description: 
 * @Author: sunsh
 * @Date: 2022-09-15 16:10:10
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-20 12:25:38
 */
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import ElContainer from "./components/container";

createApp(App).use(ElContainer).mount('#app');
