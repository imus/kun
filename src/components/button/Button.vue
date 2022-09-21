<template>
  <button :class="classList">
    <slot />
  </button>
</template>
<script lang="ts">
export default {
  name: "ElButton"
};
</script>

<script setup lang="ts">
import { withDefaults, computed } from 'vue';
import { useGlobalConfig } from '../../utils/useGlobalConfig';

type Size = '' | 'small' | 'medium' | 'large';
type Type = 'primary' | 'empty';
interface Prop {
  size?: Size; // size属性还可以全局设置
  type?: Type;
  round?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  size: '',
  type: 'primary',
  round: false
});


const classList = computed(() => {
  const size = props.size || useGlobalConfig().size;

  return {
    [size ? 'el-button--' + size : 'el-button']: true,
    ['el-button--' + props.type]: true,
    'is-round': props.round
  };
});


</script>

<style lang="scss">
@import '../styles/mixin';

@include b(button){
  display: inline-block;
  cursor: pointer;
  background: $--button-default-background-color;
  color: $--button-default-font-color;
  @include button-size (
    $--button-padding-vertical,
    $--button-padding-horizontal,
    $--button-font-size,
    $--button-border-radius
  );
  @include modifier(small) {
    @include button-size (
      $--button-medium-padding-vertical,
      $--button-medium-padding-horizontal,
      $--button-medium-font-size,
      $--button-medium-border-radius
    );
  }
  @include modifier(large) {
    @include button-size(
      $--button-large-padding-vertical,
      $--button-large-padding-horizontal,
      $--button-large-font-size,
      $--button-large-border-radius
    );
  }
  @include modifier(primary) {
    @include button-variant(
      $color: $--button-primary-font-color,
      $background-color: $--button-primary-background-color,
      $border-color: $--button-primary-border-color
    );
  }
}
</style>