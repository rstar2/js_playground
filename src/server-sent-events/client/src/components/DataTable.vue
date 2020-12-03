<template>
  <div>
    <h3 v-if="!data.length">Loading data</h3>
    <v2-table v-else :data="data">
      <v2-table-column label="Origin" prop="origin"></v2-table-column>
      <v2-table-column label="Flight" prop="flight"></v2-table-column>
      <v2-table-column label="Arrival" prop="arrival"></v2-table-column>
      <v2-table-column label="State" prop="state"></v2-table-column>
    </v2-table>
  </div>
</template>

<script>

// import a EventSource polifill for browser that don't support it (IE 11 and IE Edge)
// The polyfill will define an EventSource constructor only if it is not natively supported
// and our code will continue to work as before also on browsers that don't support it.
import 'eventsource-polyfill';

import Vue from "vue";

import "beautify-scrollbar/dist/index.css";
import "v2-table/dist/index.css";
import V2Table from "v2-table";

Vue.use(V2Table);

export default {
  components: {},
  data() {
    return {
      data: []
    };
  },
  created() {
    setTimeout(() => {
      this.data = [
        {
          origin: "London",
          flight: "A123",
          arrival: "08:15",
          state: ""
        },
        {
          origin: "Berlin",
          flight: "D654",
          arrival: "08:45",
          state: ""
        },
        {
          origin: "New York",
          flight: "U213",
          arrival: "09:05",
          state: ""
        },
        {
          origin: "Buenos Aires",
          flight: "A987",
          arrival: "09:30",
          state: ""
        },
        {
          origin: "Rome",
          flight: "I768",
          arrival: "10:10",
          state: ""
        },
        {
          origin: "Tokyo",
          flight: "G119",
          arrival: "10:35",
          state: ""
        }
      ];
    }, 1000);

    // the SSE source
    //this.eventSource = new EventSource("events"); // absolute URL to the same  "current-server-domain" -> "current-server-domain/events" endpoint
    this.eventSource = new EventSource("http://localhost:5000/events"); // absolute URL globally speficified

    // single/global message listener
    // this.eventSource.onmessage = e => {
    //   this.updateFlight(JSON.parse(e.data));
    // };

    // specific event types (depends on the 'type' field in the SSE JSON from the server)
    this.eventSource.addEventListener("flightUpdate", e =>
      this.updateFlight(JSON.parse(e.data))
    );
    this.eventSource.addEventListener("flightRemove", e =>
      this.removeFlight(JSON.parse(e.data))
    );
    this.eventSource.addEventListener("closedConnection", () =>
      this.stopUpdates()
    );
  },
  beforeUnmount() {
    this.stopUpdates();
  },
  methods: {
    updateFlight(aFlightState) {
      // change data in place - e.g. mutate
      this.data.forEach(item => {
        if (item.flight === aFlightState.flight) {
          item.state = aFlightState.state;
        }
      });
    },

    removeFlight(aFlightState) {
      this.data = this.data.filter(item => {
        return item.flight !== aFlightState.flight;
      });
    },

    stopUpdates() {
      this.eventSource.close();
    }
  }
};
</script>

<style scoped>
.v2-table {
  /* height: 200px; */
}
</style>

