<template>
  <div class="b-custom-table">
    <b-table show-empty striped hover :busy="loading" :items="data.items" :fields="data.fields">
       <template #table-busy>
        <div class="text-center  my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template #empty="">
        <h5><i class="fas fa-ban"></i> {{ "ST_NoRecordsAvailable" | translate }}</h5>
      </template>
      <template #cell(actions)="row">
        <div class="text-center">
 

     <b-button
                  title=""
                  class="action-btn"
        
                   @click="onEdit(row)" 
                  v-b-tooltip.hover.leftttop="editText"
                  >
                 
                  <i class="fa fa-edit text-primary"></i
                ></b-button>

                  <b-button
                  title=""
                  class="action-btn"
        
                   @click="onDelete(row)"
                  v-b-tooltip.hover.leftttop="deleteText"
                  >
                 
                  <i class="fas fa-trash-alt text-approve"></i
                ></b-button>


        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: function () {
        return { fields: [], items: [] };
      },
    },
    loading:{
      type: Boolean,
      default: true
    },
  },
  computed:{
     editText() {
      return this.$options.filters.translate("ST_Edit");
    },
       deleteText() {
      return this.$options.filters.translate("ST_Delete");
    },
  },

  data() {
    return {
      // Note 'isActive' is left out and will not appear in the rendered table
    };
  },
  methods: {
    onEdit(item) {
      item.action="edit";
      this.$emit("action", item);
    },
    onDelete(item) {
      item.action="delete";
      this.$emit("action", item);
    },
  },
};
</script>
<style >



.b-custom-table .action-btn {
  border-color: transparent !important;
  background-color: transparent !important;
  padding: 0 !important;
  margin-right: 12px;
}
.b-custom-table .action-btn i {
  font-size: 17px;
}
.b-custom-table .action-btn:last-child {
  margin-right: 0;
}
.b-custom-table .action-btn:hover {
  text-decoration: none;
}

.b-custom-table .action-btn:focus {
  box-shadow: none !important;
  padding: 0px;
}



.b-custom-table table.b-table tr th{ 
   font-family: "Roboto", "Helvetica Neue", Arial, sans-serif;
    border-top:none;
    white-space: nowrap !important;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #9A9A9A;
    font-weight: 400;
}

.b-custom-table table.b-table tr th:focus {
 outline: none;
 color:#212529;
 font-weight: bold;
}
.b-custom-table table.b-table tr td{ 
  
    font-family: "Roboto", "Helvetica Neue", Arial, sans-serif;
    font-weight: 400;
    font-size: 14px;
    vertical-align: middle;
}

</style>