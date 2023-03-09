<template>
  <div class="d-flex flex-row align-items-center justify-content-center">
    <core-dynamic-control-controls-calendar
      v-if="controlLeft.id"
      :control="controlLeft"
      @onChanged="onChangedLeft($event)"
    />
    <span class="mx-2"><i class="fas fa-arrow-right"></i></span>
    <core-dynamic-control-controls-calendar
      v-if="controlRight.id"
      :control="controlRight"
      @onChanged="onChangedRight($event)"
    />
  </div>
</template>


<script>
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
      this.$emit("onChanged", val);
    },
  },
  data() {
    return {
      controlLeft: {
        type: "cal",
        id: null,
        value: null,
        default: null,
        validation: {},
        min: null,
        max: null,
      },
      controlRight: {
        type: "cal",
        id: null,
        value: null,
        default: null,
        validation: {},
        min: null,
        max: null,
      },
    };
  },
  created() {
    this.controlLeft.id = this.control.id + "_left";
    this.controlLeft.validation = this.control.validation;
    if (Array.isArray(this.control.value) && this.control.value.length == 2) {
      this.controlLeft.iso = this.control.value[0];
    }

    this.controlRight.id = this.control.id + "_right";
    this.controlRight.validation = this.control.validation;
    if (Array.isArray(this.control.value) && this.control.value.length == 2) {
      this.controlRight.iso = this.control.value[1];
    }
    var $v = {
      $touch: () => {
        this.controlLeft.$v.$touch();
        this.controlRight.$v.$touch();
      },
    };
    var _this = this;
    // getting property
    Object.defineProperty($v, "$invalid", {
      get: function () {
        return _this.controlLeft.$v.$invalid || _this.controlRight.$v.$invalid;
      },
    });

    this.control.$v = $v;
  },
  computed: {},

  methods: {
    onChangedLeft(e) {
      if (!(this.controlLeft.value <= this.controlRight.value)) {
        this.controlRight.value = this.controlLeft.value;
      }
      this.controlRight.min = this.controlLeft.value;
      this.control.value[
        Object.keys(this.control.value)[0]
      ] = this.controlLeft.value;
      this.control.iso[Object.keys(this.control.iso)[0]] = this.controlLeft.iso;
      this.$emit("onChanged", this.control);
    },
    onChangedRight(e) {
      if (!(this.controlLeft.value <= this.controlRight.value)) {
        this.controlLeft.value = this.controlRight.value;
      }
      this.controlLeft.max = this.controlRight.value;
      this.control.value[
        Object.keys(this.control.value)[1]
      ] = this.controlRight.value;
      this.control.iso[
        Object.keys(this.control.iso)[1]
      ] = this.controlRight.iso;
      this.$emit("onChanged", this.control);
    },
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