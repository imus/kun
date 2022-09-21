/*
 * @Description: 
 * @Author: sunsh
 * @Date: 2022-09-20 22:50:04
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-20 22:55:56
 */
import { getCurrentInstance, ComponentInternalInstance } from "vue";

export function useGlobalConfig() {
  const instance: ComponentInternalInstance | null = getCurrentInstance();
  if (!instance) {
    throw Error('useGlobalConfig must be used in setup function!');
    return;
  }

  return instance.appContext.config.globalProperties.$kun || {};
}