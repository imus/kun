/*
 * @Description: 
 * @Author: sunsh
 * @Date: 2022-09-20 12:18:45
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-22 12:58:09
 */
import { App } from "vue";
import ElContainer from './Container.vue';
import ElHeader from './Header.vue';

export default {
  install(app: App) {
    app.component(ElContainer.name, ElContainer);
    app.component(ElHeader.name, ElHeader);
  }
};