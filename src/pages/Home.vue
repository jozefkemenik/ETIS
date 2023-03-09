<template>
  <div class="h-100"  ref="scrollableContainer">
    <section class="">
      <div class="container " >
        <div class="h3 my-5">{{ "ST_HomeWelcomeText" | translate }}</div>

        <div class="row">
          <div class="mb-4 d-flex col justify-content-around" :class="item.class" v-for="(item,index) in items" v-bind:key="item.id">
   
            <div class="action-box d-flex flex-column justify-content-between">
              <div>
                <div class="d-flex flex-row justify-content-left align-items-center mb-1">
                <span  class="number-circle text-info "><i v-if="item.id==1" class="fa fa-plus"></i>
                <span v-else>{{(index+1)*10}}</span>
                </span>
                <div class="title h5">
                  {{ `ST_HomeBoxTitle_${item.id}` | translate }}
                </div>
                </div>
                <span class="desc">
                  {{ `ST_HomeBoxText_${item.id}` | translate }}
                </span>
              </div>

              <b-button block squared variant="success" :to="item.to">{{
                `ST_HomeBoxBtn_${item.id}` | translate
              }}</b-button>
            </div>
          </div>
        </div>
        <div class="splitter mb-5 mt-4"></div>
        <div class="d-flex flex-row justify-content-between flex-wrap">
          <div class="mb-4" v-for="item in itemsSmaller" v-bind:key="item.id">
            <div class="d-flex flex-row action-box-smaller">
              <div
                v-if="item.icon"
                class="d-flex flex-column justify-content-center"
              >
                <i :class="`fas fa-${item.icon}`"></i>
              </div>

              <div>
                <div class="title h5">
                  {{ `ST_HomeBoxSmallerTitle_${item.id}` | translate }}
                </div>
                <a href=""
                  ><span class="desc">
                    {{ `ST_HomeBoxSmallerText_${item.id}` | translate }}
                  </span></a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import $ from "jquery";
export default {
  props: {
    selection: {
      type: String,
      default: null,
    },
  },
  created(){
    
  },
 mounted() {
    var ref = this.$refs["scrollableContainer"];
    $(ref).mCustomScrollbar({
      axis: "y",
      theme: "inset-2-dark",
      autoHideScrollbar: true,
      scrollbarPosition: "inside",
      autoExpandScrollbar: true,
      autoDraggerLength: true,
    });
  },
  data() {
    return {
      items: [
        {
          id: 1,
          to: "/newsession",
          class:"new-session"
        },
        {
          id: 2,
          to: "/sessions",
        },
        {
          id: 3,
          to: "/sessions?tab=sub",
        },
         {
          id: 4,
          to: "/sessions?tab=rej",
          class:"col-custom-left"
        },
         {
          id: 5,
          to: "/sessions?tab=app",
          class:"col-custom-right"
        },
      ],
      itemsSmaller: [
        {
          id: 1,
          icon: null,
        },
        {
          id: 2,
          icon: "book-reader",
        },
        {
          id: 3,
          icon: "question-circle",
        },
      ],
    };
  },
  components: {},
  computed: {
    ...mapGetters(["config","isOP","isELearning","isNCP"]),
    links() {
      var result = [];
      for (var item in this.config.links) {
        result.push(this.config.links[item]);
      }
      return result;
    },
  },

  methods: {
    cardClick(url) {
      window.open(url, "_blank");
    },
  },
};
</script>
<style lang="scss" scoped>
.action-box {
  cursor: pointer;
  position: relative;
  padding: 20px;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgb(225, 225, 225);
  border-radius: 5px;
  box-shadow: 0 0 3px #cccccc;

  // box-shadow: 0 0 1.25rem rgba(31, 45, 61, 0.05);
  width: 320px;
  min-height: 200px;
  transition: all 300ms ease-in-out;
  -webkit-transition: all 300ms ease-in-out;
  .title {
  }
  .desc {
    margin-top: 20px;
    font-size: 13px;
  }
  &:hover {
    box-shadow: 0px 0px 10px 1px #cccccc;
    // background-color: rgb(68, 157, 209);
    // .title {
    //   color: #fff;
    // }
    // .desc {
    //   color: #fff;
    // }
    // .btn{
    //   background-color:rgb(80,80,80,0.7);
    //   border: 1px solid rgba(80,80,80);
    //   &:hover{
    //      background-color:rgb(80,80,80);
    //   }
    // }
  }
}

.action-box-smaller {
  cursor: pointer;
  position: relative;
  padding: 20px 30px;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 2px solid rgba(210, 210, 210);
  border-radius: 5px;
  box-shadow: 0 0 11px 5px rgb(116, 110, 110, 0.1);

  transition: all 300ms ease-in-out;
  -webkit-transition: all 300ms ease-in-out;
  width: 320px;
  min-height: 130px;
  .title {
  
  }
  .desc {
    margin-top: 20px;
    color: rgb(105, 165, 25);
  }
  i {
    font-size: 36px;
    padding-right: 20px;
  }

  &:hover {
    box-shadow: 0 0 11px 5px rgb(68, 157, 209, 0.1);
    background-color: rgb(68, 157, 209);
    .title,
    .desc,
    i,
    a {
      color: #fff;
    }
  }
}
.number-circle {
  margin-right: 20px;

    display:inline-block;
    line-height:0px;
    
    border-radius:50%;
    border:2px solid;
    
    font-size:32px;

        width: 53px;
    height: 53px;

}

.number-circle span, .number-circle i   {
    display:table-cell;   
    vertical-align: middle;
    height:53px;
    width:53px;
    text-align: center;
}

// .new-session .number-circle i {
//     display:inline-block;
    
//     padding-top:10px;
//     padding-bottom:10px;
//   margin-left:10px;;
//     margin-right:10px;
// }
.mCustomScrollbar{
  height:160px;
}


@media (min-width: 1200px){
  .col-custom-left.justify-content-around{
    justify-content: flex-end !important;
    margin-right:15px;
  }
    .col-custom-right.justify-content-around{
   justify-content: flex-start !important;
   margin-left:15px;
  }
}

</style>
