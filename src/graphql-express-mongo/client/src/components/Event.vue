<template>
  <md-card>
    <md-card-header>
      <md-card-header-text>
        <div class="md-title">{{event.title | truncate(30)}}</div>
        <div class="md-subhead">{{event.description}}</div>
      </md-card-header-text>

      <!-- <md-card-media>
        <img src="/assets/examples/avatar-2.jpg" alt="People">
      </md-card-media>-->
    </md-card-header>

    <md-card-actions>
      <template v-if="!isCreator">
        <md-button @click="$emit('view-etails')">View Details</md-button>
        <md-button v-if="isAuth" @click="$emit('book')">Book</md-button>
      </template>
      <div v-else class="md-subhead">You are the creator</div>
    </md-card-actions>
  </md-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    event: { type: Object, required: true }
  },
  filters: {
    truncate(value, length) {
      if (!value || value.length < length) {
        return value;
      }
      return `${value.substr(0, length)}...`;
    }
  },
  computed: {
    // binding a namespaced Vuex module is a bit verbose
    ...mapGetters({
      isAuth: "auth/isAuth"
    }),

    isCreator() {
      return (
        this.isAuth &&
        this.event.creator._id === this.$store.getters["auth/userId"]
      );
    }
  }
};
</script>

<style>
.md-card {
  width: 320px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}
</style>
