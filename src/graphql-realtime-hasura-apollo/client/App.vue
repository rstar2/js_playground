<template>
  <div>
    <!--
          Note v-bind="poll" is different from v-bind:poll="poll"
            1. v-bind="poll" actually is as extracting its keys and passing them as properties, e.g. equivalent to:
                  v-bind:title="poll.title"
                  v-bind:items="poll.items"
            2. v-bind:poll="poll" is passing the 'poll' as property
    -->
    <Poll v-bind="poll" @vote="vote"/>
    <Results :items="poll.items" :results="results"/>

    <h1>{{hello}}</h1>
  </div>
</template>

<script>
import Poll from "@/components/Poll.vue";
import Results from "@/components/Results.vue";

import { HELLO_QUERY } from "@/apollo/graphql.js"

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
      },
      results: [
        {
          id: "123123",
          value: 28
        },
        {
          id: "234234",
          value: 73
        },
        {
          id: "45645645",
          value: 52
        }
      ],
      hello: ''
    };
  },
  apollo: {
    // Simple query that will update the 'hello' vue property
    hello: HELLO_QUERY
  },
  methods: {
    async vote(item) {
      // Call to the graphql mutation
      const result = await this.$apollo.mutate({
        // Query
        mutation: gql`
          mutation($label: String!) {
            addTag(label: $label) {
              id
              label
            }
          }
        `,
        // Parameters
        variables: {
          label: this.newTag
        }
      });

      this.results.some(res => res.id === item.id && res.value++);
    }
  }
};
</script>

<style>
body {
  font-style: italic;
  border: solid 1px pink;
}
</style>


