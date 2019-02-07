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
import QUERY_GET_ALL_POLLS from "@/apollo/query_get_all_polls.gql";
import QUERY_GET_POLL from "@/apollo/query_get_poll.gql";

export default {
  components: {
    Poll,
    Results
  },

  data() {
    return {
      poll: null,
      results: null
    };
  },

  // these GraphQL queries will be made on mounting the Vue component
  apollo: {
    // Queries
    poll: {
      query: QUERY_GET_ALL_POLLS,

      // 1. This will UPDATE (e.g set) the result immediately into the this.poll data field , as the apollo field is named also 'poll'
      // here the first poll is extractedd, but currentyl the way the QUERY_GET_ALL_POLLS is constructed no 'options' will be returned
      // overwirite as the returned data is {poll} , but we named it polls in compoenent's data,
      // so to disable the auto property update use "manual: true" - https://vue-apollo.netlify.com/api/smart-query.html#options
      //   update({ poll }) {
      //     return poll[0];
      //   },

      // 2. This will JUST inspect the result and will choose a random poll to show
      manual: true, // this mean that the auto property update will not happen 
      result({ data, loading, networkStatus, stale }, key) {
        const polls = data.poll;
        const random = Math.floor(Math.random() * polls.length);

        const randomPoll = polls[random];
        this.getPoll(randomPoll.id);
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
    async getPoll(pollId) {
      // Call to the graphql mutation - returns a Promise
      const result = await this.$apollo.query({
        // Query
        query: QUERY_GET_POLL,
        // Parameters
        variables: {
          pollId
        }
      });

      const polls = result.data.poll;
      this.poll = polls[0] || null;
    },

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


