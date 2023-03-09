<template>
  <div class="h-100 sub-section d-flex flex-column">
    <section class="header py-4">
      <!-- <b-breadcrumb :items="items"></b-breadcrumb> -->
      <span class="ml-3 h4">{{ "Sessions" }}</span>
    </section>
    <section class="body d-flex flex-column h-100">
      <div class="container-fluid mt-3 d-flex flex-column">
        <b-tabs
          class="d-flex flex-column h-100"
          content-class="d-flex flex-column h-100 "
          @input="changedTab"
          v-model="tabIndex"
          variant="info"
        >
          <!-- Draft -->
          <b-tab
            v-for="(data, index) in tableData"
            v-bind:key="index"
            class="flex-column h-100"
            :title="data.title"
            :title-item-class="data.class"
          >

           <template #title>
            <i :class="data.icon"></i> {{data.title}}
      </template>
      
            <core-table-session-table
              class="mt-2"
              :canReject="tableData[index].canReject"
              :canEdit="tableData[index].canEdit"
              :canApprove="tableData[index].canApprove"
              :canSubmit="tableData[index].canSubmit"
              :canDelete="tableData[index].canDelete"
              :loading="tableData[index].loading"
              :data="tableData[index]"
              @action="onAction($event, index)"
            />
          </b-tab>
        </b-tabs>
      </div>
    </section>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import AuthSingeltonService from "@/auth/auth.singleton.service";
