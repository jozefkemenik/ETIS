<template>
   <div  class="d-flex flex-column w-100 h-100">
    <MainLayout v-if="isReady && !isUserBusy"  />  
    <div v-else class="d-flex flex-row align-items-center justify-content-center h-100">
      <b-spinner class="global-spinner" :variant="'primary'" type="grow"></b-spinner>
    </div>
  </div>
</template>

<script>
import MainLayout from './layout/MainLayout.vue';
import { mapGetters } from "vuex";
export default {
  name: 'App',
   components: {
     MainLayout
    },
   created: function() {
    // to see spinner animation
   this.$store.dispatch("ConfLoad");
    
  },
   computed: {
    ...mapGetters(["isReady", "isUserBusy"]),
  }

}
</script>

<style lang="scss">

body{
    background: linear-gradient(to bottom, #ffffff 0%, #dedede 100%);
}

$theme-colors: (
  "primary": #0B4280,
  "danger": #ff4136,
  "success":#85C780,
  "info":#85C780,
  "custom-color": #900,
  "bg-default":#ECECEC,
  "bg-default-border":darken(#ECECEC, 10%),
  "bg-header":lighten(#0B4280, 50%)
);

@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';

</style>
