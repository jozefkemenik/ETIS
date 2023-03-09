<template>
  <form @submit.prevent="submit" ref="reg-form" class="w-100">
    <div class="container">
      <core-dynamic-control-main
        :controls="items"
        @onChanged="onChanged($event)"
      />
      <div class="d-flex flex-row align-items-center justify-content-end">
        <b-button size="sm" class="mr-2" @click="cancel" :disabled="loading">
         
          {{
          "ST_Cancel" | translate
        }}</b-button>
        <b-button size="sm" variant="info" class="" :disabled="!isValid || loading" @click="formClick" >
            <b-spinner class="loading" v-if="loading" small type="grow"></b-spinner>
         <span v-if="!loading"> {{
          isEdit ? "ST_Save" : "ST_Add" | translate
        }}</span></b-button>
      </div>
    </div>
  </form>
</template>


  


<script>
import { mapGetters } from "vuex";
import {
  required,
  email,
  minLength,
  // requiredIf,
  helpers
} from "vuelidate/lib/validators";

const alpha = helpers.regex('alpha', /^[a-zA-Z]{2,}$/)
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
     loading:{
      type: Boolean,
      default: false
    },
  },
  watch: {},

  data() {
    return {
      isEdit: false,
      isValid: false,
      items: [],
    };
  },

  computed: {
    ...mapGetters(["dictionary"]),
    noSelectText() {
      return "-";
    },
  },

  methods: {
    formClick() {
      this.$emit("action", {
        action: this.isEdit ? "edit" : "new",
        payload: this.makePayeLoad(),
      });
    },
    cancel() {
      this.$emit("action", {
        action: "cancel",
      });
    },

    onChanged(item) {
      this.isValid = this.checkValidation();
    },
    makePayeLoad() {
      return this.items;
    },
    checkValidation() {
      var isValid = true;
      this.items.forEach((r) => {
        r.$v.$touch();
        isValid = isValid && !r.$v.$invalid;
      });
      return isValid;
    },
  },
 
  created() {
    this.items = [
      {
        type: "text",
        id: "name",
        value: null,
        label: "ST_FirstName",
        default: null,
        validation: {
          required,
          alpha    
        },
      },
      {
        type: "text",
        id: "surname",
        value: null,
        label: "ST_LastName",
        items: [],
        default: null,
        validation: { 
          required,
          alpha
        },
      },
       {
        type: "text",
        id: "username",
        value: null,
        label: "ST_Username",
        items: [],
        default: null,
        validation: {
          required,
          alpha
        },
      },
      {
        type: "text",
        id: "email",
        value: null,
        label: "ST_Email",
        items: [],
        default: null,
        validation: {
          required,
          email
        },
      },
       {
        type: "dd",
        id: "institution",
        idText: "institutionText",
        value: null,
        label: "ST_Institution",
        items: this.dictionary.participantOrganiserInstitution.MapToDDControl(),
        default: null,
        validation: {
     
        },
      },
      {
        type: "dd",
        id: "framework",
        idText: "frameworkText",
        value: null,
        label: "ST_Framework",
        items: this.dictionary.participantFramework.MapToDDControl(),
        default: null,
        validation: {
       
        },
      },
       {
        type: "dd",
        id: "targetGroup",
        idText: "targetGroupRoleName",
        value: null,
        label: "Target group",
        items: this.dictionary.participantTargetGroup.MapToDDControl(),
        default: null,
        validation: {
       
        },
      },
    ];

    //populate in edit mode
    if (this.data && Object.keys(this.data).length > 0) {
      this.isEdit = true;
      this.items.forEach((item) => {
        if (this.checkProperty(this.data, item)) {
          this.setControlfromControSteps(item, this.data);
        }
      });
    }
  },
  mounted() {
    if (this.data && Object.keys(this.data).length > 0) {
       this.onChanged();
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  width: 80%;
  float: left;
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