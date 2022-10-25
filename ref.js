/*
 * @Description: 代理原始值
 * @Author: sunsh
 * @Date: 2022-10-25 15:40:49
 * @LastEditors: sunsh
 * @LastEditTime: 2022-10-25 16:57:55
 */
function ref(origin) {
  const wrapper = {
    value: origin
  };

    // NOTE 1 区分ref和普通对象
    Object.defineProperty(wrapper, "__v_isRef", {
      value: true
    });

  // 实现响应式
  return reactive(wrapper); // vue 中的reactive函数
}


// NOTE 2 为了解决响应式丢失问题有了toRef, toRefs
const react = reactive({foo: 1});
let newReact = {...react}; // 丢失了响应式， 那就在foo外边包裹一层

// 其中target是响应式对象
function toRef(target, key) {
  let wrapper = {
    get value() {
      return  target[key];
    },

    set value(value) {
      target[key] = value;
    }
  }

  // 区分ref和普通对象
  Object.defineProperty(wrapper, "__v_isRef", {
    value: true
  });

  return wrapper;
}

function toRefs(obj) {
  const ref = {};

  for (const key in obj) {
      ref[key] = toRef(obj, key);
  }

  return ref;
}


// NOTE 3 新问题：toRefs转换后的值访问要带value，如何能不带呢？ 脱ref
// vue的reactive会自动脱ref
const newNewReact = {...toRefs(react)};
function ProxyRefs(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      return value.__v_isRef ? value.value : value;
    },
    set(target, key, newValue, receiver) {
      const value = target[key];

      if (value.__v_isRef) {
        value.value = newValue;
        return true;
      }

      return Reflect.set(target, key, newValue, receiver);
    }
  });
}
