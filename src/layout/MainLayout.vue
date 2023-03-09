<template>
  <div class="h-100 ">
    <top-navbar></top-navbar>
    <router-view class="main-content" :class="{'bg-image-holder':$route.path=='/home' || '/profile' , 'landing':$route.path=='/'}" />
    <!-- <content-footer></content-footer>  -->
  </div>
</template>
<style lang="scss" scoped>


.main-content {
  padding-top: 130px;
  &.landing{
 padding-top: 66px;
  }
}
.bg-image-holder{
        position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
   /// height: 100%;
    width: 100%;
    background: url(/images/bg_dashboard.png);
      background-size: cover;
    position: absolute;
    background-color: #ebebeb;
    background-repeat: no-repeat;
    background-position: top right;
}


</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import { mapGetters } from "vuex";

//  import ContentFooter from './ContentFooter.vue'

export default {
  components: {
    TopNavbar,
    //   ContentFooter,
  },

  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    click() {
      this.$emit("switch");
    },
  },
};
</script>
