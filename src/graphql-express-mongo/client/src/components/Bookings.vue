<template>
  <div class="app-bookings">
    <md-subheader>{{title}}</md-subheader>
    <md-list class="md-triple-line">
      <md-list-item v-for="booking in bookings" :key="booking._id">
        <span class="md-list-item-text">{{booking.event.title}}</span>
        <md-button class="md-list-action" @click="handleCancelBooking(booking)">
          <md-icon class="md-accent">cancel</md-icon>
        </md-button>
      </md-list-item>
      <!-- TODO: add the devider - skip the last item -->
      <!-- <md-divider class="md-inset"></md-divider> -->
    </md-list>
  </div>
</template>

<script>
import bus from "@/bus.js";
import graphql from "@/services/graphql.api.js";

export default {
  name: "app-bookings",
  data() {
    return {
      title: "Bookings",
      bookings: []
    };
  },
  created() {
    this.getBookings();
  },
  methods: {
    handleCancelBooking(booking) {
      const data = {
        query: `mutation {
            cancelBooking(bookingId: "${booking._id}") {
                _id
            }
        }`
      };
      graphql(data)
        .then(res => res.data.cancelBooking)
        .then(event => {
          bus.$emit("show-notification", {
            info: "Canceled booked event " + event._id
          });

          this.bookings = this.bookings.filter(item => item._id !== booking._id);
        })
        .catch(this._showError);
    },

    getBookings() {
      const data = {
        query: `query {
            bookings {
                _id
                createdAt
                event {
                    title
                    description
                    price            
                    date   
                }
                
            }
        }`
      };
      graphql(data)
        .then(res => res.data.bookings)
        .then(bookings => {
          bus.$emit("show-notification", {
            info: "Fetched list with bookings: " + bookings.length
          });
          this.bookings = bookings;
        })
        .catch(this._showError);
    },

    _showError(error) {
      console.error(error);
      const info = error.errors[0].message;
      bus.$emit("show-notification", { info });
    }
  }
};
</script>

<style scoped>
.app-bookings {
  width: 320px;
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  border: 1px solid rgba(#000, 0.12);
}
</style>


