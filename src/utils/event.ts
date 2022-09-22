/*
 * @Description: 
 * @Author: sunsh
 * @Date: 2022-09-21 18:51:06
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-22 13:14:47
 */
import mitt, { EventType } from 'mitt';

let emitter!: object;
export default function createEvent<T extends Record<EventType, unknown>>() {
  emitter = emitter || mitt<T>();
  return emitter;
}