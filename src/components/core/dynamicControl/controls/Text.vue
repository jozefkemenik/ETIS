<template>
  <div class="d-flex flex-row w-100 align-items-center dyn-c-text">
 
 <b-form-input size="sm" 
                :readonly="control.readonly"
                :disabled="control.loading"
                type="text"
                :id="control.id"
                class="form-control"
                :class="{ 'is-invalid': $v.control.$error}"
                v-model.trim="$v.control.value.$model"
                @change="onChange"
               
              />

      <b-spinner class="loading" v-if="control.loading" small type="grow"></b-spinner>

               <b-button
               
      size="sm"
      style="margin-left: 10px; width: 150px"
      variant="success"
      @click="control.btnCallback"
      v-if="control.btnLabel"
      :disabled="control.loading"
    >
    {{ control.btnLabel | translate }}
    </b-button>
      
    
  </div>
</template>


<script>
// import {
//   required
//   //email,
//   // minLength,
//   // requiredIf,
//   //  helpers
// } from "vuelidate/lib/validators";
export default {
  props: {
    control: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },

  watch: {},
  data() {
    return {};
  },
  computed: {

  },

  methods: {
    onChange(item) {
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


<style >
.dyn-c-text .loading{
    position: absolute;
    right: -10px;


}
</style>