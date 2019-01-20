<template>
  <div>
    <h1>{{title}}</h1>
    <md-button
      @click="dialogEvent.isCreate = true; dialogEvent.show = true;"
      class="md-primary md-raised"
    >Create event</md-button>
    <app-dialog-event
      v-model="dialogEvent.show"
      :isCreate="dialogEvent.isCreate"
      @action="$emit('handleCreateEvent', $event)"
    ></app-dialog-event>
  </div>
</template>

<script>
import DialogEvent from "@/components/DialogEvent.vue";

export default {
  name: "app-events",
  components: {
    "app-dialog-event": DialogEvent
  },
  data() {
    return {
      title: "Events",
      dialogEvent: {
        show: false,
        isCreate: true
      }
    };
  },
  methods: {
    handleCreateEvent(event) {
      // TODO:
      console.log("Created", event);
    }
  }
};
</script>

