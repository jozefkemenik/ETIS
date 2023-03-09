<template>
  <form @submit.prevent="submit" ref="reg-form" class="w-100">
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
            <div class="h5 title">{{ "ST_SessionDelivery" | translate }}</div>
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
  </form>
</template>


  


<script>
import AuthSingeltonService from "@/auth/auth.singleton.service";
import { mapGetters } from "vuex";
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
        return null;
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
    clickItem(item) {
      item;
    },

    onChanged(e) {
      this.applyRules(e);
      this.$emit("onChanged", {
        isValid: this.checkValidation(),
        payload: this.makePayeLoad(),
      });
    },
    makePayeLoad() {
      return this.controlsSteps;
    },
    applyRules(e, setValues = false) {
      // populate subtype
      if (e.id == "type") {
        var subType = this.getControlfromControSteps(
          this.controlsSteps,
          "subType"
        );
        subType.items = this.dictionary.sessionSubTypes
          .filter((f) => e.value && f.typeId == e.value.value)
          .MapToDDControl();
        if (setValues) {
          subType.value = subType.items.find(
            (f) => f.value == this.data["subType"]);
        } else {
          subType.value = null;
        }
      }
      if (e.id == "language") {
        var masterCourse = this.getControlfromControSteps(
          this.controlsSteps,
          "masterCourseId"
        );
        masterCourse.items = this.dictionary.masterCourses
          .filter((f) => e.value && f.language == e.value.value)
          .MapToDDControl();
        if (setValues) {
          masterCourse.value = masterCourse.items.find(
            (f) => f.value == this.data["masterCourseId"]);
        } else {
          masterCourse.value = null;
        }
      }
    },
    checkValidation() {
      var isValid = true;
      this.controlsSteps.forEach((r) => {
        r.items.forEach((r1) => {
          r1.$v.$touch();
          isValid = isValid && !r1.$v.$invalid;
        });
      });
      return isValid;
    },
  },

  mounted() {
    if (this.data && Object.keys(this.data).length > 0) {
      this.$emit("onChanged", {
        isValid: this.checkValidation(),
        payload: this.makePayeLoad(),
      });
    }
  },
  created() {
    //this.$emit("onLoading", true);
    console.log('created')
    var ncp = [
      {
        step: 1,
        items: [
          {
            type: "dd",
            id: "language",
            value: null,
            label: "ST_MainDetailsLanguage",
            items: this.dictionary.sessionLanguage.MapToDDControl(),
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "dd",
            id: "masterCourseId",
            value: null,
            label: "ST_MainDetailsCourse",
            items: [],
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "dd",
            id: "organiser",
            value: null,
            label: "ST_MainDetailsOrganizer",
            items: this.dictionary.sessionOrganiser.MapToDDControl(),
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "ryn",
            id: "visibility",
            value: null,
            label: "ST_MainDetailsMoodle",
            items: [],
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
            type: "dd",
            id: "delivery",
            value: null,
            label: "ST_SessionDeliveryHow",
            items: this.dictionary.sessionDelivery.MapToDDControl(),
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "dd",
            id: "country",
            value: null,
            label: "ST_SessionDeliveryCountry",
            items: this.dictionary.sessionCountry.MapToDDControl(),
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "dd",
            id: "city",
            value: null,
            label: "ST_SessionDeliveryCity",
            items: this.dictionary.sessionCity.MapToDDControl(),
            default: null,
            validation: {
              required,
            },
          },
          // {
          //   type: "dd",
          //   id: "deliveryLanguage",
          //   value: null,
          //   label: "ST_SessionDeliveryLanguage",
          //   items: this.dictionary.sessionLanguage.MapToDDControl(),
          //   default: null,
          //   validation: {
          //     required,
          //   },
          // },
        ],
      },
      {
        step: 3,
        items: [
          {
            type: "dd",
            id: "framework",
            value: null,
            label: "ST_SessionContentFramework",
            default: null,
            placeholder: "N/A",
            items: [],
            validation: {},
          },
          {
            type: "dd",
            id: "scope",
            value: null,
            label: "ST_SessionContentScopeTrainig",
            placeholder: "N/A",
            items: [],
            default: null,
            validation: {},
          },

          {
            type: "ryn",
            id: "pilot",
            value: false,
            label: "ST_SessionContentPilot",
            // items: [
            //   { name: "ST_SessionContentPilot_Regular", value: "1" },
            //   { name: "ST_SessionContentPilot_Easo", value: "2" },
            // ],
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "dd",
            id: "content",
            value: null,
            label: "ST_SessionContentWhat",
            items: this.dictionary.sessionContent
              .MapToDDControl()
              .filter((f) => f.name.startsWith("EASO")),
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "dd",
            id: "trainingProgramme",
            value: null,
            label: "ST_SessionContentProgramme",
            items: [],
            placeholder: "N/A",
            default: null,
            validation: {},
          },
        ],
      },
    ];
    var noNcp = [
      {
        step: 1,
        items: [
          {
            type: "dd",
            id: "type",
            value: null,
            label: "ST_SelectCourseType",
            items: this.dictionary.sessionType.MapToDDControl().slice(0, 7),
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "dd",
            id: "subType",
            value: null,
            label: "ST_SelectCourseSubType",
            items: [],
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "dd",
            id: "language",
            value: null,
            label: "ST_MainDetailsLanguage",
            items: this.dictionary.sessionLanguage.MapToDDControl(),
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "dd",
            id: "masterCourseId",
            value: null,
            label: "ST_MainDetailsCourse",
            items: [],
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "dd",
            id: "organiser",
            value: null,
            label: "ST_MainDetailsOrganizer",
            items: this.dictionary.sessionOrganiser.MapToDDControl(),
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
            type: "dd",
            id: "delivery",
            value: null,
            label: "ST_SessionDeliveryHow",
            items: this.dictionary.sessionDelivery.MapToDDControl(),
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "dd",
            id: "country",
            value: null,
            label: "ST_SessionDeliveryCountry",
            items: this.dictionary.sessionCountry.MapToDDControl(),
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "dd",
            id: "city",
            value: null,
            label: "ST_SessionDeliveryCity",
            items: this.dictionary.sessionCity.MapToDDControl(),
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
            type: "dd",
            id: "framework",
            value: null,
            label: "ST_SessionContentFramework",
            default: null,
            items: this.dictionary.sessionFramework.MapToDDControl(),
            validation: {
              required,
            },
          },
          {
            type: "dd",
            id: "scope",
            value: null,
            label: "ST_SessionContentScopeTrainig",
            items: this.dictionary.sessionScope.MapToDDControl(),
            default: null,
            validation: {
              required,
            },
          },

          {
            type: "ryn",
            id: "pilot",
            value: false,
            label: "ST_SessionContentPilot",
            // items: [
            //   { name: "ST_SessionContentPilot_Regular", value: "1" },
            //   { name: "ST_SessionContentPilot_Easo", value: "2" },
            // ],
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "dd",
            id: "content",
            value: null,
            label: "ST_SessionContentWhat",
            items: this.dictionary.sessionContent.MapToDDControl(),
            default: null,
            validation: {
              required,
            },
          },
          {
            type: "dd",
            id: "trainingProgramme",
            value: null,
            label: "ST_SessionContentProgramme",
            items: this.dictionary.sessionTrainingProgramme.MapToDDControl(),
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
      //populate type in dependecy
      var typeControl = this.getControlfromControSteps(
        this.controlsSteps,
        "type"
      );
      if(typeControl){
      this.applyRules(typeControl, true);
      }
      
      //populate lang in dependecy
      var languageControl = this.getControlfromControSteps(
        this.controlsSteps,
        "language"
      );
      if(languageControl){
      this.applyRules(languageControl, true);
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
}
.title {
  margin: 0;
  padding: 0;
}

label {
  //  margin-bottom: 0px;
  font-size: 14px;
}
</style>