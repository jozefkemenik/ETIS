<template>
  <b-form-group>
    <b-form-radio-group
      :class="{ 'is-invalid': $v.control.value.$error }"
      class="radioyn"
      :id="control.id"
      v-model="control.value"
      :name="control.id"
    >
      <b-form-radio :value="true">
        {{ "ST_Yes" | translate }}
      </b-form-radio>
      <b-form-radio :value="false">
        {{ "ST_No" | translate }}
      </b-form-radio>
    </b-form-radio-group>
  </b-form-group>
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
      this.$emit("onChanged", this.control);
    },
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

  methods: {},
  created() {
    this.control.$v =  this.$v;
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


<style>
.radioyn.is-invalid .custom-control-label:before {
  border-color: #dc3545;
}
</style>