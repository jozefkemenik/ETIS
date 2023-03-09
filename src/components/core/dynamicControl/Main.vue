<template>
  <div class="w-100">
    <div v-for="control in controls" v-bind:key="control.id" class="row my-3">
      <div class="col-6">
        <label :for="control.id">{{ control.label | translate }} {{control.validation && control.validation.required? "*":"" }}</label>
      </div>
      <div class="col-6">
        <core-dynamic-control-controls-radio          :control="control"  @onChanged="onChanged($event)" v-if="control.type == 'ri'"/>
        <core-dynamic-control-controls-drop-down      :control="control"  @onChanged="onChanged($event)" v-if="control.type == 'dd'" :size="control.size" />
        <core-dynamic-control-controls-radio-yes-no   :control="control"  @onChanged="onChanged($event)" v-if="control.type == 'ryn'"/>
        <core-dynamic-control-controls-calendar       :control="control"  @onChanged="onChanged($event)" v-if="control.type == 'cal'"/>
        <core-dynamic-control-controls-calendar-range :control="control"  @onChanged="onChanged($event)" v-if="control.type == 'calr'"/>
        <core-dynamic-control-controls-text           :control="control"  @onChanged="onChanged($event)" v-if="control.type == 'text'"/>

      </div>
    </div>
  </div>
</template>


<script>
import // minLength,
// requiredIf,
//  helpers
"vuelidate/lib/validators";
export default {
  props: {
    controls: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },

  watch: {},
  data() {
    return {};
  },
  computed: {
    noSelectText() {
      return this.$options.filters.translate("ST_PleaseSelect");
    },
    selectText() {
      return this.$options.filters.translate("ST_PleaseSelect");
    }
  },

  methods: {

    onChanged(item){
      this.$emit("onChanged", item);
    }
  },
  mounted() {

  }
};
</script>


<style lang="scss">
.title {
  margin: 0;
  padding: 0;
}
label {
  //  margin-bottom: 0px;
  font-size: 14px;
}

.b-form-datepicker label{
  display:none;
}

.b-dropdown.form-control.is-invalid{
  background-position: right calc(2.2em) center;
  padding:0;
  button.btn{
    border-color:#fff!important;
  }
}

</style>