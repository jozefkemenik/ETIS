<template>
  <div class="participants">
    <div class="d-flex flex-row align-items-center justify-content-between">
      <span class="h5">{{ "ST_AddLearners" | translate }}</span>

      <div class="d-flex flex-row align-items-center justify-content-center">
        <b-button
          @click="tabParticipantsIndex = 1"
          variant="info"
          size="sm"
          class="mr-2"
          :class="{ active: tabParticipantsIndex == 1 }"
        >
          {{
            (this.role.name == "Trainer"
              ? "ST_AddMultipleTrainers"
              : "ST_AddMultipleParticipants") | translate
          }}</b-button
        >

        <b-button
          @click="tabParticipantsIndex = 2"
          variant="info"
          size="sm"
          class="mr-2"
          :class="{ active: tabParticipantsIndex == 2 }"
          ><div v-if="role.name == 'Trainer'">
            {{ formData ? "ST_EditTrainer" : "ST_AddTrainer" | translate }}
          </div>
          <div v-else>
            {{
              formData ? "ST_EditParticipant" : "ST_AddParticipant" | translate
            }}
          </div></b-button
        >

        <b-button
          @click="tabParticipantsIndex = 3"
          variant="info"
          size="sm"
          :class="{ active: tabParticipantsIndex == 3 }"
          >{{ "ST_UploadCSVFile" | translate }}</b-button
        >
      </div>
    </div>
    <div class="mt-2" v-if="tabParticipantsIndex == 0">
      <core-table-participants
        @action="onTableAction"
        v-if="showParticipantsTable"
        :data="participansTableData"
        :loading="loadingTable"
      />
    </div>
    <div class="mt-2" v-if="tabParticipantsIndex == 1">
      <session-new-step-three-participants-multiple-edit
        :loading="loadingForm"
        :data="xsdata"
        @action="onMultipleAction($event)"
      />
    </div>

    <div class="mt-2" v-if="tabParticipantsIndex == 2">
      <participants-edit
        :loading="loadingForm"
        :data="formData"
        @action="onFormAction($event)"
      />
    </div>

    <div class="mt-2" v-if="tabParticipantsIndex == 3">
      <core-file-uploader
        class="mt-3 mb-2 flex-columns h-100"
        @onChanged="onUplaodChanged"
      />
      <div class="d-flex flex-row align-items-center justify-content-end">
        <b-button size="sm" class="mr-2" @click="cancel">{{
          "ST_Cancel" | translate
        }}</b-button>
      </div>
    </div>
  </div>
</template>
<script>
import AuthSingeltonService from "@/auth/auth.singleton.service";
import ParticipantsEdit from "./ParticipantsEdit";
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    role: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      loadingTable: false,
      loadingForm: false,
      formData: null,
      xsdata: [],
      tabParticipantsIndex: 0,
      showParticipantsTable: true,
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
          {
            key: "actions",
            label: this.$options.filters.translate("ST_Actions"),
          },
        ],
        items: [],
      },
    };
  },
  watch: {},
  components: { ParticipantsEdit },
  methods: {
    onTableAction(item) {
      switch (item.action) {
        case "edit":
          {
            this.formData = item.item;
            this.$set(this, "tabParticipantsIndex", 2);
          }
          break;
        case "delete":
          {
            this.loadingForm = true;
            AuthSingeltonService.httpDelete("participant", {id:item.item.id},true).then(
                (r) => {
      
                },
                (error) => {
                  console.log(error);
                }
              )
              .finally(() => {
                this.loadingForm = false;
              });

        
          }
          break;
      }
    },
    cancel() {
      this.tabParticipantsIndex = 0;
      this.formData = null;
    },
    onFormAction(e) {
      var row = { sessionId: this.data.id, participantRoleId: this.role.id };

      switch (e.action) {
        case "edit":
          {
            this.loadingMultiple = true;
            e.payload.forEach((item) => {
              Object.assign(row, this.makePayLoad(item));
            });

            row.id = this.formData.id;
         
            AuthSingeltonService.httpPatch("participant", row, true)
              .then(
                (r) => {
                  this.updateTable(row);
                  this.tabParticipantsIndex = 0;
                  this.formData = null;
                },
                (error) => {
                  console.log(error);
                }
              )
              .finally(() => {
                this.loadingForm = false;
              });
          }
          break;
        case "new":
          {
            this.loadingForm = true;
            e.payload.forEach((item) => {
              Object.assign(row, this.makePayLoad(item));
            });
            AuthSingeltonService.httpPost("participant", row, true)
              .then(
                (r) => {
                  row.id = r.body.id;
                  this.insertTable(row);
                  this.tabParticipantsIndex = 0;
                },
                (error) => {
                  console.log(error);
                }
              )
              .finally(() => {
                this.loadingForm = false;
              });
          }
          break;
        case "cancel":
          this.cancel();
          break;
      }
    },

    onMultipleAction(e) {
      var row = {
        id: 0,
        sessionId: this.data.id,
        participantRoleId: this.role.id,
      };

      switch (e.action) {
        case "save":
          {
            this.loadingTable = true;
            e.payload.forEach((item) => {
              Object.assign(item, row);
            });
            AuthSingeltonService.httpPost(
              "participant/addbulk",
              e.payload,
              true
            )
              .then(
                (r) => {
                  e.payload.forEach((row, index) => {
                    row.id = r.body[index].id;
                    this.insertTable(row);
                  });
                  this.tabParticipantsIndex = 0;
                },
                (error) => {
                  console.log(error);
                }
              )
              .finally(() => {
                this.loadingTable = false;
              });
          }
          break;

        case "cancel":
          this.cancel();
          break;
      }
    },

    onUplaodChanged(e) {
      this.xsdata = e;
    },

    updateTable(item) {
      var row = this.participansTableData.items.find((r) => r.id == item.id);
      Object.assign(row, item);
    },

    insertTable(item) {
      this.participansTableData.items.push(item);
    },

    load() {
      this.loadingTable = true;
      var payload = { sessionId: this.data.id };
      AuthSingeltonService.httpGet("participant", payload, true)
        .then(
          (r) => {
            var res = r.body
              ? r.body.filter((r) => r.participantRoleId == this.role.id)
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
    onMultipleChanged(e) {},
  },
  created() {
    this.load();
  },
};
</script>


<style lang="scss" >
.participants {
  position: relative;
}
</style>