import SessionDetail from "@/components/session/SessionDetail.vue";
export default {
  props: {
    selection: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      title: "",
      detailOpen: false,
      tabIndex: 0,

      commonFields: [
        {
          key: "id",
          label: `ID`,
          sortable: true,
        },
        {
          key: "code",
          label: this.$options.filters.translate("ST_CourseCode"),
          sortable: true,
        },
        {
          key: "name",
          label: this.$options.filters.translate("ST_Session"),
          sortable: true,
        },
        {
          key: "shortName",
          label: this.$options.filters.translate("ST_ShortName"),
          sortable: true,
        },
        {
          key: "masterCourseName",
          label: this.$options.filters.translate("ST_MasterCourse"),
          sortable: true,
        },
        {
          key: "typeText",
          label: this.$options.filters.translate("ST_CourseType"),
          sortable: true,
        },
        {
          key: "languageText",
          label: this.$options.filters.translate("ST_Language"),
          sortable: true,
        },

        {
          key: "participants",
          label: this.$options.filters.translate("ST_Participants"),
          sortable: true,
        },
        {
          key: "trainers",
          label: this.$options.filters.translate("Trainers"),
          sortable: true,
        },
        {
          key: "actions",
          label: "Actions",
          sortable: false,
          isAction: true,
        },
      ],
      tableData: [
        {
          fields: [],
          items: [],
          loading: false,
          class:"draft-tab",
          requestName: "Draft",
          icon:"fab fa-firstdraft",
          title: this.$options.filters.translate("ST_DraftSessions"),
          canApprove: false,
          canEdit: true,
          canReject: false,
          canSubmit: false,
          canDelete:true

        },
        {
          fields: [],
          items: [],
          loading: false,
          class:"sub-tab",
          requestName: "Submited",
          icon:"fa fa-paper-plane",
          title: this.$options.filters.translate("ST_SubmittedSessions"),
          canApprove: false,
          canEdit: false,
          canReject: false,
        },
        {
          fields: [],
          items: [],
          loading: false,
           class:"rej-tab",
          requestName: "Rejected",
          icon:"fa fa-undo",
          title: this.$options.filters.translate("ST_RejectedSessions"),
          canApprove: false,
          canEdit: true,
          canReject: false,
          canSubmit: true,
        },
        {
          fields: [],
          items: [],
          loading: false,
          class:"app-tab",
          requestName: "Approved",
          icon:"fa fa-thumbs-up",
          title: this.$options.filters.translate("ST_ApprovedSessions"),
          canApprove: false,
          canEdit: false,
          canReject: false,
          canSubmit: false,
        },
      ],
    };
  },
  components: {},
  computed: {
    ...mapGetters(["config","isOP","isELearning","isNCP"]),
  },
  created() {
    this.tableData.forEach((r, i) => {
      r.fields = this.commonFields;
      this.load(i);
    });
    // set submitted per roles
    this.tableData[1].canApprove = this.isELearning,
    this.tableData[1].canReject =  this.isELearning;
    this.tableData[1].canEdit =  true;

    // set approved per roles
    this.tableData[3].canEdit =  this.isELearning;
    



  },
  mounted() {
 
    if (this.$route.query) {
      switch (this.$route.query.tab) {
        case "sub":
          this.changedTab(1);
          break;
        case "app":
          this.changedTab(3);
          break;
        case "rej":
          this.changedTab(2);
          break;
        default:
          this.changedTab(0);
          break;
      }
    }else{
         this.changedTab(0);
    }
  },
  methods: {
    changedTab(currTab) {
      if (this.triggerResizeHandler) this.triggerResizeHandler();
      this.tabIndex = currTab;
    },

    load(tabIndex) {
      this.tableData[tabIndex].loading = true;
      this.tableData[tabIndex].items = [];
      AuthSingeltonService.httpGet(
        "session",
        { status: this.tableData[tabIndex].requestName },
        true
      )
        .then((r) => {
          r.body.forEach((r) => {
          //  r.canDelete = r.canDelete;
           this.tableData[tabIndex].items.push(r);
          });
        })
        .finally(() => {
          this.tableData[tabIndex].loading = false;
        });
    },

    onAction(e, index) {
      var dataset = this.tableData[index];
      console.log(e);
      switch (e.action) {
        case "edit":
          this.$router.push({ name: "NewSession", params: e.item });
          break;
        case "detail":
          this.showDetail(e);
          break;
        case "reject":
          this.reject(e, dataset);
          break;
        case "approve":
          this.approve(e, dataset);
          break;
        case "submit":
          this.submit(e, dataset);
          break;
        case "delete":
          this.delete(e, dataset);
      }
    },
    approve(row, dataset) {
      dataset.loading = true;
      var payload = { id: row.item.id };

      AuthSingeltonService.httpPost("Session/Approve", row.item.id, true)
        .then(
          (r) => {
            var copyRow = Object.assign({}, row.item);
            var index = dataset.items.findIndex((f) => {
              return f.id == row.item.id;
            });
            dataset.items.splice(index, 1);
            //approved dataset
            this.tableData[3].items.push(copyRow);
          },
          (error) => {
            console.log(error);
          }
        )
        .finally(() => {
          dataset.loading = false;
        });
    },

    reject(row, dataset) {
      dataset.loading = true;
      var payload = { id: row.item.id };

      AuthSingeltonService.httpPost("Session/Reject", row.item.id, true)
        .then(
          (r) => {
            var copyRow = Object.assign({}, row.item);
            var index = dataset.items.findIndex((f) => {
              return f.id == row.item.id;
            });
            dataset.items.splice(index, 1);
            //rejected dataset
            this.tableData[2].items.push(copyRow);
          },
          (error) => {
            console.log(error);
          }
        )
        .finally(() => {
          dataset.loading = false;
        });
    },

    submit(row, dataset) {
      dataset.loading = true;
      var payload = { id: row.item.id };

      AuthSingeltonService.httpPost("Session/Submit", row.item.id, true)
        .then(
          (r) => {
            var copyRow = Object.assign({}, row.item);
            var index = dataset.items.findIndex((f) => {
              return f.id == row.item.id;
            });
            dataset.items.splice(index, 1);
            //rejected dataset
            this.tableData[1].items.push(copyRow);
          },
          (error) => {
            console.log(error);
          }
        )
        .finally(() => {
          dataset.loading = false;
        });
    },

    showDetail(options) {
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
    },

    delete(row, dataset){
      dataset.loading = true;
      var payload = { id: row.item.id };

      AuthSingeltonService.httpDelete("Session", payload, true)
        .then(
          (r) => {
            var index = dataset.items.findIndex((f) => {
              return f.id == row.item.id;
            });
            dataset.items.splice(index, 1);
          },
          (error) => {
            console.log(error);
          }
        )
        .finally(() => {
          dataset.loading = false;
        });
    }
  },
};
</script>
<style lang="scss" >
.sub-section {
  overflow: hidden;
  background-color: #fff;
  .action-icon {
    font-size: 16px;
    cursor: pointer;
  }
  .header {
    background: url(/images/bg_dashboard.png) no-repeat;
    background-size: 100% 350px;
    background-attachment: fixed;
    padding-bottom: 0.75rem;
    .breadcrumb {
      margin-bottom: 0;
      background: inherit;
    }
    .title {
      padding: 0 1rem 1rem;
    }
  }
  td,
  th {
    font-size: 14px;
  }
  // td {
  //   text-overflow: ellipsis;
  //   overflow: hidden;
  //   white-space: nowrap;
  // }

 .draft-tab .nav-link{
    color:rgb(80,80,80);
   
    &.active{
  background-color: rgb(80,80,80);
   color:#fff;
    }
 }

   .rej-tab .nav-link{
       color: #ff4136 ;
         &.active{
  background-color:#ff4136;
   color:#fff;
    }
  }


 .sub-tab .nav-link{
      color:#5d9e06; 
        &.active{
  background-color: #5d9e06;;
   color:#fff;
    }
  }


 .app-tab .nav-link{
       color: #0B4280 ;
         &.active{
  background-color: #0B4280;
   color:#fff;
    }
  }
.nav-link{
 color:white;
}
  


}

 
</style>
