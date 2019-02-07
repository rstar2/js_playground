<template>
  <div>
    <!--
          Note v-bind="poll" is different from v-bind:poll="poll"
            1. v-bind="poll" actually is as extracting its keys and passing them as properties, e.g. equivalent to:
                  v-bind:question="poll.question"
                  v-bind:options="poll.options"
            2. v-bind:poll="poll" is passing the 'poll' as property
    -->
    <Poll v-if="poll" v-bind="poll" @vote="vote"/>
    <Results v-if="results" :results="results"/>
  </div>
</template>

<script>
import Poll from "@/components/Poll.vue";
import Results from "@/components/Results.vue";

// the 2 ways to import statically typed GraphQL queries
import { MUTATION_VOTE, SUBSCRIPTION_RESULT } from "@/apollo/graphql.js";
import QUERY_GET_POLL from "@/apollo/query_get_poll.gql";

export default {
  components: {
    Poll,
    Results
  },
  data() {
    return {
      polls: [],
      results: []
    };
  },
  computed: {
    poll() {
      return this.polls[0];
    }
  },
  // these GraphQL queries will be made on mounting the Vue component
  apollo: {
    // Queries
    polls: {
      query: QUERY_GET_POLL,

      // overwirite as the returned data is {poll} , but we named it polls in compoenent's data
      update({ poll }) {
        return poll;
      }
    },

    $subscribe: {
      // When results change
      results: {
        query: SUBSCRIPTION_RESULT,

        // Reactive variables (as we are using a function)
        variables() {
          // This works just like regular queries
          // and will re-subscribe with the right variables
          // each time the values change
          return {
            pollId: this.poll.id
          };
        },
        // Result hook
        result({ data }) {
          // it returns data as { poll_results }
          //console.log("Results changed ", data);

          this.results = data.poll_results;
        },
        // Skip the subscription
        skip() {
          // when the poll is still not available
          return !this.poll;
        }
      }
    }
  },
  methods: {
    async vote(option) {
      // Call to the graphql mutation - returns a Promise
      await this.$apollo.mutate({
        // Query
        mutation: MUTATION_VOTE,
        // Parameters
        variables: {
          optionId: option.id,
          userId: "e347b9b0-c055-e799-85c1-f9bc1105ca8c"
        }
      });
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


