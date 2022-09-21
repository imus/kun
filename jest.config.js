/*
 * @Description: 
 * @Author: sunsh
 * @Date: 2022-09-20 15:51:35
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-20 15:51:42
 */

module.exports = {
  transform: {
    // .vue文件用 vue-jest 处理
    '^.+\\.vue$': 'vue-jest',
    // .js或者.jsx用 babel-jest处理
    '^.+\\.jsx?$': 'babel-jest', 
    //.ts文件用ts-jest处理
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['**/?(*.)+(spec).[jt]s?(x)']
}
