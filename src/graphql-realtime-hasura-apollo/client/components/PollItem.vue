<template>
  <div class="item">
    <input
      type="checkbox"
      :checked="selected"
      @change="$emit('select', {item, checked: $event.target.checked})"
    >
    <span>{{item.name}}</span>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    selected: Boolean
  }
};
</script>

