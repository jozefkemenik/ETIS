<template>
  <div class="h-100 draft-section d-flex flex-column">
    <section class="header">
      <b-breadcrumb :items="items"></b-breadcrumb>
      <span class="h4 title">{{ "ST_HomeBoxTitle_2" | translate }}</span>
    </section>
    <section class="body d-flex flex-column" :class="{ 'h-100': loadingDraft }">
      <div class="container-fluid mt-3 d-flex flex-column h-100">
        <b-table
          ref="drafTable"
          v-if="!loadingDraft"
          responsive
          show-empty
          striped
          hover
          :items="draftTableData.items"
          :fields="draftTableData.fields"
          @row-hovered="selectRow"
          @row-unhovered="unselectRow"
        >
          <template #head()="data">
            <div class="text-nowrap">{{ data.label }}</div>
          </template>

          <template #cell(id)="{ item }">
            <template v-if="item.active">
              <b-button @click="editSession(item)" variant="info"
                ><i style="color: #fff" class="fas fa-edit"></i
              ></b-button>
            </template>
            <template v-else>
              {{ item.id }}
            </template>
          </template>

          <template #empty="">
            <div class="text-center">
              <h4>{{ "ST_NoRecordsAvailable" | translate }}</h4>
            </div>
          </template>
        </b-table>

        <div
          v-else
          class="d-flex flex-row align-items-center justify-content-center h-100"
        >
          <b-spinner
            class="global-spinner"
            :variant="'primary'"
            type="grow"
          ></b-spinner>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import AuthSingeltonService from "@/auth/auth.singleton.service";
export default {
  props: {
    selection: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      loadingDraft: false,
      rowActive: false,
      items: [
        {
          text: this.$options.filters.translate("ST_Home"),
          href: "/",
        },
        {
          text: this.$options.filters.translate("ST_HomeBoxTitle_2"),
          href: "#",
        },
      ],
      draftTableData: {
        fields: [
          {
            key: "id",
            label: `${this.$options.filters.translate("ST_Session")} ID`,
            sortable: true,
            class: "center",
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
        ],
        items: [],
      },
    };
  },
  components: {},
  computed: {
    ...mapGetters(["config"]),
  },
  created() {
    this.loadDraft();
  },

  methods: {
    editSession(row) {
      this.$router.push({ name: "NewSession", params: row  });
    },
    selectRow(row, index) {
      this.$set(row, "active", true);
    },
    unselectRow(row) {
      this.$set(row, "active", false);
    },
    loadDraft() {
      this.draftTableData.items = [];
      this.loadingDraft = true;









      AuthSingeltonService.httpGet("session", {},true)
        .then((r) => {
          r.body.forEach((r) => {
            this.draftTableData.items.push(r);
          });
        })
        .finally(() => {
          this.loadingDraft = false;
        });
    },
  },
};
</script>
<style lang="scss" >
.draft-section {
  .body {
    overflow: hidden;

    tr:hover td.center {
      vertical-align: middle;
    }
  }
  .header {
    background: url(/images/bg_dashboard.png) no-repeat;
    background-size: 100% 55%;
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
  // overflow: hidden;
  background-color: #fff;
}
</style>
