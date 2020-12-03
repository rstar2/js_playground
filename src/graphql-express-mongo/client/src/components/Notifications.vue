<template>
  <!-- :md-active.sync needs a boolean prop -->
  <md-snackbar :md-active.sync="active" md-position="center" :md-duration="3000" md-persistent>
    <span>{{info}}</span>
    <md-button class="md-accent" @click="active = false">Dismiss</md-button>
  </md-snackbar>
</template>

<script>
export default {
  props: {
    info: String
  },
  // Since Vue 2.2.0+ https://vuejs.org/v2/guide/components-custom-events.html
  // By default, v-model on a component uses 'value' as the prop and 'input' as the event,
  // but some input types such as checkboxes and radio buttons may want to use the 'value'
  // attribute for a different purpose. Using the model option can avoid a conflict in such cases:
  // Note that you still have to declare the custom prop (in this case named 'info') in component’s props option.
  model: {
    prop: "info",
    event: "change"
  },
  
  computed: {
    // we need a getter AND a setter as 'active' is set when using :md-active.sync="active", to auto close it
    active: {
      // getter
      get: function() {
        return !!this.info;
      },
      // setter
      set: function(newValue) {
        if (!newValue) {
          this.$emit("change", null);
        }
      }
    }
  }
};
</script>
