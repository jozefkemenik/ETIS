<template>
  <div class="session-table">
    <div class="card">
      <div class="card-body">
        <div class="actions-header mb-2 d-flex flex-row">
          <div style="width: 300px">
            <b-form-input size="sm"
              v-model="textSearch"
              placeholder="Search"
            ></b-form-input>
          </div>
          <div style="width: 200px" class="ml-2">
            <core-dynamic-control-controls-drop-down :size="'sm'"
              :control="ddColumns"
              @onChanged="onDDChanged($event)"
            />
          </div>
          <div class="ml-auto">
            <b-button :id="`columns-button-${id}`" size="sm" variant="outline-primary">
              <span><i class="fas fa-filter"></i> Columns</span>
            </b-button>

            <b-popover
              :target="`columns-button-${id}`"
              title="Choose columns"
              triggers="focus"
            >
              <b-form-group>
                <template #label>
                  <b-form-checkbox
                    v-model="allSelected"
                    :indeterminate="indeterminate"
                    @change="toggleAll"
                  >
                    {{ allSelected ? "Un-select All" : "Select All" }}
                  </b-form-checkbox>
                </template>

                <template v-slot="{ ariaDescribedby }">
                  <b-form-checkbox-group
                    v-model="filteredColumns"
                    :options="allColumns"
                    :aria-describedby="ariaDescribedby"
                    name="columns"
                    class="ml-4"
                    stacked
                    value-field="value"
                    text-field="name"
                  ></b-form-checkbox-group>
                </template>
              </b-form-group>
            </b-popover>
          </div>
        </div>
        <div class="scrollable-container" ref="scrollableContainer">
          <b-table
            show-empty
            hover
            :busy="loading || busy"
            :items="rows"
            :fields="fields"
          >
            <template #table-busy>
              <div class="text-center my-2 text-info">
                <b-spinner class="align-middle mr-3"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </template>

            <!-- <template #cell()="data">
        <div class="aaa">{{ data.value }}</div>
      </template> -->

            <template #cell(actions)="row">
              <!-- <span
        class="action-icon text-center w-100 d-block"
        :id="`action-popover-${row.item.id}`"
        ><i class="fas fa-info-circle"></i
      ></span> -->
              <div
                style="white-space: nowrap !important"
                :id="`action-popover-${row.item.id}`"
              >
                <b-button
                  title=""
                  class="action-btn"
                  v-if="canSubmit"
                  @click="submit(row)"
                  v-b-tooltip.hover.leftttop="'Submit'"
                  ><i class="fas fa-paper-plane text-approve"></i
                ></b-button>
                <b-button
                  title=""
                  class="action-btn"
                  v-if="canReject"
                  @click="reject(row)"
                  v-b-tooltip.hover.leftttop="'Reject'"
                  ><i class="fa fa-undo text-danger"></i
                ></b-button>
                <b-button
                  title=""
                  class="action-btn"
                  v-if="canApprove"
                  @click="approve(row)"
                  v-b-tooltip.hover.leftttop="'Approve'"
                  ><i class="fa fa-thumbs-up text-approve"></i
                ></b-button>
                <b-button
                  title=""
                  class="action-btn"
                  v-if="canEdit"
                  @click="edit(row)"
                  v-b-tooltip.hover.leftttop="'Edit'"
                  ><i class="fa fa-edit text-primary"></i
                ></b-button>
                <b-button
                  title=""
                  class="action-btn"
                  @click="detail(row)"
                  v-b-tooltip.hover.leftttop="'Detail'"
                  ><i class="fa fa-image text-info"></i
                ></b-button>
                 <b-button
                  v-if="canDelete"
                  title=""
                  class="action-btn"
                  @click="remove(row)"
                  v-b-tooltip.hover.leftttop="'Delete'"
                  ><i class="fa fa-trash-alt text-danger"></i
                ></b-button>
              </div>
            </template>

            <template #empty="">
              <div class="text-center">
                <h4>{{ "ST_NoRecordsAvailable" | translate }}</h4>
              </div>
            </template>
          </b-table>
        </div>
        <div class="w-100 d-flex flex-row mt-2">
          <b-pagination
            @change="paginationChanged"
            class="ml-auto mr-4"
            variant="info"
            :per-page="perPage"
            pills
            v-model="page"
            size="sm"
            :total-rows="totalRows"
          ></b-pagination>

          <b-dropdown size="sm" :text="`${perPage}`" variant="outline-primary">
            <b-dropdown-item
              @click="
                perPage = 5;
                paginationChanged();
              "
              >5</b-dropdown-item
            >
            <b-dropdown-item
              @click="
                perPage = 10;
                paginationChanged();
              "
              >10</b-dropdown-item
            >
            <b-dropdown-item
              @click="
                perPage = 30;
                paginationChanged();
              "
              >30</b-dropdown-item
            >
            <b-dropdown-item
              @click="
                perPage = 100;
                paginationChanged();
              "
              >100</b-dropdown-item
            >
          </b-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
