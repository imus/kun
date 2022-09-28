/*
 * @Description: 响应系统的实现
 * @Author: sunsh
 * @Date: 2022-09-27 10:48:01
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-28 11:57:58
 */
let origin = {
  foo: 1,
  condition: false
}

// 为了处理？：情况下副作用遗留的问题
function cleanUp(effectFn) {
  effectFn.deps.forEach(set => set.delete(effectFn));
  effectFn.deps.length = 0;
}

// 用于注册副作用的函数, 解决副作用函数名字硬编码
let activeEffect;
let effectStack = [];

function effect(cb, options = {}) {
  // 这个函数的封装就为了添加.deps依赖
  const effectFn = () => {
    // trigger中执行的是该函数, 执行的时候会重新收集。
    cleanUp(effectFn);
    activeEffect = effectFn;
    
    effectStack.push(effectFn);
    let res = cb(); // cb里面有effect就可能修改activeEffect,用调用栈解决
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];

    return res;
  }
  // 用来存储所有与该副作用函数相关联的依赖集合, effectFn所在的所有set集合
  effectFn.deps = [];
  effectFn.options = options; // 在cb() 应该判断scheduler存在与否，然后执行应该也可以
  if (options.lazy) {
    return effectFn; // 让用户控制
  } else {
    effectFn();
  }
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
  effectFnCopy.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
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

// 调度器就是执行副作用函数的：可以控制顺序
let jobsQueue = new Set();
let p = Promise.resolve();
let flushing = false;
function flushJob() {
  if (flushing) {
    return;
  }

  flushing = true; // 用一个标志，控制后续的执行1次

  p.then(() => { // 延迟到同步执行完毕执行一次
    jobsQueue.forEach(job => job());
  }).finally(() => {
    flushing = false;
  });
}


/* let temp, temp1;
effect(() => {
  console.log(origin.foo);
}, {
  scheduler: function(cb) {
    // 改进：支持控制调用次数
    jobsQueue.add(cb);
    flushJob();
  }
});

origin.foo++;
console.log('sync'); // 1, sync, 2

// 还可以控制执行次数, 由于scheduler中是异步调用cb, 所以目前还不行
while(origin.foo < 1000) {
  origin.foo++; //最终打印了999次值1000
} */

// 计算属性: TODO 也可以接受setter
// 实现：1.要求返回一个ref是getter的值 2：getter能在依赖变化时返回值??? 把getter作为effect的回调传入，注册一个副作用函数
function computed(getter) {
  // NOTE2 如何缓存值呢？多次访问计算属性结果不变不执行effectFn
  let dirty = true; // 数据需要计算
  let value;

  const effectFn = effect(getter, {
    lazy: true, // 要求effect不能一上来就执行内部的副作用函数
    scheduler(cb) {
      if(!dirty) {
        dirty = true; // 数据变化会执行scheduler
        trigger(ref, 'value');
      }
      
    }
  });

  const ref = {
    get value() {
      if (dirty) {
        value = effectFn();
        dirty = false; // 缓存，如何变化时重新开启呢？scheduler中
      }
      track(ref, 'value'); // 手动收集依赖
      return value;
    }
  }

  return ref;
}

const comp = computed(() => {
  return origin.foo + 1; // 读取comp.value时才被收集为依赖
});
console.log(comp.value); // 2
console.log(comp.value); // 2，如果没有缓存则会多次执行effectFn,因此需要添加缓存通过dirty实现
origin.foo++;
console.log(comp.value); // 3
// NOTE1 以上知识懒计算


// NOTE3 特殊情况：effect依赖计算属性
effect(() => {
  console.log(comp.value); // 在computed ref 的get中手动收集依赖
});
origin.foo = 4; // 期望effect执行，在computed 中track手动触发依赖