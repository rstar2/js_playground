<template>
  <div class="option">
    <input
      type="checkbox"
      :checked="selected"
      @change="$emit('select', {option, checked: $event.target.checked})"
    >
    <span>{{option.text}}</span>
  </div>
</template>

<script>
export default {
  props: {
    option: {
      type: Object,
      required: true
    },
    selected: Boolean
  }
};
</script>

