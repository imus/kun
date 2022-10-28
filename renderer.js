/*
 * @Description: 渲染器
 * @Author: sunsh
 * @Date: 2022-10-26 10:26:56
 * @LastEditors: sunsh
 * @LastEditTime: 2022-10-28 10:56:34
 */

import * as docApi from './paltformApi.js';

// 定义文本注释节点的类型
/* {
  type: Text,
  children: '我是文本节点，注释节点也类似'
} */
const Text = Symbol('text');
const Comment = Symbol('comment');
const Fragment = Symbol('fragment');

// 1.渲染器： 把 虚拟 DOM渲染为与  特定平台相关  的真实节点。
function simpleRender(domString, container) {
  container.innerHTML = domString;
}

// 2. 为啥要创建函数返回render? renderer不仅包括渲染render,还包括激活同构元素hydrate, createApp等。
function createRenderer(opts) {

  const { 
          createElement, 
          createTextNode, 
          setText,
          createCommentNode, 
          setComment,
          setElementText, 
          insert, 
          patchProps 
        } = opts;

  // 3. 实现渲染
  function render(vnode, container) {
    // 4. 既然是渲染新内容，那么 新内容vnode 可以存在也可不存在, 不存在就卸载原内容
    if (vnode) {
      // 5. 挂载和打补丁patch: 可以是首次轮胎被扎打补丁，也可能是原来就有补丁要更新补丁（要么撕了旧的贴新的，要么对旧补丁修修补补）
      patch(container._vnode, vnode, container);
    } else {
      // 6. 卸载: 其实卸载的发生在更新阶段：挂载后后续渲染render会触发更新。
      // 直接innerHTML卸载元素的弊端：无法触发unmounted等卸载相关的钩子，正确执行 **自定义指令钩子函数** ，以及事件监听器无法销毁
      // 具体的卸载方式就是找到DOM并卸载之，怎么保存DOM呢？ 那就在创建的时候保存一份
      if (container._vnode) {
        unmount(container._vnode);
      }
    }

    // 7.下次patch使用的旧的vnode
    container._vnode = vnode; 

  }

  // 8. 挂载和打补丁
  function patch(n1, n2, container) {
    // 9. 后续更新，打补丁前先判断节点type，不同就卸载然后再挂载
    if (n1 && n1.type !== n2.type) {
      unmount(n1);
      n1 = null; // important, 这样后续才能挂载
    }

    
    // 10. 新旧节点都存在，要判断type
    if (typeof n2.type === 'string') {

      // 8.1 挂载
      if (!n1) {
        mountElement(n2, container);
      } else {
        // 8.2 更新
        // kong

        // 11. 
        patchElement(n1, n2);
  
      }
      
    } else if (typeof n2.type === 'object') { // 组件类型

    } else if (typeof n2.type === Fragment) { // Fragment： 类似Text没有tag只有内容，children是个数组
      // 14 14.1见unmount
      if (!n1) {
        n2.children.forEach(child => patch(null, child, container));
      } else {
        patchChildren(n1, n2, container);
      }
      
    } else if (n2.type === Text) { // 文本
      // 12
      // 挂载和更新
      if (!n1) {
        const el = n2.el = createTextNode(n2.children); // 记得n2.el
        insert(el, container);
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          setText(el, n2.children);
        }
      }
    } else if (n2.type === Comment) { // 注释
      // 13， 同12逻辑类似
      // 挂载和更新
      if (!n1) {
        const el = n2.el = createCommentNode(n2.children); // 记得n2.el
        insert(el, container);
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          setComment(el, n2.children);
        }
      }
    }

  }
  
  // 8.3 这里默认为元素类型： 其实肯定还要判断vnode的类型要不然创建元素时怎么知道该调用哪个方法？？？
  function mountElement(vnode, container) {
    // 这里与特定平台相关了，那就把dom相关内容抽离除去把
    // const el = document.createElement(vnode.type);

    // if (typeof vnode.children === 'string') {
    //   el.textContent = vnode.children;
    // }

    // container.appendChild(el);

    // 平台无关代码
    // 6.1 在vnode上保存DOM, 方便卸载时使用
    const el = vnode.el = createElement(vnode.type);

    // ANCHOR 8.5 属性的处理：对应vnode.props
    // TODO 事件属性

    if (vnode.props) {
      for (const key in vnode.props) {
        if (Object.hasOwnProperty.call(vnode.props, key)) {
          const value = vnode.props[key];
          // 8.6 属性处理平台相关
          patchProps(el, key, null, value);
        }
      }
    }

    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      
      // 8.4 vnode的children为数组
      vnode.children.forEach(child => {
        patch(null, child, el); // 初始挂载没有旧元素
      });
    }

    insert(el, container);
  }

  // 6.2.unmount实现: DOM的卸载是与平台相关的，那就把 具体卸载方法 抽离
  function unmount(vnode) {
    // 14.1 支持Fragment卸载
    if (vnode.type === Fragment) {
      vnode.children.forEach(child => unmount(child));
      return;
    }


    const parentNode = vnode.el.parentNode;
    if (parentNode) {
      parentNode.removeChild(vnode.el);
    }
  }

  // 11.1 更新元素，及其子元素
  function patchElement(n1, n2) {
    // 标签不用更新，因为type已经在patch中判断过了
    // 更新属性
    // 更新子节点
    const el = n2.el = n1.el; // DOM
    // 11.2 更新属性
    const oldProps = n1.props;
    const newProps = n2.props;

    for (const key in newProps) {
      if (Object.hasOwnProperty.call(newProps, key)) {
        if (newProps[key] !== oldProps[key]) {
          patchProps(el, key, oldProps[key], newProps[key]);
        }
      }
    }

    for (const key in oldProps) {
      if (Object.hasOwnProperty.call(oldProps, key)) {
        if (!(key in newProps)) { // 新的属性不包含就有的属性
          patchProps(el, key, oldProps[key], null); // 清除旧有属性
        }
      }
    }


    // 11.3 更新子节点
    patchChildren(n1, n2, el);

  }

  //11.4 子节点要么string, 要么array, 要么不存在： 新旧3 x 3 = 9种情况（但不一定完全需要）
  function patchChildren(n1, n2, container) {
    const oldChildren = n1.children, newChildren = n2.children;

    if (typeof newChildren === 'string') {
      // 卸载旧节点
      if (Array.isArray(oldChildren)) {
        oldChildren.forEach(child => unmount(child));
      }
      setElementText(container, newChildren);

    } else if (Array.isArray(newChildren)) {
      if (Array.isArray(oldChildren)) {
        // diff算法
        // TODO
      } else {
        setElementText(container, '');
        newChildren.forEach(child => patch(null, child, container)); // 为啥不是mountElement, 因为children可能是组件，不一定是原生元素
      }

    } else {
      if (Array.isArray(oldChildren)) {
        oldChildren.forEach(child => unmount(child));
      } else if (typeof oldChildren === 'string') {
        setElementText(container, '');
      }
    }
  }

  function hydrate(params) {
    
  }

  function createApp() {

  }

  return { render, hydrate, createApp }
}


/* 分割线 */
const { render } = createRenderer(docApi);
let vnode = {
  type: 'DIV',
  children: 'Hello renderer'
};

// props处理
vnode = {
  type: 'INPUT',
  props: {
    disable: '', // dom.setAttribute 第二个参数设置时始终认为是string， “false"与本意不禁用反了
    value: 123,
    type: 'haha', // 设置不正确使用默认值input.defaultValue
    form: 'form1', // 原生是只读的, 那就不应该修改值
    id: 'input',
    className: [
      'input input1',
      {
        input2: true,
        input3: false
      }
    ]
  },
  children: null
}

render(vnode, document.getElementById("app"));

setTimeout(() => {
  render({
    type: 'SPAN', 
    props: {
      onClick: [
        e => {
          alert(1)
        },
        e => {
          alert(2)
        }
      ],
      oncontextmenu() {
        alert('ctx')
      }

    },
    children: 'hello renderer1'
  }, document.getElementById("app"));
}, 2000);


