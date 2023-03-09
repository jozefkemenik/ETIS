<template>
  <div class="container">
    <core-info-panel class="my-3">
      <template v-slot:content>
        <div v-html="infoPanelText" ref="infocontent-one" />
      </template>
    </core-info-panel>
    <core-stepper-vertical :items="vitems">
      <template v-slot="{ item }">
        <!-- Main Details-->
        <div v-if="item.step == 1" class="v-step-content">
          <session-new-step-three-participants :data="data" :role="studentRole"
          />
        </div>
        <div v-if="item.step == 2" class="v-step-content">
          <session-new-step-three-participants :data="data" :role="trainerRole" />
        </div>
      </template>
    </core-stepper-vertical>
  </div>
</template>
<script>
//import Trainers from "./Trainers";
import //required
//email,
// minLength,
// requiredIf,
//  helpers
"vuelidate/lib/validators";
import { mapGetters } from "vuex";
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {},

  data() {
    return {
      studentRole: null,
      trainerRole: null,
      filelist: [],
      vitems: [{ step: 1 }, { step: 2 }],
    };
  },

  computed: {
    ...mapGetters(["dictionary"]),
    infoPanelText() {
      return this.$options.filters.translate("LG_InfoPanelNewSessionStepThree");
    },
    noSelectText() {
      return "-";
    },
    text() {
      return '<p class="bold"><b>Instruction for user upload</b></p><p>To be able to upload the users, please download <b>CSV template</b> file by <a href="#" @click="onLinkClick">clicking here</a><br><p><b>Please fill the Mandatory fields: Name, Surname, Email, and Surname</b></p>';
    },
  },
  mounted() {
    this.$refs["infocontent-one"]
      .getElementsByTagName("a")[0]
      .addEventListener("click", () => {
        this.onLinkClick();
      });
  },

  methods: {
    onLinkClick() {
      alert("ahoj");
    },
  },
  created() {
    this.studentRole = this.dictionary.participantRoles.find(
      (r) => r.name == "Student"
    );
    this.trainerRole = this.dictionary.participantRoles.find(
      (r) => r.name == "Trainer"
    );
  },
};
</script>
<style lang="scss" scoped>
.v-step-content {
  width: 100%;
}
.v-step-content label {
  margin-bottom: 0px;
}
</style>