<template>
  <form @submit.prevent="submit" ref="reg-form" class="w-100">
    <core-spreadsheet-main
      :marked="markedCells"
      :data="cdData"
      @onChanged="onChanged($event)"
    />

    <div class="d-flex flex-row align-items-center justify-content-end mt-2">
      <b-button size="sm" class="mr-2" @click="cancel">{{
        "ST_Cancel" | translate
      }}</b-button>
      <b-button
        size="sm"
        variant="info"
        class=""
        :disabled="!isValid"
        @click="save"
        >{{ "ST_Save" | translate }}</b-button
      >
    </div>
  </form>
</template>


  


<script>
import { mapGetters } from "vuex";

export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    data: {
      immediate: false,
      handler: function (val) {
        this.parseData();
      },
    },
  },

  data() {
    return {
      isValid: false,
      markedCells: [],
      items: [],
      cdData: {
        rows: {},
        styles: [
          {
            border: {
              top: ["thin", "#900"],
              bottom: ["thin", "#900"],
              right: ["thin", "#900"],
              left: ["thin", "#900"],
            },
          },
        ],
      },
    };
  },

  computed: {
    ...mapGetters(["dictionary"]),
  },
  methods: {
    parseData() {
      var result = {};
      var indexCol = 0;
      this.data.forEach((row, indexRow) => {
        result[indexRow] = { cells: {} };
        this.items.forEach((col, indexCol) => {
          result[indexRow].cells[indexCol] = {
            text: row[indexCol] ? row[indexCol] : "",
          };
        });
      });
      this.cdData.rows = result;
    },
    save() {
      var payload = this.makePayeLoad();
      if (this.markedCells.length == 0 && payload.length > 0) {
        this.$emit("action", {
          action: "save",
          payload: payload,
        });
      }
    },
    cancel() {
      this.$emit("action", {
        action: "cancel",
      });
    },
    onChanged(e) {
      this.cdData.rows = e.rows;
      this.isValid = this.checkValidation();
    },
    makePayeLoad() {
      var rowIndex = -1;
      var markedCells = [];
      var tablerows = [];
      for (var rowname in this.cdData.rows) {
        rowIndex++;
        var tableRow = {};
        var row = this.cdData.rows[rowname];
        if (row.cells) {
          this.items.forEach((item, index) => {
            var cell = row.cells[index];
            if (cell) {
              if (item.idText) {
                tableRow[item.idText] = cell.text;
                var entry = item.items.find(
                  (f) => f.name.trim() == cell.text.trim()
                );
                if (!entry) {
                  markedCells.push({ x: index, y: rowIndex });
                  console.log(
                    item.items,
                    `the value: "${cell.text}" is not valid for ${item.idText}`
                  );
                } else {
                  tableRow[item.id] = entry.value;
                }
              } else {
                tableRow[item.id] = cell.text;
              }
            }
          });
          tablerows.push(tableRow);
        }
        console.log(markedCells);
        this.markedCells = markedCells;
      }
      return tablerows;
    },

    checkValidation() {
      var markedCells = [];
      var rowIndex = -1;
      for (var rowname in this.cdData.rows) {
        rowIndex++;
        var row = this.cdData.rows[rowname];
        if (row.cells) {
          this.items.forEach((item, colIndex) => {
            var cell = row.cells[colIndex];
            if (item.id == "email") {
              if (!cell || !this.testEmail(cell.text)) {
                markedCells.push({ x: colIndex, y: rowIndex });
              }
            }
            else
            if(cell && item.type== "text" && !this.testText(cell.text)){
                markedCells.push({ x: colIndex, y: rowIndex });
            }

            if (!cell || typeof cell.text == "undefined" || cell.text=='') {
              markedCells.push({ x: colIndex, y: rowIndex });
            }
          });
        }
      }
      this.markedCells = markedCells;
      console.log("this.markedCells", this.markedCells);
      return markedCells.length == 0;
    },
  },
  created() {
    this.items = [
      {
        type: "text",
        id: "name",
        value: null,
        label: "ST_FirstName",
        default: null,
        validation: {},
      },
      {
        type: "text",
        id: "surname",
        value: null,
        label: "ST_LastName",
        items: [],
        default: null,
        validation: {},
      },
      {
        type: "text",
        id: "username",
        value: null,
        label: "ST_Username",
        items: [],
        default: null,
        validation: {},
      },
      {
        type: "text",
        id: "email",
        value: null,
        label: "ST_Email",
        items: [],
        default: null,
        validation: {},
      },
      {
        type: "dd",
        id: "institution",
        idText: "institutionText",
        value: null,
        label: "ST_Institution",
        items: this.dictionary.participantOrganiserInstitution.MapToDDControl(),
        default: null,
        validation: {},
      },
      {
        type: "dd",
        id: "framework",
        idText: "frameworkText",
        value: null,
        label: "ST_Framework",
        items: this.dictionary.participantFramework.MapToDDControl(),
        default: null,
        validation: {},
      },
      {
        type: "dd",
        id: "targetGroup",
        idText: "targetGroupText",
        value: null,
        label: "Target group",
        items: this.dictionary.participantTargetGroup.MapToDDControl(),
        default: null,
        validation: {},
      },
    ];
    this.parseData();
  },
  mounted() {
    this.isValid = this.checkValidation();
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  width: 80%;
  float: left;
}
.title {
  margin: 0;
  padding: 0;
}

label {
  //  margin-bottom: 0px;
  font-size: 14px;
}
</style>