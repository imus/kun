/*
 * @Description: 响应系统的实现
 * @Author: sunsh
 * @Date: 2022-09-27 10:48:01
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-27 17:49:16
 */
let origin = {
  foo: 'foo'
}

function cleanUp(effectFn) {
  effectFn.deps.forEach(set => set.delete(effectFn));
  effectFn.deps.length = 0;
}

// 用于注册副作用的函数, 解决副作用函数名字硬编码
let activeEffect;
function effect(cb) {
  const effectFn = () => {
    // trigger中执行的是该函数, 执行的时候会重新收集。
    cleanUp(effectFn);
    activeEffect = effectFn;
    cb();
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


let count = 0;
function handler1() {
  console.log(count++);
  document.getElementById("app").innerText = origin.condition ? origin.foo: "constant"
}
effect(handler1);

setTimeout(() => {
  /* NOTE 第1次执行effect时，收集了condition的依赖一次， target为{foo：xxx}, 还没有condition属性。handler1第一次执行。
    动态添加的属性, 执行set时，target为同一个对象，会执行fn。 handler1第二次执行。
    此时，condition存在，foo存在，收集了各自的一次依赖。condition -> fn, foo -> fn
  */
  origin.condition = 'reactive';
  // 此时false, handler1中不会读取origin.foo了，但最后修改foo属性仍执行handler1了，可以执行但完全没必要。如何解决呢？
  // 先删除所有副作用函数，怎么删除呢？在副作用函数中保存相关联的key。
  origin.condition = false;
  origin.foo = "又要执行不必要的effect了。"
}, 1000);