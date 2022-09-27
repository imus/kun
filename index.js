/*
 * @Description: 响应系统的实现
 * @Author: sunsh
 * @Date: 2022-09-27 10:48:01
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-27 11:19:20
 */
let origin = {
  foo: 'foo'
}

function effect() {
  document.getElementById("app").innerText = origin.foo
}

const bucket = new Set();

origin = new Proxy(origin, {
  get(target, key, receiver) {
    
    bucket.add(effect); // effect名字硬编码，不具有通用性

    return Reflect.get(target, key, receiver);
  },
  set(target, key, newValue, receiver) {
    
    bucket.forEach(fn => fn()); // 不能根据key区分对应的依赖，下次提交改进
    
    Reflect.set(target, key, newValue, receiver);
    return true;
  }
});

effect();