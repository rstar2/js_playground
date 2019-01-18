<template>
  <div id="app" class="md-layout">
    <app-main-navbar :auth="auth" @handleAuth="handleAuth" @handleLogout="handleLogout"></app-main-navbar>

    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <router-view></router-view>

    <app-notifications v-model="info"></app-notifications>
  </div>
</template>

<script>
import MainNavbar from "@/components/MainNavbar.vue";
import Notifications from "@/components/Notifications.vue";

import { mapGetters /*, mapMutations, mapActions */ } from "vuex";

import api from "@/services/api.js";

export default {
  name: "app",
  components: {
    "app-main-navbar": MainNavbar,
    "app-notifications": Notifications
  },
  data() {
    return {
      info: null
    };
  },
  computed: {
    // binding a namespaced Vuex module is a bit verbose
    ...mapGetters({
      auth: "auth/isAuth"
    })
  },
  methods: {
    handleLogout() {
      this.$store.commit("auth/logout");
    },

    handleAuth(user) {
      // TODO: pass isRegister explicitly, 'name' can be removed
      const isRegister = user.name; // we pass the name only when creating a user
      const data = {
        query: isRegister
          ? `
        mutation {
            registerUser(email: "${user.email}", password: "${user.password}") {
                userId
                jwt
            }
        }
        `
          : `
        query {
            loginUser(email: "${user.email}", password: "${user.password}") {
                userId
                jwt
            }
        }
        `
      };

      api("http://localhost:5000/graphql", data)
        .then(res => res.data[isRegister ? "registerUser" : "loginUser"])
        .then(res => {
          this.info = `You are now logged in as ${user.email} (${res.userId})`;

          this.$store.commit("auth/login", { authJWT: res.jwt });
        })
        .catch(error => {
          console.error(error);

          // GraphQL returns errors like this:
          // {
          //     "errors": [ { "message": "asdasd", ....}],
          //     "data": {}
          // }
          if (error.errors && error.errors.length) {
            // show specific error cause
            this.info = error.errors[0].message;
          } else {
            // show general error
            this.info = `Failed to ${isRegister ? "register" : "login"} as ${
              user.email
            }`;
          }
        });
    }
  }
};
</script>

<style>
@import "./styles.css";
</style>
