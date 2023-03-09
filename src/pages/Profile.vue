<template>
  <div
    class="mt-5 "
  >
    <div class="container">
  <b-card >
 <b-card-header header-bg-variant="primary">

   <div class="d-flex  text-info  flex-row align-items-center justify-content-start">
   <i class='far fa-address-card text-white' style="font-size:2rem"></i> <h4 class="ml-3 text-white mb-0">User profile</h4> 
   
    </div>
   </b-card-header>

    <b-card-body>
         
          <core-dynamic-control-main
            :controls="formItems"
            @onChanged="onChanged($event)"
          />
         
       </b-card-body>
       <b-card-footer>

          <div
            class="d-flex   flex-row align-items-center justify-content-end"
          >
            <b-button
             
              :disabled="!isValid || loading"
              @click="update()"
              class="text-white"
              squared
              size="sm"
              variant="info"
              ><i class="fas fa-save text-white"></i> {{ "ST_Save" | translate }}
            </b-button>
            
    </div>
       </b-card-footer>
       </b-card>
  
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import AuthSingeltonService from "@/auth/auth.singleton.service";
import SessionDetail from "@/components/session/SessionDetail.vue";
import {
  required,
  //email,
  // minLength,
  // requiredIf,
  //  helpers
} from "vuelidate/lib/validators";
export default {
  props: {
   
  },
  data() {
    return {
      formItems: null,
      isValid: false,
      loading:false
    };
  },
  components: {},
  computed: {
    ...mapGetters(["config", "dictionary", "user"]),
  },
  created() {
    this.formItems = [
      {
        type: "text",
        id: "name",
        value: null,
        label: "ST_Name",
        default: null,
        validation: {},
        readonly:true
      },
      {
        type: "text",
        id: "surname",
        value: null,
        label: "ST_Surname",
        items: [],
        default: null,
        validation: {},
        readonly:true
      },                                                                                                                                                                                                                
      {
        type: "text",
        id: "email",
        value: null,
        label: "ST_Email",
        items: [],
        default: null,
        validation: {},
        readonly:true
      },

      {
        toUpdate: true,
        type: "dd",
        id: "countryId",
        value: null,
        label: "ST_Country",
        items: this.dictionary.userProfileCountries.MapToDDControl(),
        default: null,
        validation: {
          required,
        },
      },
      {
        toUpdate: true,
        type: "dd",
        id: "organisationId",
        value: null,
        label: "ST_Organisation",
        items: this.dictionary.userProfileOrganisations.MapToDDControl(),
        default: null,
        validation: {
          required,
        },
      },

      {
        toUpdate: true,
        type: "dd",
        id: "positionId",
        value: null,
        label: "ST_Position",
        items: this.dictionary.userProfilePositions.MapToDDControl(),
        default: null,
        validation: {
          required,
        },
      },
    ];
    this.initValues(this.formItems, this.user.profile);

  },
  mounted(){
        this.isValid = this.checkValidation();
  },

  methods: {
    onChanged() {
      this.isValid = this.checkValidation();
    },
    checkValidation() {
      var isValid = true;
      this.formItems.forEach((r) => {
        r.$v.$touch();
        isValid = isValid && !r.$v.$invalid;
      });
      return isValid;
    },
    update() {
      this.loading = true;
      var payLoad = {};
      this.formItems
        .filter((f) => f.toUpdate)
        .forEach((item) => {
          Object.assign(payLoad, this.makePayLoad(item));
        });
      AuthSingeltonService.httpPost("user", payLoad, true)
        .then((r) => {})
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
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
}
.content-scrollable {
  max-height: calc(100% - 280px);
  position: absolute;
  display: block;
  left: 0;
  right: 0;
}
</style>
