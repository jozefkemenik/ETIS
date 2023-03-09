<template>
     <div class="content">
                <div class="container-fluid">
              
                                    <div class="card bootstrap-table">
                                <div class="card-body table-full-width">



  <div class="fixed-table-toolbar">
                              <div class="bars pull-left">
                                <div class="toolbar">
                                  <!--        Here you can write extra buttons/actions for the toolbar              -->
                                </div>
                              </div>
                              <div class="columns columns-right pull-right">
                                <button
                                  class="btn btn-outline"
                                  type="button"
                                  name="refresh"
                                  title="Refresh"
                                >
                                  <i class="fa fa-refresh"></i>
                                </button>
                                <button
                                  class="btn btn-outline"
                                  type="button"
                                  name="toggle"
                                  title="Toggle"
                                >
                                  <i class="fa fa-th-list"></i>
                                </button>
                                <div
                                  class="keep-open btn-group"
                                  title="Columns"
                                >
                                  <button
                                    type="button"
                                    class="btn btn-outline dropdown-toggle"
                                    data-toggle="dropdown"
                                  >
                                    <i class="fa fa-columns"></i>
                                    <span class="caret"></span>
                                  </button>
                                  <ul class="dropdown-menu" role="menu">
                                    <li>
                                      <label
                                        ><input
                                          type="checkbox"
                                          data-field="id"
                                          value="1"
                                          checked="checked"
                                        />
                                        ID</label
                                      >
                                    </li>
                                    <li>
                                      <label
                                        ><input
                                          type="checkbox"
                                          data-field="name"
                                          value="2"
                                          checked="checked"
                                        />
                                        Name</label
                                      >
                                    </li>
                                    <li>
                                      <label
                                        ><input
                                          type="checkbox"
                                          data-field="salary"
                                          value="3"
                                          checked="checked"
                                        />
                                        Salary</label
                                      >
                                    </li>
                                    <li>
                                      <label
                                        ><input
                                          type="checkbox"
                                          data-field="country"
                                          value="4"
                                          checked="checked"
                                        />
                                        Country</label
                                      >
                                    </li>
                                    <li>
                                      <label
                                        ><input
                                          type="checkbox"
                                          data-field="city"
                                          value="5"
                                          checked="checked"
                                        />
                                        City</label
                                      >
                                    </li>
                                    <li>
                                      <label
                                        ><input
                                          type="checkbox"
                                          data-field="actions"
                                          value="6"
                                          checked="checked"
                                        />
                                        Actions</label
                                      >
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div class="pull-left search">
                                <input
                                  class="form-control"
                                  type="text"
                                  placeholder="Search"
                                />
                              </div>
                            </div>
     <div
                              class="fixed-table-container"
                              style="padding-bottom: 0px"
                            >
  <b-table 
    show-empty
    class="table-hover"
    :items="data.items"
    :fields="data.fields"
  >
    <template #table-colgroup="scope">
      <col
        v-for="field in scope.fields"
        :key="field.key"
        :style="{ width: field.key === 'actions' ? 'auto' : 'auto' }"
      />
    </template>

    <template #cell(actions)="row">
      <span
        class="action-icon text-center w-100 d-block"
        :id="`action-popover-${row.item.id}`"
        ><i class="fas fa-info-circle"></i
      ></span>

      <b-popover
        :target="`action-popover-${row.item.id}`"
        placement="right"
        triggers="hover"
      >
        <div style="width: 120px">
          <b-button
            size="sm"
            variant="info"
            block
            :disabled="detailOpen"
            @click="showDetail(row)"
            class="mr-2"
          >
            <b-spinner v-if="loadingDetail" small type="grow"></b-spinner>
            <div v-else>Show Details</div>
          </b-button>
          <b-button
            v-if="tabIndex == 0"
            size="sm"
            block
            variant="primary"
            @click="approve(row)"
            class="mr-2"
          >
            <b-spinner v-if="approving" small type="grow"></b-spinner>
            <div v-else>Approve</div>
          </b-button>
          <b-button
            v-if="tabIndex == 1"
            size="sm"
            block
            variant="danger"
            disabled
            class="mr-2"
          >
            <b-spinner v-if="approving" small type="grow"></b-spinner>
            <div v-else>Reject</div>
          </b-button>
        </div>
      </b-popover>
    </template>

    <template #head()="data">
      <div class="text-nowrap th-inner" >{{ data.label }}</div>
    </template>

    <template #empty="">
      <div class="text-center">
        <h4>{{ "ST_NoRecordsAvailable" | translate }}</h4>
      </div>
    </template>
  </b-table>
  </div>
  </div>
   </div>
    </div>
     </div>

</template>
<script>
import AuthSingeltonService from "@/auth/auth.singleton.service";
import SessionDetail from "@/components/session/SessionDetail.vue";
export default {
  props: {
    selection: {
      type: String,
      default: null,
    },
    data: {
      items: [],
      fields: [],
    },
    tabIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      approving: false,
      loadingDetail: false,
      detailOpen: false,
    };
  },
  components: {},

  created() {},

  methods: {
    approve(row) {
      var payload = { id: row.item.id };
      this.approving = true;

      setTimeout(() => {
        AuthSingeltonService.httpPost("Session/Approve", row.item.id, true)
          .then(
            (r) => {
              var index = this.data.items.findIndex((f) => {
                return f.id == row.item.id;
              });
              this.data.items.splice(index, 1);
            },
            (error) => {
              console.log(error);
            }
          )
          .finally(() => {
            this.approving = false;
          });
      }, 500);
    },

    showDetail(options) {
      this.loadingDetail = true;
      setTimeout(() => {
        this.detailOpen = true;
        this.options = options;
        const content = this.$createElement(SessionDetail, {
          props: { options: options },
        });
        this.$bvModal
          .msgBoxOk(
            [content],
            {
              headerBgVariant: "bg-default",
              headerTextVariant: "primary",
              headerCloseVariant: "primary",
              centered: true,
              scrollable: true,
              okTitle: "OK",
              modalClass: "modal-disclaimer",
              title: options.item.shortName,
              hideHeaderClose: false,
              dialogClass: "modal-container",
            },
            (e) => e.trigger
          )
          .then((trigger) => {
            this.detailOpen = false;
            if (trigger === "ok") {
              // this.myValue value will be your result
            } else {
              // user clicked cancel button or closed modal
            }
          })
          .catch((err) => {
            // An error occurred
          });
        this.loadingDetail = false;
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped >
  .action-icon {
    font-size: 16px;
    cursor: pointer;
  }
</style>
