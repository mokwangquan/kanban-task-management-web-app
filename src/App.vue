
<template>
  <div id="app">
    <div class="font-xl">XL size wording</div>
    <div class="font-l">L size wording</div>
    <div class="font-m">M size wording</div>
    <div class="font-s">S size wording</div>
    <div class="font-normal">normal size wording</div>
    <div class="font-bold">normal bold size wording</div>

    <br/>
    <br/>
    <br/>

    <el-button class="primary size-l">Button Primary (L)</el-button>
    <el-button class="primary size-s">Button Primary (S)</el-button>
    <el-button class="secondary size-s">Button Secondary</el-button>
    <el-button class="danger size-s">Button Destructive</el-button>

    <br/>
    <br/>
    <br/>
    
    <el-form :form="form" label-position="top" :rules="rules">
      <el-row type="flex" justify="space-around" :gutter="40">
        <el-col>
          <el-form-item prop="1" label="Subtask Checkbox">
            <el-checkbox :value="false" label="Idle" border />
            <el-checkbox :value="false" label="Hovered" border />
            <el-checkbox :value="true" label="Completed" border />
          </el-form-item>
        </el-col>
        <el-col>
            <el-form-item prop="1" label="Text Field (Idle)">
              <el-input placeholder="Enter task name" />
            </el-form-item>
            <el-form-item prop="2" label="Text Field (Active)">
              <el-input value="Building a slideshow" />
            </el-form-item>
            <el-form-item prop="test" label="Text Field (Error)">
              <el-input placeholder="Enter task name" />
            </el-form-item>
        </el-col>
        <el-col>
          <el-form-item prop="1" label="Dropdown (Idle)">
            <el-select :value="options[1]">
              <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="1" label="Dropdown (Idle)">
            <el-select :value="options[1]">
              <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>
export default {
  computed: { },
  data() {
    return {
      form: {
        1: "",
        2: "",
        3: "",
      },
      rules: {
        test: { required: true }
      },
      options: [
        "Todo", "Doing", "Done"
      ],
    }
  },
  watch: { },
  methods: { },
  mounted() { },
};
</script>

<style lang="scss">
// import third party first
@import "https://unpkg.com/element-ui/lib/theme-chalk/index.css";
@import "@/assets/style/element-variables.scss";

// Then only import local, to allow overriding
@import "@/assets/style/main.scss";
@import "@/assets/style/_variables.scss";

.el-select-dropdown.el-popper {

}


</style>