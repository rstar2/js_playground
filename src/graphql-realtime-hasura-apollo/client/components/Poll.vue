<template>
  <div class="poll">
    <h2>{{ question }}</h2>

    <PollOption
      v-for="option in options"
      :key="option.id"
      :option="option"
      :selected="option === selected"
      @select="select"
    ></PollOption>

    <button @click="vote" :disabled="!selected">Vote</button>
  </div>
</template>

<script>
import PollOption from "./PollOption.vue";

export default {
  components: {
    PollOption
  },
  props: {
    question: {
      type: String,
      required: true
    },
    options: {
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
      this.$emit("vote", this.selected);
    },
    select({ option, checked }) {
      // works like a radio-buttons selection
      if (checked){
          this.selected = option;
      } else {
          this.selected = null;
      }
    }
  }
};
</script>

