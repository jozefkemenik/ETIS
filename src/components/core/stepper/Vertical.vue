<template>
  <div class="stepper-container">
    <div
      class="v-step"
      v-for="item in items"
      :key="item.id"
      @click="clickItem(item)"
      :class="{ active: item.active, completed: item.completed }"
      v-b-tooltip.hover
      :title="item.name"
    >
      <div class="v-stepper">
        <div class="circle"></div>
        <div class="line"></div>
      </div>
      <div class="v-content">
        <slot name="default" :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  watch: {},

  data() {
    return {};
  },

  computed: {},

  methods: {
    clickItem(item) {
      item;
    },
  },
};
</script>


<style  lang="scss">
@import "@/theme/index.scss";

.stepper-container {
  width: 100%;
   counter-reset: step;
}

.v-step {
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.v-content {
  margin-top:-1px;
  width:100%;
}

.v-stepper {
  position: relative;
  padding-right:20px;
  /*   visibility: visible; */
}

/* regular step */
.v-step .circle {
  background-color: white;
  border: 3px solid rgb(6, 150, 215);
  border-radius: 100%;
  width: 23px; /* +6 for border */
  height: 23px;
  display: inline-block;
 
  &:after{
     content: counter(step);
            counter-increment: step;
    position: absolute;
    top: 0;
    left: 7px;
    color: rgb(6, 150, 215);
    font-size: 14px;
    font-weight: bold;
  }
}

.v-step .line {
  top: 20px;
  left: 9.5px;
  /*   height: 120px; */
  height: 100%;

  position: absolute;
  border-left: 3px solid rgb(6, 150, 215)
}

.v-step.completed .circle {
  visibility: visible;
  background-color: rgb(6, 150, 215);
  border-color: rgb(6, 150, 215);
}

.v-step.completed .line {
  border-left: 3px solid rgb(6, 150, 215);
}

.v-step.active .circle {
  visibility: visible;
  border-color: rgb(6, 150, 215);
}

.v-step.empty .circle {
  visibility: hidden;
}

.step.empty .line {
  /*     visibility: hidden; */
  /*   height: 150%; */
  top: 0;
  height: 150%;
}

.v-step:last-child .line {
  border-left: 3px solid rgb(6, 150, 215);
  height: 86%;
  //border-left: 3px solid white;

}
</style>