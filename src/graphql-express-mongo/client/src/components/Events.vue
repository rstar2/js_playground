<template>
  <div>
    <h1>{{title}}</h1>
    <template v-if="auth">
      <md-button
        @click="dialogEvent.isCreate = true; dialogEvent.show = true;"
        class="md-primary md-raised"
      >Create event</md-button>
      <app-dialog-event
        v-model="dialogEvent.show"
        :isCreate="dialogEvent.isCreate"
        @action="handleCreateEvent"
      ></app-dialog-event>
    </template>
  </div>
</template>

<script>
import { mapGetters /*, mapMutations, mapActions */ } from "vuex";

import bus from "@/bus.js";
import graphql from "@/services/graphql.api.js";
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
  computed: {
    // binding a namespaced Vuex module is a bit verbose
    ...mapGetters({
      auth: "auth/isAuth"
    })
  },
  methods: {
    handleCreateEvent(event) {
      const { title, description, price, date } = event;
      const data = {
        query: `mutation {
            createEvent(input: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                _id
            }
        }`
      };
      graphql(data)
        .then(res => res.data.createEvent)
        .then(({ _id }) => {
          bus.$emit("show-notification", { info: `Created new event ${title} (${_id})` });
        })
        .catch(error => {
          console.error(error);

          // GraphQL returns errors like this:
          // {
          //     "errors": [ { "message": "asdasd", ....}],
          //     "data": {}
          // }
          let info;
          if (error.errors && error.errors.length) {
            // show specific error cause
            info = error.errors[0].message;
          } else {
            // show general error
            info = "Failed to create new event";
            bus.$emit("show-notification", { info });
          }
        });
    }
  }
};
</script>

