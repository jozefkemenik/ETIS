<template>
  <div
    class="d-flex h-100 flex-column justify-content-center align-items-center w-100 h-screen"
  >
    <div
      class="d-flex h-100 flex-column justify-content-center align-items-center w-100 p-12 bg-gray-100 file-box"
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop"
    >
      <input
        type="file"
        multiple
        name="fields[assetsFieldHandle][]"
        :id="id"
        class="hidden"
        @change="onChange"
        ref="file"
        accept=".pdf,.jpg,.jpeg,.png"
      />

      <label :for="id" class="block cursor-pointer w-100 d-flex flex-row">
        <div
          class="w-100 d-flex flex-row justify-content-center flex-wrap align-items-center text-success"
        >
          <i class="fas fa-upload text-primary" style="font-size: 28px"></i>
        </div>
      </label>
      <ul class="mt-4" v-if="this.filelist.length">
        <li
          class="text-sm"
          v-for="(file, index) in filelist"
          v-bind:key="index"
        >
          <b-icon
            icon="x-circle-fill"
            class="selectable"
            @click="remove(file)"
            variant="primary"
            animation="fade"
          />
          {{ file.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import //required
//email,
// minLength,
// requiredIf,
//  helpers
"vuelidate/lib/validators";
export default {
  props: {
    id: {
      type: String,
      default: null,
    },
  },

  watch: {},

  data() {
    return {
      filelist: [],
    };
  },

  computed: {},

  methods: {
    onChange() {
      this.filelist = [...this.$refs.file.files];
    },
    remove(file) {
      var i = this.filelist.indexOf(file);
      this.filelist.splice(i, 1);
    },
    dragover(event) {
      event.preventDefault();
      // Add some visual fluff to show the user can drop its files
      if (!event.currentTarget.classList.contains("bg-green-300")) {
        event.currentTarget.classList.remove("bg-gray-100");
        event.currentTarget.classList.add("bg-green-300");
      }
    },
    dragleave(event) {
      // Clean up
      event.currentTarget.classList.add("bg-gray-100");
      event.currentTarget.classList.remove("bg-green-300");
    },
    drop(event) {
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      var reader = new FileReader();
      var _this= this;
      reader.onload = function () {
           _this.$emit("onChanged", parseCSV(reader.result, '\n', ';'));
      };
      reader.readAsText(this.$refs.file.files[0]);

      this.onChange(); // Trigger the onChange event manually
      // Clean up
      event.currentTarget.classList.add("bg-gray-100");
      event.currentTarget.classList.remove("bg-green-300");
    },
  },
  created() {},
};

function parseCSV(text, lineTerminator, cellTerminator) {
  var table = [];
  //break the lines apart
  var lines = text.split(lineTerminator);
  for (var j = 0; j < lines.length; j++) {
    if (lines[j] != "") {
      //create a table row
      var tableRow = [];
      //split the rows at the cellTerminator character
      var information = lines[j].split(cellTerminator);
      for (var k = 0; k < information.length; k++) {
        tableRow.push(information[k]);
      }
      table.push(tableRow);
    }
  }
  return table;
}
</script>
<style lang="scss" scoped>
ul {
  list-style-type: none;
}
.file-box {
  width: 100%;
  padding: 10px 40px;
  word-wrap: break-word;
  background-color: #ebebeb;
  background-clip: border-box;
  border: 1px solid rgb(225, 225, 225);
  border-radius: 5px;
  box-shadow: 0 0 3px #cccccc;

  transition: all 300ms ease-in-out;
  -webkit-transition: all 300ms ease-in-out;
}
</style>