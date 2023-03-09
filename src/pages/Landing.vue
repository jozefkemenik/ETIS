<template>
  <div class="landing-area" ref="scrollableContainer">
    <div class="container">
      <div class="banner">
        <div class="banner-text">
          <vue-typed-js
            v-if="showStatiTextOne"
            :strings="['Welcome to EASO\'s']"
            :loop="false"
            :typeSpeed="20"
            @onComplete="
              () => {
                showStatiTextOne = false;
              }
            "
          >
            <h1><span class="typing text-white"></span></h1>
          </vue-typed-js>
          <h1 v-else>
            <span class="typing text-white">Welcome to EASO's</span>
          </h1>

          <vue-typed-js
            v-show="!showStatiTextOne && !showStatiTextTwo"
            :startDelay="700"
            :strings="['Electronic Training Integration System']"
            @onComplete="
              () => {
                showStatiTextTwo = true;
              }
            "
            :typeSpeed="40"
          >
            <h2><span class="typing text-white"></span></h2>
          </vue-typed-js>
          <h2 v-if="showStatiTextTwo">
            <span class="typing text-white"
              >Electronic Training Integration System</span
            >
          </h2>
          <b-button size="lg" v-if="showStatiTextTwo" @click="login" variant="info" class="text-white mt-4">Login to ETIS</b-button
          >
        </div>
      </div>

      <section class="content"   >
        <div class="columns">
          <div class="sidebar-first">
            <img src="images/etis_screen.png" />
          </div>
          <div class="main">
            <h2>ETIS Philosophy</h2>
            <p>/** this is dummy text:
              We and our partners store and/or access information on a device,
              such as cookies and process personal data, such as unique
              identifiers and standard information sent by a device for
              personalised ads and content, ad and content measurement, and
              audience insights, as well as to develop and improve products.
            </p>
            <p>
              With your permission we and our partners may use precise
              geolocation data and identification through device scanning. You
              may click to consent to our and our partners’ processing as
              described above. Alternatively you may access more detailed
              information and change your preferences before consenting or to
              refuse consenting. Please note that some processing of your
              personal data may not require your consent, but you have a right
              to object to such processing. Your preferences will apply to this
              website only. You can change your preferences at any time by
              returning to this site or visit our privacy policy.**/
            </p>
          </div>

          <div class="sidebar-second"></div>
        </div>
      </section>

      <footer class="footer"><span>EASO - ETIS - 2020 - v2.1</span></footer>

      <!-- <div class="content">
        <div class="content-left">
          <img src="images/screen_transparent.png">
        </div>
        <div class="content-middle">
          <h2>ETIS Philosophy</h2>
          <p>We and our partners store and/or access information on a device, such as cookies and process personal data, such as unique identifiers and standard information sent by a device for personalised ads and content, ad and content measurement, and audience insights, as well as to develop and improve products.</p>
          <p>With your permission we and our partners may use precise geolocation data and identification through device scanning. You may click to consent to our and our partners’ processing as described above. Alternatively you may access more detailed information and change your preferences before consenting or to refuse consenting. Please note that some processing of your personal data may not require your consent, but you have a right to object to such processing. Your preferences will apply to this website only. You can change your preferences at any time by returning to this site or visit our privacy policy.</p>
        </div>
        <div class="content-right"></div>
      </div> -->
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import AuthSingeltonService from "@/auth/auth.singleton.service";
export default {
  data() {
    return { showStatiTextOne: true, showStatiTextTwo: false };
  },
  mounted() {
    var ref = this.$refs["scrollableContainer"];
    $(ref).mCustomScrollbar({
      axis: "y",
      theme: "inset-2-dark",
      autoHideScrollbar: true,
      scrollbarPosition: "inside",
      // autoExpandScrollbar: true,
      // autoDraggerLength: true,
    });
  },
   methods: {
    login() {
      AuthSingeltonService.login();
    },
 
  }
};
</script>
<style lang="scss">



.landing-area {
  position: relative;
  min-height: 100vh;


  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
.mCSB_container{
  width:100%;
}

  .container {
    max-width: 100%;
    width: 100%;
    height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0;

    .banner {
      background-size: cover;
      background-image: url(/images/banner.png);
      width: 100%;
      min-height: 424px;
      filter: alpha(opacity=0);
      transition: opacity 0.3s ease-out;
      background-repeat: no-repeat;
      border-top: 6px solid darken(#0b4280, 5%);
      border-bottom: 6px solid rgb(93, 158, 6);
    }
    .banner-text {
      position: absolute;
      top: 180px;
      left: 400px;
      .typed-cursor {
        color: #fff;
      }
    }

    .content {
    
      display: flex;
      flex: 1;

      .columns {
        display: flex;
        flex: 1;
      }
      .main {
        flex: 1;
        order: 2;
        margin: 40px 40px 0 40px;
      }
      .sidebar-first {
        margin-top: 40px;
        margin-left: 180px;
        width: 500px;

        order: 1;

        img {
          width: 100%;
        }
      }
      .sidebar-second {
        width: 15%;
        order: 3;
        background-image: url(/images/circles.png);
        transition: opacity 0.3s ease-out;
        background-repeat: no-repeat;

        background-size: 100% auto;
      }
    }
    .footer {
      border-top: 6px solid rgb(93, 158, 6);
      background-color: #0b4280;
      color: #fff;
      padding: 6px 0 6px 6px;
      text-align: left ;
      font-size: 0.8rem;
    }
  }
}

.home-area {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  position: absolute;
  border-radius: inherit;
}



.center-vertically-holder {
  display: table;
  height: 100%;
}

.center-vertically {
  display: table-cell;
  vertical-align: middle;
  height: 100%;
}
</style>