<template>
  <div>
    <div ref="xspreadsheet" />
  </div>
</template>
<script>
import Spreadsheet from "x-data-spreadsheet";

export default {
  props: {
    data: {
      type: Object,
      default: function () {
        return { rows: {}, cols: {} };
      },
    },
    marked: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      spreadSheet: null,
    };
  },
  watch: {
    "data": {
      handler: function () {
    
      
      },
    },
    marked: {
      handler: function (val, before) {
        if (this.spreadSheet) {
          before.forEach((el) => {
            var cell = this.spreadSheet.cell(el.y, el.x);
            if(cell) delete cell["style"];
          });
          val.forEach((el) => {
            var cell = this.spreadSheet.cell(el.y, el.x);
            if(cell) cell.style = 0;
          });
         this.spreadSheet.reRender();
        }
      },
      deep: true,
    },
  },
  created: function () {},

  destroyed: function () {},
  methods: {
    validate() {},
  },

  mounted() {
    this.spreadSheet = new Spreadsheet(
      this.$refs.xspreadsheet,

      {
        mode: "edit", // edit | read
        showToolbar: true,
        showGrid: true,
        showContextmenu: true,
        view: {
          height: () => 333,
          width: () =>
            this.$refs.xspreadsheet && this.$refs.xspreadsheet.offsetWidth
              ? this.$refs.xspreadsheet.offsetWidth
              : 0,
        },
      }
    ).change((cdata) => {
      this.$emit("onChanged", cdata);
    });

    console.log(this.spreadSheet);
    if (this.data) {
      this.spreadSheet.loadData([this.data]);
    }
  },
};
</script>
<style >
.x-spreadsheet-bottombar {
  display: none;
}
</style>