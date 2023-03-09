<template>
  <div class="stepper-box h-100">
    <div class="d-flex flex-column align-items-center progressbar-panel">
      <div class="progressbar">
        <div class="progressbar-header">
          <div class="progressbar-header-title">
            <!-- <span class="h4">{{'ST_SelectLearningItems' | translate}}</span> -->
          </div>
          <div class="progressbar-header-text">
            <span class="h6">{{ "LT_PleaseFollow" | translate }}</span>
          </div>
        </div>
        <ul>
          <li
            class="step"
            :style="{ width: `${100 / steps.length}%` }"
            v-for="(step, index) in steps"
            :class="{
              active: index <= stepIndex,
              current: index == stepIndex,
            }"
            :key="index"
          >
            <p class="h5">{{ step.title | translate }}</p>
            <div class="arrow-up"></div>
          </li>
        </ul>
      </div>
    </div>

    <div
      id="contentScrollbar"
      class="content"
      v-show="!loading && !innerLoading"
      :class="{ 'slide-right': slideRight, 'slide-left': !slideRight }"
    >
      <!--If keep alive-->
      <keep-alive>
        <component
          class="container-content-stepper"
          :is="steps[stepIndex].component"
          :data="steps[stepIndex].data"
          @onLoading="innerLoading = $event"
          @onChanged="onComponentChanged($event)"
        ></component>
      </keep-alive>
    </div>
    <div
      v-if="loading || innerLoading"
      class="content d-flex flex-row align-items-center justify-content-center h-100"
    >
      <b-spinner
        class="global-spinner"
        :variant="'primary'"
        type="grow"
      ></b-spinner>
    </div>
    <div class="action-panel">
      <slot name="footer" :commands="{ canNext, canBack, next, back }"></slot>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: {
    shownumber: {
      type: Boolean,
      default: false,
    },
    topButtons: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    steps: {
      type: Array,
      default: function () {
        return [
          {
            icon: "mail",
            name: "first",
            title: "Sample title 1",
            subtitle: "Subtitle sample",
            component: "",
          },
          {
            icon: "report_problem",
            name: "second",
            title: "Sample title 2",
            subtitle: "Subtitle sample",
            component: "",
          },
        ];
      },
    },
  },
  watch: {},

  data() {
    return {
      innerLoading: false,
      stepIndex: 0,
      currentStep: {},
      previousStep: {},
      nextButton: {},
      canContinue: false,
      finalStep: false,
      keepAliveData: this.keepAlive,
      isValidStep: {},
      slideRight: true,
    };
  },

  computed: {
    enterAnimation() {
      if (this.currentStep.index < this.previousStep.index) {
        return "animated quick fadeInLeft";
      } else {
        return "animated quick fadeInRight";
      }
    },
    leaveAnimation() {
      if (this.currentStep.index > this.previousStep.index) {
        return "animated quick fadeOutLeft";
      } else {
        return "animated quick fadeOutRight";
      }
    },
  },

  methods: {
    readyft(name) {
      this.$emit("readyft", name);
    },
    canBack() {
      console.log(this.stepIndex > 0);
      return this.stepIndex > 0;
    },
    canNext() {
      return (
        this.isValidStep[this.stepIndex] &&
        this.stepIndex < this.steps.length - 1
      );
    },
    next() {
      this.slideRight = true;
      this.$set(this, "stepIndex", this.stepIndex + 1);
      this.$emit("stepChanged", this.stepIndex);
    },
    back() {
      this.slideRight = false;
      this.$set(this, "stepIndex", this.stepIndex - 1);
      this.$emit("stepChanged", this.stepIndex);
    },

    init() {},

    onComponentChanged(e) {
      //this.isValidStep[this.stepIndex] = e.isValid;
      this.$set(this.isValidStep, this.stepIndex, e.isValid);
      //if(e.isValid){
      this.$emit("onChanged", e);
      //  }
    },
  },

  created() {
    this.init();
  },
  mounted() {
    // $("#contentScrollbar").mCustomScrollbar({
    //   axis: "y",
    //   theme: "inset-2-dark",
    //   autoHideScrollbar: true,
    //   //   scrollbarPosition: "outside",
    //   autoExpandScrollbar: true,
    //   autoDraggerLength: true,
    // });
  },
};
</script>


<style  lang="scss">
@import "@/theme/index.scss";

.stepper-box {
  display: flex;
  flex-direction: column;

  /* for Firefox */
  //min-height: 0;
  height: 100%;
  //overflow-x: hidden;

  .content {
    //overflow-x: hidden;

    //min-height: 0;
    overflow-x: hidden;
    height: 100%;
    background: white;
    // padding-top:20px;
    padding-left: 300px;
    padding-right: 300px;
    &.slide-right .container-content-stepper {
      animation: 0.3s ease-out slideRight;
    }
    &.slide-left .container-content-stepper {
      animation: 0.3s ease-out slideLeft;
    }

    #contentScrollbar {
      height: 100%;
    }
  }

  @keyframes slideRight {
    from {
      transform: translateX(calc(+100%));
    }
    to {
      transform: translateX(0);
    }
  }
  @keyframes slideLeft {
    from {
      transform: translateX(calc(-100%));
    }
    to {
      transform: translateX(0);
    }
  }

  .progressbar-panel {
    background-color: theme-color("bg-default");
    background-clip: border-box;
    position: relative;
    z-index: 1;
    width: 100%;
    padding: 0 1.25rem;

    // position: absolute;
    // z-index: 1;
    .progressbar {
      z-index: 2;
      width: 100%;
      padding-left: 300px;
      padding-right: 300px;
      padding-bottom: 20px;
      .progressbar-header {
        margin-bottom: 1rem;
        margin-top: 1rem;
      }

      ul {
        padding: 0 5px;
        margin-left: -8%;
        width: 116%;
        counter-reset: step;
        list-style-type: none;
        li.step {
          float: left;
          width: 20%;
          position: relative;
          text-align: center;
          &::before {
            content: counter(step);
            counter-increment: step;
            width: 50px;
            height: 50px;
            border: 2px solid #fff;
            display: block;
            margin: 0 auto 5px auto;
            border-radius: 50%;
            line-height: 45px;
            background: white;
            color: #212529;
            text-align: center;
            font-weight: bold;
          }
          &::after {
            content: "";
            position: absolute;
            width: 100%;
            height: 12px;
            background: #fff;
            top: 18px;
            left: -50%;
            z-index: -1;
          }
          &:first-child:after {
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
            left: 20%;
          }

          &:last-child:after {
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
            width: 130%;
          }

          &.active::after {
            background: theme-color("primary");
          }
          &.active::before {
            border-color: theme-color("primary");
            background: theme-color("primary");
            color: white;
          }

          &.current .arrow-up {
            width: 0;
            height: 0;
            border-left: 30px solid transparent;
            border-right: 30px solid transparent;
            border-bottom: 20px solid #fff;
            position: absolute;
            text-align: center;
            margin: auto;
            left: 0;
            right: 0;
          }
        }
      }
    }
  }
}
.action-panel {
  padding-left: 300px;
  padding-right: 300px;
  height: 40px;
}
</style>