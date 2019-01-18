<template>
  <md-toolbar class="md-layout-item md-size-100 md-dense">
    <div class="md-toolbar-section-start">
      <h3 class="md-title">Event Booking</h3>
    </div>

    <router-link to="/events">
      <md-button>Events</md-button>
    </router-link>
    <router-link to="/bookings">
      <md-button>Bookings</md-button>
    </router-link>

    <div class="md-toolbar-section-end">
      <template v-if="auth">
        <md-button @click="$emit('handleLogout')" class="md-primary md-raised">Logout</md-button>
      </template>
      <template v-else>
        <md-button
          @click="dialogAuth.isRegister = true; dialogAuth.show = true;"
          class="md-primary md-raised"
        >Register</md-button>
        <md-button
          @click="dialogAuth.isRegister = false; dialogAuth.show = true;"
          class="md-primary md-raised"
        >Login</md-button>
      </template>
    </div>

    <app-dialog-auth
      v-model="dialogAuth.show"
      :isRegister="dialogAuth.isRegister"
      @action="$emit('handleAuth', $event)"
    ></app-dialog-auth>
  </md-toolbar>
</template>

<script>
import DialogAuth from "@/components/DialogAuth.vue";

export default {
  components: {
    "app-dialog-auth": DialogAuth,
  },
  props: {
      auth: {
          type: Boolean,
          required: true
      }
  },
  data() {
    return {
      dialogAuth: {
        show: false,
        isRgister: false
      }
    };
  },
}
</script>

