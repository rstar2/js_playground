<template>
  <div class="poll">
    <h2>{{ title }}</h2>

    <PollItem v-for="item in items" :key="item.id"
      :item="item"
      :selected="item === selected"
      @select="select"
    >{{ item }}</PollItem>

    <button @click="vote" :disabled="!selected">Vote</button>
  </div>
</template>

<script>
import PollItem from "./PollItem.vue";

export default {
  components: {
    PollItem,
  },
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selected: null
    };
  },
  methods: {
    vote() {
      console.log("Vote for", this.selected);
      this.$emit('vote', this.selected);
    },
    select(item) {
      this.selected = item;
    }
  },
};
</script>

