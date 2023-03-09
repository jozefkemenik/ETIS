<template>
  <b-form-group v-if="control.type == 'ri'">
    <b-form-radio-group
      :class="{ 'is-invalid': $v.control.value.$error }"
      class="radio"
      :id="control.id"
      v-model="control.value"
    >
      <b-form-radio
        v-for="(c, index) in control.items"
        v-bind:key="index"
        :value="c.value"
        >{{ c.name | translate }}</b-form-radio
      >
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

  methods: {
    clickItem(item) {
      this.control.value = item;
      this.$emit("onChanged", this.control);
    },
  },
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


<style lang="scss">
.radio.is-invalid .custom-control-label:before {
  border-color: #dc3545;
}

// .radio-form-control {
//   display: block;
//   width: 100%;
//   padding: 0.375rem 0.75rem;
//   font-size: 1rem;
//   font-weight: 400;
//   line-height: 1.5;
//   color: #495057;
//   background-color: #fff;
//   background-clip: padding-box;
//   border: 1px solid #ced4da;
//   border-radius: 0.25rem;
//     &.is-invalid{
//     border-color: #ff4136;
//   }
// }
</style>