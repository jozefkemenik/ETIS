<template>
  <div class="detail-session-modal">
    <b-tabs pills card vertical @input="changedTab">
      <b-tab :title="'ST_TrainingSession' | translate" active
        ><b-card-text>
          <table>
            <tr v-for="(item, index) in items[0]" v-bind:key="index">
              <td>
                <b>{{ item.label | translate }} </b>
              </td>
              <td style="padding-left: 20px">
                <div v-if="item.type == 'cal'">
                  {{ new Date(options.item[item.id]).toLocaleDateString() }}
                </div>
                <div v-if="!item.type">{{ options.item[item.id] }}</div>
                <div v-if="item.type == 'ryn'">
                  <b-form-checkbox v-model="options.item[item.id]">{{
                    options.item[item.id]
                  }}</b-form-checkbox>
                </div>
              </td>
            </tr>
          </table>
        </b-card-text></b-tab
      >
      <b-tab :title="'ST_NewCourseDetails' | translate"
        ><b-card-text>
          <table>
            <tr v-for="(item, index) in items[1]" v-bind:key="index">
              <td>
                <b>{{ item.label | translate }} </b>
              </td>
              <td style="padding-left: 20px">
                <div v-if="item.type == 'cal'">
                  {{ new Date(options.item[item.id]).toLocaleDateString() }}
                </div>
                <div v-if="!item.type">{{ options.item[item.id] }}</div>
                <div v-if="item.type == 'ryn'">
                  <b-form-checkbox
                    v-model="options.item[item.id]"
                  ></b-form-checkbox>
                </div>
              </td>
            </tr></table></b-card-text
      ></b-tab>
      <b-tab :title="'ST_Participants' | translate"
        ><b-card-text>
          <core-table-participants
            :data="participansTableData"
            :loading="loadingTable"
          /> </b-card-text
      ></b-tab>
      <b-tab :title="'ST_Trainers' | translate"
        ><b-card-text>
          <core-table-participants
            :data="trainersTableData"
            :loading="loadingTable"
          /> </b-card-text
      ></b-tab>
    </b-tabs>

    <!-- 
      <table>
    <tr v-for="(item, index) in items" v-bind:key="index">
     <td> <b>{{ item.label | translate }} </b></td><td style="padding-left:20px;">{{ options.item[item.id] }}</td>
    </tr>
    </table> -->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import AuthSingeltonService from "@/auth/auth.singleton.service";
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      loadingTable: false,
      studentRole: null,
      trainerRole: null,
      participansTableData: {
        fields: [
          {
            key: "name",
            label: this.$options.filters.translate("ST_FirstName"),
            sortable: true,
          },
          {
            key: "surname",
            label: this.$options.filters.translate("ST_LastName"),
            sortable: true,
          },
          {
            key: "email",
            label: this.$options.filters.translate("ST_Email"),
            sortable: true,
          },
          {
            key: "username",
            label: this.$options.filters.translate("ST_Username"),
            sortable: true,
          },
          {
            key: "institutionText",
            label: this.$options.filters.translate("ST_Institution"),
            sortable: true,
          },
        ],
        items: [],
      },
       trainersTableData: {
        fields: [
          {
            key: "name",
            label: this.$options.filters.translate("ST_FirstName"),
            sortable: true,
          },
          {
            key: "surname",
            label: this.$options.filters.translate("ST_LastName"),
            sortable: true,
          },
          {
            key: "email",
            label: this.$options.filters.translate("ST_Email"),
            sortable: true,
          },
          {
            key: "username",
            label: this.$options.filters.translate("ST_Username"),
            sortable: true,
          },
          {
            key: "institutionText",
            label: this.$options.filters.translate("ST_Institution"),
            sortable: true,
          },
        ],
        items: [],
      },
      items: [
        [
          {
            type: "ryn",
            id: "certified",
            label: "ST_MainDetailsCertified",
          },
          {
            id: "languageText",
            label: "ST_MainDetailsLanguage",
          },
          {
            id: "masterCourseName",
            label: "ST_MainDetailsCourse",
          },
          {
            id: "organiserText",
            label: "ST_MainDetailsOrganizer",
          },
          {
            type: "ryn",
            id: "visibility",
            label: "ST_MainDetailsMoodle",
          },
          {
            id: "deliveryText",
            label: "ST_SessionDeliveryHow",
          },
          {
            id: "countryText",
            label: "ST_SessionDeliveryCountry",
          },
          {
            id: "cityText",
            label: "ST_SessionDeliveryCity",
          },
          {
            id: "frameworkText",
            label: "ST_SessionContentFramework",
          },
          {
            id: "scopeText",
            label: "ST_SessionContentScopeTrainig",
          },
          {
            id: "organiserInstitutionText",
            label: "ST_SessionContentOrganizer",
          },
          {
            type: "ryn",
            id: "pilot",
            label: "ST_SessionContentPilot",
          },
          {
            id: "contentText",
            label: "ST_SessionContentWhat",
          },
          {
            id: "trainingProgrammeText",
            label: "ST_SessionContentProgramme",
          },
        ],
        [
          {
            id: "typeText",
            label: "ST_SelectCourseType",
          },
          {
            id: "languageText",
            label: "ST_MainDetailsLanguage",
          },
          {
            id: "frameworkText",
            label: "ST_SessionContentFramework",
          },
          {
            type: "cal",
            id: "onlineStartDate",
            label: "ST_OnlineStartDate",
          },
          {
            type: "cal",
            id: "onlineEndDate",
            label: "ST_OnlineEndDate",
          },
          {
            type: "cal",
            id: "faceStartDate",
            label: "ST_FaceStartDate",
          },
          {
            type: "cal",
            id: "faceEndDate",
            label: "ST_FaceEndDate",
          },
        ],
      ],
    };
  },
  created() {
    this.studentRole = this.dictionary.participantRoles.find(
      (r) => r.name == "Student"
    );
    this.trainerRole = this.dictionary.participantRoles.find(
      (r) => r.name == "Trainer"
    );
  },
  computed: {
    ...mapGetters(["dictionary"]),
  },
  methods: {
    changedTab(currTab) {
      if (currTab == 2) {
        this.loadParticipants();
      }
      if (currTab == 3) {
        this.loadTrainers();
      }
    },
    loadParticipants() {
      this.loadingTable = true;
      AuthSingeltonService.httpGet(
        "Participant",
        { sessionId: this.options.item["id"] },
        true
      )
        .then(
          (r) => {
            var res = r.body
              ? r.body.filter((r) => r.participantRoleId == this.studentRole.id)
              : [];
            this.participansTableData.items = res;
          },
          (error) => {
            console.log(error);
          }
        )
        .finally(() => {
          this.loadingTable = false;
        });
    },
    loadTrainers() {
      this.loadingTable = true;
      AuthSingeltonService.httpGet(
        "Participant",
        { sessionId: this.options.item["id"] },
        true
      )
        .then(
          (r) => {
            var res = r.body
              ? r.body.filter((r) => r.participantRoleId == this.trainerRole.id)
              : [];
            this.trainersTableData.items = res;
          },
          (error) => {
            console.log(error);
          }
        )
        .finally(() => {
          this.loadingTable = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.detail-session-modal {
  td.value {
    padding-left: 20px;
  }
}
</style>