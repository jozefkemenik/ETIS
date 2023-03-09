<template>
  <div class="container">
    <core-stepper-vertical :items="controlsSteps">
      <template v-slot="{ item }">
        <!-- Main Details-->
        <div v-if="item.step == 1" class="v-step-content">
          <span class="h5 title">{{ "ST_CourseDetails" | translate }}</span>
          <core-dynamic-control-main
            :controls="item.items"
            @onChanged="onChanged($event)"
          />
        </div>
        <div v-if="item.step == 2" class="v-step-content">
          <div class="h5 title">{{ "ST_Dates" | translate }}</div>
          <core-dynamic-control-main
            :controls="item.items"
            @onChanged="onChanged($event)"
          />
        </div>
        <div v-if="item.step == 3" class="v-step-content">
          <div class="h5 title">{{ "ST_SessionContent" | translate }}</div>
          <core-dynamic-control-main
            :controls="item.items"
            @onChanged="onChanged($event)"
          />
        </div>
      </template>
    </core-stepper-vertical>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import AuthSingeltonService from "@/auth/auth.singleton.service";
import {
  required,
  //email,
  // minLength,
  // requiredIf,
  //  helpers
} from "vuelidate/lib/validators";
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
      controlsSteps: [],
    };
  },

  computed: {
    ...mapGetters(["dictionary", "isNCP"]),
    noSelectText() {
      return "-";
    },
  },

  methods: {
    generateNames() {
      console.log("step two", this.data);
      if (this.data && this.data.masterCourseId) {
        this.setLoading(true);
        setTimeout(() => {
          AuthSingeltonService.httpGet(
            "session/generate",
            {
              masterCourseId: this.data.masterCourseId,
              organiser: this.data.organiser,
              type: this.data.type,
            },
            true
          )
            .then((r) => {
              this.getControlfromControSteps(this.controlsSteps, "name").value =
                r.body.name;
              this.getControlfromControSteps(
                this.controlsSteps,
                "shortName"
              ).value = r.body.shortName;
              this.getControlfromControSteps(this.controlsSteps, "code").value =
                r.body.code;

              this.onChanged();
            })
            .finally(() => {
              this.setLoading(false);
            });
        }, 500);
      }
    },
    setLoading(is) {
      this.$set(
        this.getControlfromControSteps(this.controlsSteps, "name"),
        "loading",
        is
      );
      this.$set(
        this.getControlfromControSteps(this.controlsSteps, "shortName"),
        "loading",
        is
      );
      this.$set(
        this.getControlfromControSteps(this.controlsSteps, "code"),
        "loading",
        is
      );
    },
    onChanged() {
      this.$emit("onChanged", {
        isValid: this.checkValidation(),
        payload: this.makePayeLoad(),
      });
    },
    makePayeLoad() {
      return this.controlsSteps;
    },
    checkValidation() {
      var isValid = true;
      this.controlsSteps.forEach((r) => {
        r.items.forEach((r1) => {
          if (!r1.$v) {
            console.log("r1.$v", r1.$v);
          }
          r1.$v.$touch();
          isValid = isValid && !r1.$v.$invalid;
        });
      });
      return isValid;
    },
  },
  created() {
    var ncp = [
      {
        step: 1,
        items: [
          {
            type: "dd",
            id: "type",
            value: this.dictionary.sessionType
              .MapToDDControl()
              .find((f) => f.name == "N-TS"),
            label: "ST_SelectCourseType",
            items: this.dictionary.sessionType.MapToDDControl().slice(7, 10),
            default: null,
            validation: {
              required,
            },
          },
        ],
      },
      {
        step: 2,
        items: [
          {
            type: "calr",
            id: "onlineStartDate|onlineEndDate",
            value: { onlineStartDate: null, onlineEndDate: null },
            iso: { onlineStartDate: null, onlineEndDate: null },
            label: "ST_OnlineDate",
            default: null,
            validation: {
              required,
            },
          },

          {
            type: "calr",
            id: "faceStartDate|faceEndDate",
            value: { faceStartDate: null, faceEndDate: null },
            iso: { faceStartDate: null, faceEndDate: null },
            label: "ST_FaceDate",
            default: null,
            validation: {
              required,
            },
          },
        ],
      },
      {
        step: 3,
        items: [
          {
            type: "text",
            id: "name",
            value: null,
            label: "ST_NewName",
            default: null,
            validation: {
              required,
            },
            btnLabel: "ST_Generate",
            btnCallback: () => {
              this.generateNames();
            },
          },
          {
            type: "text",
            id: "shortName",
            value: null,
            label: "ST_NewShortName",
            items: [],
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "text",
            id: "code",
            value: null,
            label: "ST_SourceCode",
            items: [],
            default: null,
            validation: {
              required,
            },
          },
        ],
      },
    ];

    var noNcp = [
      {
        step: 1,
        items: [
          {
            type: "calr",
            id: "onlineStartDate|onlineEndDate",
            value: { onlineStartDate: null, onlineEndDate: null },
            iso: { onlineStartDate: null, onlineEndDate: null },
            label: "ST_OnlineDate",
            default: null,
            validation: {
              required,
            },
          },

          {
            type: "calr",
            id: "faceStartDate|faceEndDate",
            value: { faceStartDate: null, faceEndDate: null },
            iso: { faceStartDate: null, faceEndDate: null },
            label: "ST_FaceDate",
            default: null,
            validation: {
              required,
            },
          },
        ],
      },
      {
        step: 2,
        items: [
          {
            type: "text",
            id: "name",
            value: null,
            label: "ST_NewName",
            default: null,
            validation: {
              required,
            },
            btnLabel: "ST_Generate",
            btnCallback: () => {
              this.generateNames();
            },
          },
          {
            type: "text",
            id: "shortName",
            value: null,
            label: "ST_NewShortName",
            items: [],
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "text",
            id: "code",
            value: null,
            label: "ST_SourceCode",
            items: [],
            default: null,
            validation: {
              required,
            },
          },
        ],
      },
    ];

    if (this.isNCP) {
      this.controlsSteps = ncp;
    } else {
      this.controlsSteps = noNcp;
    }

    if (this.data && Object.keys(this.data).length > 0) {
      this.initStepValues(this.controlsSteps, this.data);
    }
  },
  mounted() {
    if (this.data && Object.keys(this.data).length > 0) {
      this.$emit("onChanged", {
        isValid: this.checkValidation(),
        payload: this.makePayeLoad(),
      });
    }
  },
};
</script>
<style lang="scss" scoped>
</style>