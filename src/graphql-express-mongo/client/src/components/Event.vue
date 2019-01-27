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
      <md-button v-if="!isCreator" @click="$emit('view-etails')">View Details</md-button>
      <md-button @click="$emit('book')">Book</md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
export default {
  props: {
    isCreator: { type: Boolean, default: false },
    event: { type: Object, required: true }
  },
  filters: {
    truncate(value, length) {
      if (!value || value.length < length) {
        return value;
      }
      return `${value.substr(0, length)}...`;
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
