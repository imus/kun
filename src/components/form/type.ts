/*
 * @Description: 
 * @Author: sunsh
 * @Date: 2022-09-21 19:11:28
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-22 13:08:54
 */
import { InjectionKey} from 'vue';
import { Rules, Values} from 'async-validator';

export interface FormData {
  model: Record<string, unknown>,
  rules?: Rules
}

export type FormItem = {
  validator: () => Promise<Values>;
}

export const key: InjectionKey<FormData> = Symbol('form-data');