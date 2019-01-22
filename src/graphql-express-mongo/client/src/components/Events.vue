<template>
  <div class="app-events">
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

    <md-divider></md-divider>
    <md-subheader>{{title}}</md-subheader>
    <md-list>
      <md-list-item v-for="event in events" :key="event._id">
        <md-icon>move_to_inbox</md-icon>
        <span class="md-list-item-text">{{ event.title }}</span>
      </md-list-item>
    </md-list>  
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
      },
      events: []
    };
  },
  computed: {
    // binding a namespaced Vuex module is a bit verbose
    ...mapGetters({
      auth: "auth/isAuth"
    })
  },
  created() {
      this.getEvents();
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
          this.events.push({ ...event, _id });
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
    },

    getEvents() {
        const data = {
        query: `query {
            events {
                _id
                title
                description
                price            
                date   
                creator {
                    _id,
                    email
                }
            }
        }`
      };
      graphql(data)
        .then(res => res.data.events)
        .then(events => {
          bus.$emit("show-notification", { info: 'Fetched list with events' + events.length });
          this.events = events;
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
            info = 'Failed to fetch list with events';
            bus.$emit("show-notification", { info });
          }
        });
    }
  }
};
</script>

<style scoped>
.app-events {
    width: 100%;
}
</style>


