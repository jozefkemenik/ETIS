<template>
  <div class="d-flex flex-row align-items-center w-100">
    <b-form-input
      :class="{ 'is-invalid': $v && $v.control.value.$error }"
      class="mr-2 text-center text-default date-picker"
      v-model="control.value"
      type="text"
      size="sm"
      placeholder="YYYY-MM-DD"
      autocomplete="off"
      variant="default"
      readonly
    ></b-form-input>

    <b-form-datepicker
      size="sm"
      :min="control.min"
      :max="control.max"
      button-only
      v-model="control.value"
      button-variant="success"
      locale="en"
    ></b-form-datepicker>
  </div>
</template>


<script>
import // minLength,
// requiredIf,
//  helpers
"vuelidate/lib/validators";
export default {
  props: {
    control: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },

  watch: {
    "control.value"(val) {
      this.control.iso = val ? new Date(val).toISOString() : null;
      this.$emit("onChanged", this.control);
    }
  },
  data() {
    return {};
  },
  computed: {
    noSelectText() {
      return this.$options.filters.translate("ST_PleaseSelect");
    },
    selectText() {
      return this.$options.filters.translate("ST_PleaseSelect");
    },
  },

  methods: {
    onChange() {},
  },
  created() {
    this.control.$v = this.$v;
    if(this.control.iso){
     this.control.value = this.control.iso.slice(0,10); //return YYYY-MM-DD
    }
  },
  validations() {
    return {
      control: {
        value: this.control.validation,
      },
    };
  },
};
</script>


<style lang="scss">
input.date-picker.form-control {
  background-color: #fff;
}
.title {
  margin: 0;
  padding: 0;
}
label {
  //  margin-bottom: 0px;
  font-size: 14px;
}

.b-form-datepicker label {
  display: none;
}

.b-dropdown.form-control.is-invalid {
  background-position: right calc(2.2em) center;
  padding: 0;
  button.btn {
    border-color: #fff !important;
  }
}
</style>