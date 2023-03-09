<template>
  <header class="top-header">
    <b-navbar class="top-nav-bar-fixed" :class="{ landing: !isAuthenticated }">
      <b-navbar-brand href="#">
        <img class="logo" src="@/assets/logo.png" />
        <img class="logo-name" src="/images/logo_name.png" />
      </b-navbar-brand>

      <!-- <span class="logo-name text-primary">ETIS</span> -->

      <b-navbar-nav class="ml-auto">
        <div v-if="isAuthenticated" class="d-flex flex-row align-items-center">
          <b-icon
            icon="person-fill"
            font-scale="1.5"
            class="text-primary"
          ></b-icon>
          <b-nav-text class="mx-2">
            {{ "ST_LoggedInAs" | translate }}
            <span class="text-primary ml-2">{{ user.info.name }}</span>
          </b-nav-text>
          <div class="nav-divider" />
          <b-nav-item @click="logout">
            <span class="text-primary">Logout</span>
          </b-nav-item>
          <div class="nav-divider" />
        </div>
            <b-button v-else size="sm"  @click="login" variant="info" >Login <b-icon icon="box-arrow-in-right"/></b-button> 
      </b-navbar-nav>
    </b-navbar>
    <b-navbar
      v-if="isAuthenticated"
      toggleable="lg"
      type="dark"
      variant="primary"
      class="top-nav-bar-menu"
    >
      <b-navbar-nav class="portal-nav">
        <b-nav-item v-bind:active="$route.path == '/home'" to="/home">{{
          "ST_Home" | translate
        }}</b-nav-item>
        <b-nav-item
          v-bind:active="$route.path == '/newsession'"
          to="/newsession"
          >{{ "ST_RequestNewTrainigSession" | translate }}</b-nav-item
        >
        <b-nav-item v-bind:active="$route.path == '/sessions'" to="/sessions">{{
          "Sessions"
        }}</b-nav-item>

          <b-nav-item v-bind:active="$route.path == '/participants'" to="/participants">{{
          "Participants"
        }}</b-nav-item>
        <!-- <b-nav-item v-bind:active="$route.path=='/draftsession'" to="/draftsession">{{'ST_DraftSessions' | translate}}</b-nav-item> -->
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown text="Lang" right >
          <template slot="button-content">
            <i class="fas fa-user text-light"></i> {{ "ST_User" | translate }}
          </template>
          <b-dropdown-item
            
            to="/profile"
            >Profile</b-dropdown-item
          >
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
  </header>
</template>
<script>
import AuthSingeltonService from "@/auth/auth.singleton.service";

import { mapGetters } from "vuex";
export default {
  methods: {
    click() {
      this.$emit("switch");
    },
    logout() {
      AuthSingeltonService.logout();
    },
    login() {
      AuthSingeltonService.login();
    },
  },
  computed: {
    ...mapGetters([
      "languages",
      "user",
      "isAuthenticated",
      "approved",
      "isEditFt",
      "isAdmin",
      "isNCP",
    ]),
    langKeys() {
      return Object.keys(this.languages);
    },
    isDebug() {
      return process.env.NODE_ENV !== "production";
    },
  },
};
</script>

<style lang="scss">
@import "@/theme/index.scss";
.top-nav-bar-fixed .navbar-nav {
  z-index: 2000;
}

.landing.top-nav-bar-fixed:after {
  content: "";
  /* margin-left: 100px; */
  background-color: theme-color("primary");
  position: absolute;
  /* width: 0; */
  /* height: 0; */
  left: 250px;
  right: 0;
  border-top: 33px solid transparent;
  border-left: 32px solid white;
  border-bottom: 32px solid transparent;
  /* margin: -10px 0px 0 0px; */
  z-index: 1;
  top: 0;
}

.top-header {
  width: 100%;
  z-index: 600;
  position: fixed;
  top: 0;
}

.top-nav-bar-fixed {
  min-height: 65px;
  background-color: #fff;
}
.top-nav-bar-menu {
  min-height: 65px;
}
img.logo {
  width: 90px;
  position: absolute;

  z-index: 600;
  top: 0;
}
.logo-name {
  margin-left: 110px;
}

.nav-divider {
  border-right: 2px solid #f3f3f3;
  height: 30px;
  margin: 0 0.5em 0 0;
  &:after {
    content: "";
    margin: 0 0 0 0.5em;
  }
}

.landing .lang-selector button {
  color: white !important;
}

.portal-nav {
  margin-left: 140px;
  // margin-right:auto;
}
</style>



