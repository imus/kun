/*
 * @Description: 
 * @Author: sunsh
 * @Date: 2022-09-23 22:24:48
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-23 22:31:02
 */

// https://v2.vuepress.vuejs.org/zh/advanced/cookbook/usage-of-client-config.html

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { defineClientConfig } from '@vuepress/client';

export default defineClientConfig({
  enhance({ app, router, siteData }){
    app.use(ElementPlus);
  },
  setup(){},
  layouts: {},
  rootComponents: [],
})
