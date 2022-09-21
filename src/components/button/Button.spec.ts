/*
 * @Description: TDD 测试驱动Button开发
 * @Author: sunsh
 * @Date: 2022-09-20 17:55:29
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-20 19:07:22
 */
import { mount, } from '@vue/test-utils';
import Button from './Button.vue';

describe('按钮组件测试用例', () => {
  it('文本正常显示', () => {
    const text = "文本正常";
    const wrapper = mount(Button, {
      slots: {
        default: text
      }
    });
    expect(wrapper.text()).toBe(text);
  });
  it('size控制大小, type控制按钮种类, round控制圆角大小', () => {
    const props = {
      size: 'small',
      type: 'primary',
      round: true,
    };
    const classes = ['el-button--small', 'el-button--primary', 'is-round'];

    const wrapper = mount(Button, {
      props,
    });

    expect(wrapper.classes()).toEqual(expect.arrayContaining(classes));
  });
});