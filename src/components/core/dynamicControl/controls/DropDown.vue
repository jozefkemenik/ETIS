<template>
  <div class="d-flex flex-row w-100 dd">
    <b-dropdown
      :size="size"
      class="w-100"
      :disabled="!control.items || control.items.length == 0"
      :id="control.id"
    
      toggle-class="toggle-class"
      block
      toggle-text="Toggle dropdown"
      split-variant="outline-default"
      variant="outline-default"
      menu-class="dd-menu-size"
      :class="{ 'is-invalid form-control form-control-sm': $v.control.value.$error }"
    >

      <template v-slot:button-content>
        <span class="toggle-text-class">
{{ control.value
          ? control.value.name
          : control.items && control.items.length == 0
          ? noSelectText
          : selectText}}

        </span>
        </template>

<div v-if="this.control.items && this.control.items.length>10">
           <b-dropdown-form @submit.stop.prevent="() => {}">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text"> <i class="fa fa-search"></i></span>
          </div>

          <b-form-input
            v-model="query"
            size="sm"
            class="form-control"
            @input="searchInput"
            type="search"
          ></b-form-input>
        </div>
      </b-dropdown-form> 
      <b-dropdown-divider></b-dropdown-divider>
</div>


      <b-dropdown-item
        @click="clickItem(item)"
        :value="item"
        v-for="item in matchedItems"
        :key="item.id"
        ><span v-html="highlight(item.name)"/></b-dropdown-item
      >
    </b-dropdown>

    <b-button
      size="sm"
      style="margin-left: 10px; width: 150px"
      variant="success"
      @click="control.btnCallback"
      v-if="control.btnLabel"
    >
      {{ control.btnLabel | translate }}
    </b-button>
  </div>
</template>


<script>

function sanitize(text) {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

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
    size:{
      type: String,
      default: function () {
        return "sm";
      },
    }
  },

  watch: {},
  data() {
    return {query:""};
  },
  computed: {
    noSelectText() {
      return this.control && this.control.placeholder ? this.control.placeholder : this.$options.filters.translate("ST_PleaseSelect");
    },
    selectText() {
      return this.control && this.control.placeholder ? this.control.placeholder : this.$options.filters.translate("ST_PleaseSelect");
    },
     highlight() {
      return (text) => {
        text = sanitize(text)
        if (this.query.length === 0) {
          return text
        }
        const re = new RegExp(this.escapedQuery, 'gi')

        return text.replace(re, `<strong>$&</strong>`)
      }
    },

    escapedQuery() {
      return escapeRegExp(sanitize(this.query))
    },

    matchedItems() {

      if (!this.query || this.query.length === 0) {
        return this.control.items;
      }


      const re = new RegExp(this.escapedQuery, 'gi')

      // Filter, sort, and concat
      return this.control.items
        .filter(i => i.name.match(re) !== null)
        .sort((a, b) => {
          const aIndex = a.name.indexOf(a.name.match(re)[0])
          const bIndex = b.name.indexOf(b.name.match(re)[0])

          if (aIndex < bIndex) { return -1 }
          if (aIndex > bIndex) { return 1 }
          return 0
        }).slice(0, 1000)
    }



  },

  methods: {
    clickItem(item) {
      this.control.value = item;
      this.$emit("onChanged", this.control);
    },
    searchInput(e){
        console.log(e)
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
.btn-outline-default.dropdown-toggle{
  border-color:#ced4da;
}
.dropdown-menu.show{
   border-color:#adb5bd solid 1px;
}
.dropdown-toggle.toggle-class{
  padding-right:20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
    &:after {
    float:right;
    position:absolute;
    top:17px;
    right:10px;
  }
  &.btn-sm:after{
      top:13px;
  }
}
.dd-menu-size {
  max-height: 280px;
  overflow-y: auto;
  width:auto;
  max-width:700px;
  li a{
 text-overflow: ellipsis;
  overflow-x: hidden;
  white-space: nowrap;

  }

  //margin-left:-1px!important;
}

// .b-dropdown.form-control.is-invalid {
//   background-position: right calc(2.2em) center;
//   height:10px;
//   padding: 0;
//   button.btn {
//     border-color: #fff !important;
//   }
// }
.dd .b-dropdown.form-control.is-invalid button.btn {
    border: none !important;
}

</style>