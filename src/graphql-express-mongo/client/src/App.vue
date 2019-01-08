<template>
  <div id="app" class="md-layout">
    <app-main-navbar :auth="auth"></app-main-navbar>

    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <router-view></router-view>

    <app-notifications v-model="info"></app-notifications>
  </div>
</template>

<script>
import MainNavbar from "@/components/MainNavbar.vue";
import Notifications from "@/components/Notifications.vue";

export default {
  name: "app",
  components: {
    "app-main-navbar": MainNavbar,
    "app-notifications": Notifications
  },
  data() {
    return {
      authJWT: null
    };
  },
  computed: {
    auth() {
      return !!this.authJWT;
    }
  },
  mounted() {
    // restore it from cookie/localStorage
    // It's not adviceable to store it in localStorage/sessionStorage
    // as thus it's vulnerable to XSS (injected or unintentionaly added by outself with 3rd-party library script -npm, bower, CDN)
    // It's better to be stored in HttpOnly Cookie and added a CSRF token in a header (X-XSRF-TOKEN)
    // From AngularJS https://docs.angularjs.org/api/ng/service/$http#cross-site-request-forgery-xsrf-protection
    // Cross Site Request Forgery (XSRF) Protection:
    // XSRF is an attack technique by which the attacker can trick an authenticated user into unknowingly executing actions on your website. AngularJS provides a mechanism to counter XSRF. When performing XHR requests, the $http service reads a token from a cookie (by default, XSRF-TOKEN) and sets it as an HTTP header (by default X-XSRF-TOKEN). Since only JavaScript that runs on your domain could read the cookie, your server can be assured that the XHR came from JavaScript running on your domain.
    // To take advantage of this, your server needs to set a token in a JavaScript readable session cookie called XSRF-TOKEN on the first HTTP GET request. On subsequent XHR requests the server can verify that the cookie matches the X-XSRF-TOKEN HTTP header, and therefore be sure that only JavaScript running on your domain could have sent the request. The token must be unique for each user and must be verifiable by the server (to prevent the JavaScript from making up its own tokens). We recommend that the token is a digest of your site's authentication cookie with a salt for added security.
    // The header will — by default — not be set for cross-domain requests. This prevents unauthorized servers (e.g. malicious or compromised 3rd-party APIs) from gaining access to your users' XSRF tokens and exposing them to Cross Site Request Forgery. If you want to, you can whitelist additional origins to also receive the XSRF token, by adding them to xsrfWhitelistedOrigins. This might be useful, for example, if your application, served from example.com, needs to access your API at api.example.com. See $httpProvider.xsrfWhitelistedOrigins for more details.

    //https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage
    this.authJWT = localStorage.getItem("authJWT");
  },
  watch: {
    authJWT(newValue) {
      // store it in cookie/localStorage (see the notes about it in mounted())
      if (newValue) localStorage.setItem("authJWT", newValue);
      else localStorage.removeItem("authJWT");
    }
  }
};
</script>

<style>
@import "./styles.css";
</style>
