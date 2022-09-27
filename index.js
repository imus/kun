/*
 * @Description: 响应系统的实现
 * @Author: sunsh
 * @Date: 2022-09-27 10:48:01
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-27 19:39:21
 */
let origin = {
  foo: 1,
  condition: false
}

function cleanUp(effectFn) {
  effectFn.deps.forEach(set => set.delete(effectFn));
  effectFn.deps.length = 0;
}

// 用于注册副作用的函数, 解决副作用函数名字硬编码
let activeEffect;
let effectStack = [];

function effect(cb) {
  // 这个函数的封装就为了添加.deps依赖
  const effectFn = () => {
    // trigger中执行的是该函数, 执行的时候会重新收集。
    cleanUp(effectFn);
    activeEffect = effectFn;
    
    effectStack.push(effectFn);
    cb(); // cb里面有effect就可能修改activeEffect,用调用栈解决
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  }
  // 用来存储所有与该副作用函数相关联的依赖集合, effectFn所在的所有set集合
  effectFn.deps = [];
  effectFn();
}

// 依赖集合的数据结构
const bucket = new WeakMap(); //[[origin, [originKey, new Set([handle1, ···])]], ···]；

function track(target, key, receiver) {

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

  activeEffect.deps.push(deps);
}

function trigger(target, key, receiver) {
  // 这里导致无限循环，fn中删了，然后执行cb又在set中加回来了，会导致无线循环。解决如下：
  // bucket.get(target)?.get(key)?.forEach(fn => {
  //   fn();
  // });

  const effectFnCopy = new Set();
  // 可以用.has判断，防止调用当前正在执行的effect: 递归调用
  bucket.get(target)?.get(key).forEach(effectFn => {
    if (effectFn !== activeEffect) {
      effectFnCopy.add(effectFn);
    }
  }); // effect中正在执行cb回调activeEffect还是当前的effectFn
  effectFnCopy.forEach(effectFn => effectFn());
}

origin = new Proxy(origin, {
  get(target, key, receiver) {
    // bucket.add(activeEffect); // 解决硬编码问题

    track(target, key, receiver);

    return Reflect.get(target, key, receiver);
  },
  set(target, key, newValue, receiver) {
    Reflect.set(target, key, newValue, receiver); // 先设置新值
    
    trigger(target, key);
    
    return true;
  }
});

let temp, temp1;
effect(() => {
  origin.foo++; // 等价于origin.foo = origin.foo + 1; // 触发get的同时触发set
});