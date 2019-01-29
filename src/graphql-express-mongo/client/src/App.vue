<template>
  <div id="app" class="md-layoutX">
    <app-main-navbar :auth="auth" @handleAuth="handleAuth" @handleLogout="handleLogout"></app-main-navbar>

    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <router-view></router-view>

    <app-notifications v-model="info"></app-notifications>
  </div>
</template>

<script>
import { mapGetters /*, mapMutations, mapActions */ } from "vuex";

import bus from "@/bus.js";
import MainNavbar from "@/components/MainNavbar.vue";
import Notifications from "@/components/Notifications.vue";
import graphql from "@/services/graphql.api.js";

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
  created() {
    bus.$on("show-notification", this.showNotification);

    bus.$on("show-error-graphql", error => {
      // This is assumed to be a GraphQL API response error
      // GraphQL returns errors like this:
      // {
      //     "errors": [ { "message": "asdasd", ....}],
      //     "data": {}
      // }

      console.error(error);
      const info = error.errors[0].message;
      // this or the other line
      // bus.$emit("show-notification", { info });
      this.showNotification({ info });
    });
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
                jwt
            }
        }
        `
          : `
        query {
            loginUser(email: "${user.email}", password: "${user.password}") {
                jwt
            }
        }
        `
      };

      graphql(data)
        .then(res => res.data[isRegister ? "registerUser" : "loginUser"])
        .then(res => {
          bus.$emit("show-notification", {
            info: `You are now logged in as ${user.email} (${res.userId})`
          });

          this.$store.commit("auth/login", { JWT: res.jwt });
        })
        .catch(error => {
          bus.$emit("show-error-graphql", error);
        });
    },

    showNotification({ info }) {
      this.info = info;
    }
  }
};
</script>

<style>
@import "./styles.css";
</style>
