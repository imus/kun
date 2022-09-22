/*
 * @Description: 
 * @Author: sunsh
 * @Date: 2022-09-22 12:57:44
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-22 13:00:01
 */
import { App } from "vue";
import ElForm from './Form.vue';
import ElFormItem from './FormItem.vue';
import ElInput from './Input.vue';

export default {
  install(app: App) {
    app.component(ElForm.name, ElForm);
    app.component(ElFormItem.name, ElFormItem);
    app.component(ElInput.name, ElInput);
  }
};