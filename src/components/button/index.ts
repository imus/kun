/*
 * @Description: ElButton组件
 * @Author: sunsh
 * @Date: 2022-09-20 23:08:34
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-20 23:10:38
 */
import { App } from "vue";
import ElButton from "./Button.vue";

export default {
  install(app: App) {
    app.component(ElButton.name, ElButton);
  }
};