<template>
  <div>
      <!--
          Note v-bind="poll" is different from v-bind:poll="poll"
            1. v-bind="poll" actually is as extracting its keys and passing them as properties, e.g. equivalent to:
                  v-bind:title="poll.title"
                  v-bind:items="poll.items"
            2. v-bind:poll="poll" is passing the 'poll' as property
      -->
    <Poll v-bind="poll"/>
    <Results/>
  </div>
</template>

<script>
import Poll from "@/components/Poll.vue";
import Results from "@/components/Results.vue";

export default {
  components: {
    Poll,
    Results
  },
  data() {
    return {
      poll: {
        title: "Favourite JS framework",
        id: "123123",
        items: [
          {
            name: "Angular",
            id: "123123"
          },
          {
            name: "React",
            id: "234234"
          },
          {
            name: "VueJS",
            id: "45645645"
          }
        ]
      }
    };
  }
};
</script>

<style>
body {
  font-style: italic;
  border: solid 1px pink;
}
</style>


