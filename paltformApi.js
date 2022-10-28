/*
 * @Description: 
 * @Author: sunsh
 * @Date: 2022-10-27 16:23:52
 * @LastEditors: sunsh
 * @LastEditTime: 2022-10-28 11:02:11
 */
export function createElement(tag) {
  return document.createElement(tag);
}

export function setElementText(el, text) {
  el.textContent = text;
}

export function insert(el, container) {
  container.appendChild(el);
}

export function createTextNode(content) {
  return document.createTextNode(content);
}

export function setText(el, text) {
  el.nodeValue = text;
}

export function createCommentNode(content) {
  return document.createComment(content);
}

export function setComment(el, comment) {
  el.nodeValue = comment;
}


// props处理，包括事件
function shouldSetProp(el, key) {
  // 只读属性
  if (el.tagName === 'INPUT' && key === 'form') {
    return false;
  }

  return key in el; // 无法通过el.prop访问的attribute使用setAttribute
}

function normalizeClass(className) {

  return className.map((name, key) => {
    if (typeof name === 'object') {
      return Object.keys(name)
        .filter(val => !!val)
        .join(' ');
    }

    return name;
  }).join(' ');
}

export function patchProps(el, key, preValue, value) {
  // 先remove事件监听器再add, 
  // 还有一种方法包装listener, wrapper.value保存原来的事件监听器，移除时替换value值即可
  if (/^on/.test(key)) {
    let eventName = key.slice(2).toLowerCase();
    const invokers = el.vueEventInvokers || (el.vueEventInvokers = {}); // el上可以同时添加不同类型的事件，同类型事件也可以绑定多个
    let invoker = invokers[key];
    if (value) {
      if (!invoker) {
        // 每个类型对应一个事件回调，真正的回调保存在invoker.value上
        invoker = el.vueEventInvokers[key] = (e) => {
          // 如果事件发生的时间早于事件处理函数绑定的时间，则不执行事件处理函数
          // e.timeStamp回调触发的时间
          // 处理事件冒泡与更新问题
          if (e.timeStamp < invoker.attached) {
            return;
          }

          if (Array.isArray(invoker.value)) {
            invoker.value.forEach(fn => fn(e));
          } else {
            invoker.value(e);
          }
        }
        invoker.value = value;
        invoker.attached = performance.now(); // 回调绑定的事件
        el.addEventListener(eventName, invoker);
      } else {
        invoker.value = value;
      }
    } else if (invoker) {
      el.removeEventListener(eventName, invoker);
    }
    
  } else if (key === 'className') {
    el.className = normalizeClass(value); // el.className, el.classList, setAttribute都可以，前者效率更高
  } else if (shouldSetProp(el, key)) {
    const originType = typeof el[key];
    if (originType === 'boolean' && value == '') {
      el[key] = true
    } else {
      el[key] = value;
    }
  } else {
    el.setAttribute(key, value);
  }
}