export default {
  props: {
    data: {
      type: Object,
      default: function () {
        return { fields: [], items: [] };
      },
    },
    loading: {
      type: Boolean,
      default: true,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
    canApprove: {
      type: Boolean,
      default: false,
    },
    canReject: {
      type: Boolean,
      default: false,
    },
    canSubmit: {
      type: Boolean,
      default: false,
    },
    canDelete:{
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      allSelected: true, // columns selector
      filteredColumns: [],
      allColumns: [],
      textSearch: "",
      perPage: 10,
      page: 1,
      busy: false,
      id: 0,
      ddColumns: {
        id: "ddColumns",
        value: null,
        placeholder: "Select Column",
        items: [],
        default: null,
        validation: {},
        size: "df",
      },
      // Note 'isActive' is left out and will not appear in the rendered table
    };
  },
  computed: {
    fields() {
      return this.filteredColumns
        .map((r) => {
          var field = this.data.fields.find((f) => f.key == r);
          return field;
        })
        .concat(this.data.fields.filter((r) => r.key == "actions"));
    },
    rows() {
      var start = (this.page - 1) * this.perPage;
      var end = (this.page - 1) * this.perPage + this.perPage;
      return this.data.items.slice(start, end);
    },
    pages() {
      return Math.floor(this.data.items.length); ///this.perPage)
    },
    totalRows() {
      return this.data.items.length;
    },
  },
  methods: {
    edit(item) {
      item.action = "edit";
      this.$emit("action", item);
    },
    approve(item) {
      item.action = "approve";
      this.$emit("action", item);
    },
    reject(item) {
      item.action = "reject";
      this.$emit("action", item);
    },
    detail(item) {
      item.action = "detail";
      this.$emit("action", item);
    },
    submit(item) {
      item.action = "submit";
      this.$emit("action", item);
    },
    remove(item){
      item.action = "delete";
      this.$emit("action", item);
    },
    resizeHandler() {
      var ref = this.$refs["scrollableContainer"];
      var calcHeight = window.innerHeight - getPosition(ref).y;
      $(ref).height(calcHeight - 65); //offsed 30
      console.log(calcHeight);
    },
    onDDChanged(e) {},
    paginationChanged() {
      this.busy = true;
      setInterval(() => {
        this.busy = false;
      }, 1000);
    },
    toggleAll(checked) {
      this.filteredColumns = checked ? this.allColumns.map((r) => r.value) : [];
    },
  },
  created() {
    this.id = this.subscribeResizeFn(this.resizeHandler);
    var items = this.data.fields.map((r) => {
      return { name: r.label, value: r.key };
    });
    this.ddColumns.items = items.filter((r) => r.value !== "actions");
    this.allColumns = this.ddColumns.items;
    this.toggleAll(true);
  },
  destroyed() {
    this.unsubscribeResizeFn(this.resizeHandler);
  },
  mounted() {
    var ref = this.$refs["scrollableContainer"];
    $(ref).mCustomScrollbar({
      axis: "xy",
      theme: "inset-2-dark",
      autoHideScrollbar: true,
      scrollbarPosition: "outside",
      autoExpandScrollbar: true,
      autoDraggerLength: true,
    });
  },
};

function getPosition(element) {
  var xPosition = 0;
  var yPosition = 0;

  while (element) {
    xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft;
    yPosition += element.offsetTop - element.scrollTop + element.clientTop;
    element = element.offsetParent;
  }

  return { x: xPosition, y: yPosition };
}
</script>
<style>
.session-table {
  overflow: hidden;
  width: 100%;
}
.session-table table.b-table tr th {
  border-top: none;
  white-space: nowrap !important;
  font-size: 0.75rem;
  background-color: #ececec;
  padding-top: 15px;
  padding-bottom: 15px;
}

.session-table table.b-table tr th:focus {
  outline: none;
  color: #212529;
  font-weight: bold;
}
.session-table table.b-table tr td {
  font-family: "Roboto", "Helvetica Neue", Arial, sans-serif;
  font-weight: 400;
  font-size: 14px;
  vertical-align: middle;
  color: rgb(33, 37, 41);
}
.session-table .action-btn {
  border-color: transparent !important;
  background-color: transparent !important;
  padding: 0 !important;
  margin-right: 12px;
}
.session-table .action-btn i {
  font-size: 17px;
}
.session-table .action-btn:last-child {
  margin-right: 0;
}
.session-table .action-btn:hover {
  text-decoration: none;
}

.session-table .action-btn:focus {
  box-shadow: none !important;
  padding: 0px;
}
.scrollable-container {
  width: 100%;
  overflow: auto;
}

.session-table .pagination {
  margin: 0;
}
</style>