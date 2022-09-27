/*
 * @Description: 响应系统的实现
 * @Author: sunsh
 * @Date: 2022-09-27 10:48:01
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-27 12:11:59
 */
let origin = {
  foo: 'foo'
}

// 用于注册副作用的函数, 解决副作用函数名字硬编码
let activeEffect;
function effect(cb) {
  activeEffect = cb;
  cb();
}

// 依赖集合的数据结构
const bucket = new WeakMap(); //[[origin, [originKey, new Set([handle1, ···])]], ···]

origin = new Proxy(origin, {
  get(target, key, receiver) {
    // bucket.add(activeEffect); // 解决硬编码问题

    // 依赖收集
    if (!activeEffect) return;
    let depsMap = bucket.get(target);
    if (!depsMap) {
      bucket.set(target, (depsMap = new Map()));
    }

    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }
    deps.add(activeEffect);

    return Reflect.get(target, key, receiver);
  },
  set(target, key, newValue, receiver) {
    Reflect.set(target, key, newValue, receiver); // 先设置新值
    
    bucket.get(target)?.get(key)?.forEach(fn => {
      fn();
    });
    
    return true;
  }
});

function handler1() {
  document.getElementById("app").innerText = origin.foo
}
effect(handler1);

setTimeout(() => {
  origin.foo = 'reactive'
}, 1000);