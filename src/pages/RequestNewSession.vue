<template>
  <div class="h-100">
    <core-stepper-horizontal
      class="h-100"
      :steps="wizardSteps"
      :shownumber="true"
      @onChanged="onChanged"
      :loading="loading"
      @stepChanged="
        (e) => {
          stepIndex = e;
        }
      "
    >
      <template v-slot:footer="{ commands }">
        <div
          class="d-flex h-100 flex-row align-items-center justify-content-left"
        >
          <b-button class="action-btn" squared size="sm" variant="default">{{
            "ST_Cancel" | translate
          }}</b-button>
          <b-button
            :disabled="loading || !commands.canBack()"
            @click="commands.back()"
            class="action-btn"
            squared
            size="sm"
            variant="success"
            ><i class="fas fa-angle-left"></i>
            {{ "ST_Back" | translate }}</b-button
          >

          <b-button
            v-if="stepIndex < 2"
            :disabled="loading || !commands.canNext()"
            @click="parseCommand(commands)"
            class="action-btn"
            squared
            size="sm"
            variant="success"
            >{{ "ST_Next" | translate }} <i class="fas fa-angle-right"></i
          ></b-button>

          <b-button
            v-if="stepIndex == 2"
            :disabled="loading"
            @click="submitSession()"
            class="action-btn"
            squared
            size="sm"
            variant="primary"
            ><i class="fas fa-paper-plane"></i>
            {{ "ST_SubmitRequest" | translate }}</b-button
          >

          <b-button
            v-if="stepIndex > 0 && commands.canNext()"
            :disabled="loading"
            @click="saveDraft()"
            class="action-btn"
            squared
            size="sm"
            variant="primary"
            ><i class="fas fa-save"></i> {{ "ST_Save" | translate }}
          </b-button>
        </div>
      </template>
    </core-stepper-horizontal>
  </div>
</template>

<script>
import AuthSingeltonService from "@/auth/auth.singleton.service";
export default {
  data() {
    return {
      loading: false,
      payload: {},
      stepIndex: 0,
      canNext: true,
      wizardSteps: [
        {
          title: "ST_TrainingSession",
          component: "session-new-step-one-main",
          data: {},
        },
        {
          title: "ST_NewCourseDetails",
          component: "session-new-step-two-main",
          data: {},
        },
        {
          title: "ST_ParticipantsAndTrainers",
          component: "session-new-step-three-main",
          data: {},
        },
      ],
    };
  },
  created() {
    // init controls from draft
    this.wizardSteps.forEach((ws) => {
      ws.data = this.$route.params;
    });
  },

  methods: {
    onChanged(e) {
      var payload = {};
      if (e.payload) {
        e.payload.forEach((e1) => {
          e1.items.forEach((e2) => {
            Object.assign(payload, this.makePayLoad(e2));
          });
        });
      }
      Object.assign(this.payload, payload);
      Object.assign(this.$route.params, payload);
    },
    parseCommand(commands) {
      switch (this.stepIndex) {
        case 0:
          //pass mastercourseid from step 1 into step 2
          commands.next();
          break;
        case 1:
          // this.saveDraft();
          commands.next();
          break;
        case 2:
          commands.next();
          break;
      }
    },
    saveDraft() {
      this.$set(this, "loading", true);
      this.payload.id = this.$route.params.id;

      if (this.payload.id) {
        AuthSingeltonService.httpPatch("session", this.payload, true)
          .then(
            (r) => {},
            (error) => {
              console.log(error);
            }
          )
          .finally(() => {
            this.$set(this, "loading", false);
          });
      } else {
        AuthSingeltonService.httpPost("session", this.payload, true)
          .then(
            (r) => {
              this.$route.params.id = r.body;
            },
            (error) => {
              console.log(error);
            }
          )
          .finally(() => {
            this.$set(this, "loading", false);
          });
      }
    },
    submitSession() {
      this.$set(this, "loading", true);

      AuthSingeltonService.httpPost(
        "session/submit",
        this.$route.params.id,
        true
      )
        .then(
          (r) => {
            this.wizardSteps[2].component = "";
            this.confirmRequest();
          },
          (error) => {
            console.log(error);
          }
        )
        .finally(() => {
          this.$set(this, "loading", false);
        });
    },

    confirmRequest() {
      const h = this.$createElement;
      // Using HTML string
      const titleVNode = h("div", {
        domProps: { innerHTML: "Request Status" },
      });
      // More complex structure
      const messageVNode = h("div", { class: ["foobar"] }, [
        h("p", { class: ["text-center"] }, [
          h(
            "strong",
            "Your request for creating new session was sent sucessfully!"
          ),
        ]),
      ]);
      this.$bvModal
        .msgBoxOk([messageVNode], {
          title: [titleVNode],
          buttonSize: "sm",
          centered: true,
          size: "sm",
          id: "modal-request-session-id",
        })
        .then(() => {
          this.$router.push({ name: "Home" });
        });
    },
  },
};
</script>


<style  lang="scss">
@import "@/theme/index.scss";

.action-btn {
  margin-right: 20px;
  i {
    color: #fff;
  }
}

.v-step-content {
  width: 80%;
}
</style>
