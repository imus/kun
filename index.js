/*
 * @Description: 响应系统的实现
 * @Author: sunsh
 * @Date: 2022-09-27 10:48:01
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-27 19:10:49
 */
let origin = {
  foo: 'foo',
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

  const effectFnCopy = new Set(bucket.get(target)?.get(key));
  effectFnCopy.forEach(effectFn => effectFn()); // 此时count 为0 1 2 ，不再是0123，去除了之前origin.condition为true时，收集的多余副作用
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

// effect嵌套执行导致activeEffect为内层的fn, 且无法恢复。解决办法：调用栈，入栈再出栈activeEffect始终指定栈顶
let temp, temp1;
effect(() => {
  console.log('ha');
  effect(() => {
    console.log('wo');
    temp1 = origin.foo;
  });
  temp = origin.condition;
});

origin.condition = false; // 打印了两次wo, 因为内层effect修改activeEffect之后没有恢复