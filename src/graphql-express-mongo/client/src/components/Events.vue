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
    <div>
      <app-event
        v-for="event in events"
        :key="event._id"
        :event="event"
        @view-etails="handleViewDetailsEvent(event)"
        @book="handleBookEvent(event)"
      ></app-event>
    </div>
  </div>
</template>

<script>
import { mapGetters /*, mapMutations, mapActions */ } from "vuex";

import bus from "@/bus.js";
import graphql from "@/services/graphql.api.js";
import Event from "@/components/Event.vue";
import DialogEvent from "@/components/DialogEvent.vue";

export default {
  name: "app-events",
  components: {
    "app-dialog-event": DialogEvent,
    "app-event": Event
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
    handleViewDetailsEvent(event) {
      console.log("view-details", event);
    },
    handleBookEvent(event) {
      const data = {
        query: `mutation {
            createBooking(eventId: "${event._id}") {
                _id
            }
        }`
      };
      graphql(data)
        .then(res => res.data.bookEvent)
        .then(booking => {
          bus.$emit("show-notification", { info: "Booked event " + event._id });
        })
        .catch(this._showError);
    },
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
          bus.$emit("show-notification", {
            info: `Created new event ${title} (${_id})`
          });
          this.events.push({ ...event, _id });
        })
        .catch(this._showError);
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
          bus.$emit("show-notification", {
            info: "Fetched list with events: " + events.length
          });
          this.events = events;
        })
        .catch(this._showError);
    }
  },

  _showError(error) {
    console.error(error);
    const info = error.errors[0].message;
    bus.$emit("show-notification", { info });
  }
};
</script>

<style scoped>
.app-events {
  width: 100%;
}
</style>


